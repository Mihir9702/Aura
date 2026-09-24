import type { ReactNode } from "react";
import type { Overview } from "./api";
import { clock, sentence } from "./format";

export const ROUTES = [
  ["overview", "Overview"],
  ["portfolio", "Portfolio"],
  ["pods", "Strategy pods"],
  ["research", "Research"],
  ["operations", "Operations"],
] as const;

export type Route = (typeof ROUTES)[number][0];

export type Freshness = "live" | "reconnecting" | "stale";

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="text-bar-ink-2">{label}</span>
      <span className="text-bar-ink">{children}</span>
    </div>
  );
}

function Switch({ on }: { on: boolean }) {
  return on ? (
    <span className="bg-stop px-1 font-medium text-sheet">on</span>
  ) : (
    <>off</>
  );
}

// Always visible: which money this is, what Aura may do, and how fresh the numbers are
export function StatusBar({
  overview,
  freshness,
  updated,
  onSignOut,
}: {
  overview: Overview;
  freshness: Freshness;
  updated: Date | null;
  onSignOut: () => void;
}) {
  const environment =
    overview.portfolio.environment === "ACTIVE_PAPER" ? "Paper" : "Shadow";
  const light = {
    live: ["bg-go", "Live"],
    reconnecting: ["bg-warn", "Reconnecting"],
    stale: ["bg-warn", "Stale"],
  }[freshness];

  return (
    <header className="z-20 bg-bar font-mono text-[12px] text-bar-ink sm:sticky sm:top-0">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="font-sans text-[15px] font-semibold tracking-tight">
            Aura
          </span>
          <span className="border border-stop px-1.5 text-[11px] font-medium tracking-[0.08em] text-bar-ink uppercase">
            {environment}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Item label="Mode">{sentence(overview.mode)}</Item>
          <Item label="Risk">{sentence(overview.risk_profile)}</Item>
          <Item label="Entry halt">
            <Switch on={overview.controls.entry_halt} />
          </Item>
          <Item label="Full kill">
            <Switch on={overview.controls.full_kill} />
          </Item>
          <Item label="Execution">
            {overview.execution_enabled ? "on" : "off"}
          </Item>
        </div>
        <div className="ml-auto flex items-center gap-5">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span aria-hidden className={`size-[7px] ${light[0]}`} />
            <span>{light[1]}</span>
            <span className="text-bar-ink-2">
              {updated ? clock(updated) : "waiting"}
            </span>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="font-sans text-[13px] text-bar-ink-2 underline-offset-4 hover:text-bar-ink hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

export function Tabs({ route }: { route: Route }) {
  return (
    <nav
      aria-label="Sections"
      className="overflow-x-auto border-b border-rule px-4 sm:px-8"
    >
      <ul className="flex gap-6">
        {ROUTES.map(([id, label]) => (
          <li key={id}>
            <a
              href={"#/" + id}
              aria-current={route === id ? "page" : undefined}
              className={
                "-mb-px inline-block border-b-2 py-3 text-[14px] whitespace-nowrap " +
                (route === id
                  ? "border-ink font-medium text-ink"
                  : "border-transparent text-ink-2 hover:text-ink")
              }
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
