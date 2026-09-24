import asyncio
import json
import secrets
import time
from collections import deque
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import asdict
from typing import Any
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, ConfigDict, Field, SecretStr
from sqlalchemy import select, text
from sqlalchemy.exc import SQLAlchemyError
from starlette.middleware.trustedhost import TrustedHostMiddleware

from aura import auth
from aura.common import Conflict
from aura.config import Settings
from aura.contracts import Overview
from aura.events import Event, recent
from aura.ledger import Journal, snapshot
from aura.operations import change_control, locked_gate
from aura.storage import Database
from aura.strategies import PODS


class Login(BaseModel):
    model_config = ConfigDict(extra="forbid")
    key: SecretStr


class ControlCommand(BaseModel):
    model_config = ConfigDict(extra="forbid")
    active: bool
    expected_version: int = Field(ge=1)
    reason: str = Field(min_length=4, max_length=500)
    command_id: UUID


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()  # type: ignore[call-arg]
    db = Database(settings.database_url.get_secret_value())

    @asynccontextmanager
    async def lifespan(app: FastAPI):  # type: ignore[no-untyped-def]
        yield
        db.engine.dispose()

    app = FastAPI(
        title="Aura local foundation",
        version="0.0.1",
        lifespan=lifespan,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    app.state.database = db
    app.add_middleware(
        TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "testserver"]
    )
    attempts: deque[float] = deque()

    @app.middleware("http")
    async def browser_boundary(request: Request, call_next):  # type: ignore[no-untyped-def]
        if request.method not in {"GET", "HEAD", "OPTIONS"}:
            # Same-origin browser commands, no wildcard CORS or credentials in URLs.
            origin = request.headers.get("origin")
            if origin and origin not in {
                "http://127.0.0.1:5173",
                "http://localhost:5173",
                "http://127.0.0.1:8000",
                "http://localhost:8000",
            }:
                return JSONResponse({"detail": "Origin denied"}, status_code=403)
            if request.headers.get("x-aura-command") != "1":
                return JSONResponse({"detail": "Command header required"}, status_code=403)
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response

    def owner(request: Request) -> None:
        with db.transaction() as session:
            if not auth.authorized(session, request.cookies.get("aura_session")):
                raise HTTPException(401, "Owner sign-in required")

    @app.exception_handler(Conflict)
    async def conflict(request: Request, exc: Conflict) -> JSONResponse:
        return JSONResponse({"detail": str(exc)}, status_code=409)

    @app.exception_handler(SQLAlchemyError)
    async def database_failure(request: Request, exc: SQLAlchemyError) -> JSONResponse:
        return JSONResponse(
            {"detail": "Database unavailable; execution remains disabled"}, status_code=503
        )

    @app.get("/api/health")
    def health() -> dict[str, str]:
        with db.transaction() as session:
            session.execute(text("SELECT 1"))
        return {"database": "CONNECTED", "execution": "DISABLED", "environment": "LOCAL"}

    @app.post("/api/session")
    def login(body: Login, response: Response) -> dict[str, bool]:
        current = time.monotonic()
        while attempts and attempts[0] < current - 60:
            attempts.popleft()
        if len(attempts) >= 5:
            raise HTTPException(429, "Too many attempts; wait one minute")
        attempts.append(current)
        if not secrets.compare_digest(
            body.key.get_secret_value(), settings.owner_key.get_secret_value()
        ):
            raise HTTPException(401, "Invalid owner key")
        with db.transaction() as session:
            token = auth.issue(session)
        response.set_cookie(
            "aura_session",
            token,
            httponly=True,
            samesite="strict",
            max_age=28800,
            secure=False,
            path="/api",
        )  # loopback HTTP only; hosted auth not enabled
        return {"authenticated": True}

    @app.delete("/api/session", dependencies=[Depends(owner)])
    def logout(request: Request, response: Response) -> dict[str, bool]:
        with db.transaction() as session:
            record = session.get(auth.OwnerSession, auth.digest(request.cookies["aura_session"]))
            if record:
                session.delete(record)
        response.delete_cookie("aura_session", path="/api")
        return {"authenticated": False}

    @app.get("/api/overview", dependencies=[Depends(owner)], response_model=Overview)
    def overview() -> dict[str, Any]:
        with db.transaction() as session:
            portfolio = snapshot(session, "challenge")
            gate = locked_gate(session)
            return {
                "portfolio": portfolio,
                "mode": "OBSERVE",
                "risk_profile": "BALANCED",
                "controls": {
                    "version": gate.version,
                    "entry_halt": gate.entry_halt,
                    "full_kill": gate.full_kill,
                },
                "strategies": [asdict(pod) for pod in PODS],
                "integrations": [
                    {"name": name, "status": "NOT_CONFIGURED"}
                    for name in ("Market data", "Paper adapter", "Investment Committee")
                ],
                "regime": {"status": "NOT_READY", "reason": "Definition and data not qualified"},
                "execution_enabled": False,
            }

    @app.get("/api/journals", dependencies=[Depends(owner)])
    def journals() -> list[dict[str, Any]]:
        with db.transaction() as session:
            rows = session.scalars(
                select(Journal)
                .where(Journal.portfolio_id == "challenge")
                .order_by(Journal.source_key)
                .limit(100)
            ).all()
            return [{"id": row.id, "source": row.source_key, "facts": row.facts} for row in rows]

    @app.get("/api/events", dependencies=[Depends(owner)])
    def events() -> list[dict[str, Any]]:
        with db.transaction() as session:
            return recent(session)

    @app.post("/api/controls/{control}", dependencies=[Depends(owner)])
    def controls(control: str, body: ControlCommand) -> dict[str, Any]:
        if control not in {"entry_halt", "full_kill"}:
            raise HTTPException(422, "Unknown control")
        with db.transaction() as session:
            locked_gate(session)
            previous = session.scalars(
                select(Event).where(Event.correlation_id == str(body.command_id))
            ).first()
            if previous:
                if previous.event_type != control.upper() + "_CHANGED" or previous.payload != {
                    "active": body.active,
                    "reason": body.reason,
                    "actor": "owner",
                    "cancellation_status": "NO_ADAPTER_CONFIGURED",
                }:
                    raise Conflict("Command identity reused with different content")
                return {"version": previous.aggregate_version}
            gate = change_control(
                session,
                control,
                body.active,
                body.expected_version,
                body.reason,
                str(body.command_id),
            )
            return {"version": gate.version}

    @app.get("/api/stream", dependencies=[Depends(owner)])
    async def stream(request: Request) -> StreamingResponse:
        async def generate() -> AsyncIterator[str]:
            # Invalidation stream, not an event-delivery cursor: every tick requires
            # authoritative refetch. This avoids out-of-order commit/sequence gaps.
            while not await request.is_disconnected():
                with db.transaction() as session:
                    if not auth.authorized(session, request.cookies.get("aura_session")):
                        yield "event: expired\ndata: {}\n\n"
                        return
                yield "event: refresh\ndata: " + json.dumps({"refresh": True}) + "\n\n"
                await asyncio.sleep(5)

        return StreamingResponse(generate(), media_type="text/event-stream")

    return app
