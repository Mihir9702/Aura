import { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  loadSnapshot,
  SignInRequired,
  type ControlName,
  type Snapshot,
} from "./api";
import { ControlDialog } from "./controls";
import { clock } from "./format";
import { ROUTES, StatusBar, Tabs, type Freshness, type Route } from "./shell";
import { SignIn } from "./sign-in";
import {
  OperationsView,
  OverviewView,
  PodsView,
  PortfolioView,
  ResearchView,
} from "./views";

function readRoute(): Route {
  const id = location.hash.replace(/^#\/?/, "");
  return ROUTES.find(([route]) => route === id)?.[0] ?? "overview";
}

function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const update = () => {
      setRoute(readRoute());
      scrollTo(0, 0);
    };
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  return route;
}

type Phase = "loading" | "signed-out" | "ready";

export function App() {
  const route = useRoute();
  const [phase, setPhase] = useState<Phase>("loading");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);
  const [connected, setConnected] = useState(false);
  const [stale, setStale] = useState("");
  const [signInError, setSignInError] = useState("");
  const [busy, setBusy] = useState(false);
  const [control, setControl] = useState<ControlName | null>(null);
  const [controlError, setControlError] = useState("");
  const hasData = useRef(false);

  const signOutLocally = useCallback(() => {
    hasData.current = false;
    setSnapshot(null);
    setPhase("signed-out");
  }, []);

  const refresh = useCallback(async () => {
    try {
      const next = await loadSnapshot();
      hasData.current = true;
      setSnapshot(next);
      setUpdated(new Date());
      setStale("");
      setPhase("ready");
    } catch (error) {
      if (error instanceof SignInRequired) return signOutLocally();
      const message = (error as Error).message;
      // Once there is data, a failed refresh keeps it on screen and marks it stale
      if (hasData.current) setStale(message);
      else {
        setSignInError(message);
        setPhase("signed-out");
      }
    }
  }, [signOutLocally]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // The stream only says "something changed"; every tick refetches the truth
  useEffect(() => {
    if (phase !== "ready") return;
    const stream = new EventSource("/api/stream");
    stream.onopen = () => setConnected(true);
    stream.onerror = () => setConnected(false);
    stream.addEventListener("refresh", () => void refresh());
    stream.addEventListener("expired", () => {
      stream.close();
      signOutLocally();
    });
    const poll = setInterval(() => void refresh(), 15000);
    return () => {
      stream.close();
      clearInterval(poll);
      setConnected(false);
    };
  }, [phase, refresh, signOutLocally]);

  async function signIn(key: string) {
    setBusy(true);
    setSignInError("");
    try {
      await api("/session", { method: "POST", body: JSON.stringify({ key }) });
      await refresh();
      return true;
    } catch (error) {
      setSignInError(
        error instanceof SignInRequired
          ? "That owner key was not accepted."
          : (error as Error).message,
      );
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    try {
      await api("/session", { method: "DELETE" });
    } catch (error) {
      if (!(error instanceof SignInRequired)) {
        setStale((error as Error).message);
        return;
      }
    }
    signOutLocally();
  }

  async function changeControl(reason: string) {
    if (!control || !snapshot) return;
    setBusy(true);
    setControlError("");
    try {
      await api("/controls/" + control, {
        method: "POST",
        body: JSON.stringify({
          active: !snapshot.overview.controls[control],
          expected_version: snapshot.overview.controls.version,
          reason,
          command_id: crypto.randomUUID(),
        }),
      });
      setControl(null);
      await refresh();
    } catch (error) {
      if (error instanceof SignInRequired) return signOutLocally();
      setControlError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (phase === "loading")
    return (
      <main className="grid min-h-dvh place-items-center text-ink-3">
        Loading…
      </main>
    );

  if (phase === "signed-out" || !snapshot)
    return <SignIn error={signInError} busy={busy} onSignIn={signIn} />;

  const { overview } = snapshot;
  const freshness: Freshness = stale
    ? "stale"
    : connected
      ? "live"
      : "reconnecting";
  const props = {
    snapshot,
    updated,
    freshness,
    onControl: (next: ControlName) => {
      setControlError("");
      setControl(next);
    },
  };
  const View = {
    overview: OverviewView,
    portfolio: PortfolioView,
    pods: PodsView,
    research: ResearchView,
    operations: OperationsView,
  }[route];

  return (
    <div className="min-h-dvh">
      <StatusBar
        overview={overview}
        freshness={freshness}
        updated={updated}
        onSignOut={() => void signOut()}
      />
      <Tabs route={route} />
      {stale && (
        <div
          role="alert"
          className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-warn/40 bg-warn/10 px-4 py-2.5 text-[13px] sm:px-8"
        >
          <span className="font-medium text-warn">
            Showing data from {updated ? clock(updated) : "earlier"}.
          </span>
          <span className="text-ink-2">{stale}</span>
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => void refresh()}
          >
            Retry
          </button>
        </div>
      )}
      {overview.controls.full_kill && (
        <p className="border-b border-stop bg-stop-wash px-4 py-2.5 text-[13px] text-stop sm:px-8">
          <strong>Full kill is on.</strong> Every new order submission is
          blocked, exits included. Nothing is sold automatically, and re-arming
          needs checks that don't exist yet.
        </p>
      )}
      {overview.controls.entry_halt && (
        <p className="border-b border-stop/40 bg-stop-wash px-4 py-2.5 text-[13px] text-stop sm:px-8">
          <strong>Entry halt is on.</strong> No new or larger positions.
          Reducing exits still need permission and healthy dependencies.
        </p>
      )}
      <main className="mx-auto max-w-[1600px] px-4 pt-8 pb-16 sm:px-8">
        <View {...props} />
      </main>
      <ControlDialog
        control={control}
        overview={overview}
        busy={busy}
        error={controlError}
        onConfirm={(reason) => void changeControl(reason)}
        onClose={() => setControl(null)}
      />
    </div>
  );
}
