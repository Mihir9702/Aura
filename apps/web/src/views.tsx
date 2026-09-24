import type { ReactNode } from "react";
import type { ControlName, Snapshot } from "./api";
import { ControlRows } from "./controls";
import { clock, day, money, postedAt, sentence } from "./format";
import {
  AccountStrip,
  AuditTable,
  BalanceStatement,
  EventList,
  JournalTable,
  PositionsTable,
} from "./ledger";
import { LifecycleRules, PodMatrix, podCounts } from "./pods";
import type { Freshness } from "./shell";
import { Section, Status, TableFrame, type State } from "./ui";

type ViewProps = {
  snapshot: Snapshot;
  updated: Date | null;
  freshness: Freshness;
  onControl: (control: ControlName) => void;
};

function Title({ title, note }: { title: string; note?: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
      {note && <p className="mt-1 text-ink-2">{note}</p>}
    </div>
  );
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

function readiness({ overview, journals, events }: Snapshot) {
  const funding = journals.find((journal) => journal.facts.kind === "FUNDING");
  const fundedAt = funding && postedAt(funding, events);
  const { qualified } = podCounts(overview.strategies);
  const items: { label: string; state: State; value: ReactNode }[] = [
    {
      label: "Ledger funded",
      state: funding ? "done" : "open",
      value: funding ? (
        <>
          <span className="figure text-ink">
            {money(String(funding.facts.capital))}
          </span>
          {fundedAt && <span className="text-ink-3"> on {day(fundedAt)}</span>}
        </>
      ) : (
        "Not funded"
      ),
    },
    ...overview.integrations.map((integration) => ({
      label: integration.name,
      state: "open" as const,
      value: sentence(integration.status),
    })),
    {
      label: "Market regime",
      state: "open",
      value: sentence(overview.regime.status),
    },
    {
      label: "Qualified pods",
      state: qualified > 0 ? "done" : "open",
      value: `${qualified} of ${overview.strategies.length}`,
    },
  ];
  return items;
}

function Readiness({ snapshot }: { snapshot: Snapshot }) {
  return (
    <ul>
      {readiness(snapshot).map((item) => (
        <li
          key={item.label}
          className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5"
        >
          <Status state={item.state}>
            <span className={item.state === "done" ? "" : "text-ink"}>
              {item.label}
            </span>
          </Status>
          <span className="text-right text-[13px] text-ink-3">
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function OverviewView({ snapshot, updated, onControl }: ViewProps) {
  const { overview, journals, events } = snapshot;
  const pods = overview.strategies;
  const { qualified, trading } = podCounts(pods);
  const ready = readiness(snapshot).filter((item) => item.state === "done");
  return (
    <>
      <Title
        title="Challenge account"
        note={`Paper money in USD${updated ? `, as of ${clock(updated)}` : ""}.`}
      />
      <AccountStrip overview={overview} />
      <div className="mt-12 grid gap-x-12 gap-y-12 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <div className="min-w-0 space-y-12">
          <Section
            title="Strategy pods"
            aside={`${qualified} of ${pods.length} qualified, ${trading} trading`}
          >
            <PodMatrix pods={pods} />
          </Section>
          <Section title="Ledger" aside={plural(journals.length, "journal")}>
            <JournalTable journals={journals} events={events} />
          </Section>
        </div>
        <div className="min-w-0 space-y-12">
          <Section title="Controls">
            <ControlRows overview={overview} onChange={onControl} />
          </Section>
          <Section
            title="Readiness"
            aside={`${ready.length} of ${readiness(snapshot).length} ready`}
          >
            <Readiness snapshot={snapshot} />
          </Section>
          <Section
            title="Recent events"
            aside={
              <a
                href="#/operations"
                className="underline underline-offset-4 hover:text-ink"
              >
                Audit log
              </a>
            }
          >
            <EventList events={events} limit={5} />
          </Section>
        </div>
      </div>
    </>
  );
}

export function PortfolioView({ snapshot }: ViewProps) {
  const { overview, journals, events } = snapshot;
  const portfolio = overview.portfolio;
  return (
    <>
      <Title
        title="Portfolio"
        note="Paper money in USD. Every figure comes from the ledger."
      />
      <div className="grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Section title="Balance" aside={`Version ${portfolio.version}`}>
          <BalanceStatement portfolio={portfolio} />
        </Section>
        <div className="min-w-0 space-y-12">
          <Section
            title="Positions"
            aside={plural(portfolio.positions.length, "position")}
          >
            <PositionsTable portfolio={portfolio} />
          </Section>
          <Section title="Journals" aside="Append-only, each one balanced">
            <JournalTable journals={journals} events={events} />
          </Section>
        </div>
      </div>
    </>
  );
}

export function PodsView({ snapshot }: ViewProps) {
  const pods = snapshot.overview.strategies;
  const built = pods.filter((pod) => pod.implementation !== "UNIMPLEMENTED");
  const { qualified } = podCounts(pods);
  return (
    <>
      <Title
        title="Strategy pods"
        note={`${pods.length} methods share one account. ${built.length} of ${pods.length} built, ${qualified} qualified.`}
      />
      <Section title="Lifecycle">
        <PodMatrix pods={pods} />
        <LifecycleRules />
      </Section>
    </>
  );
}

export function ResearchView({ snapshot }: ViewProps) {
  const regime = snapshot.overview.regime;
  const rows: [string, string, string][] = [
    [
      "Backtesting",
      "Not built",
      "Replays a pod's rules on past data, with costs.",
    ],
    [
      "Paper shadow",
      "Not built",
      "Runs a pod forward on paper, with no capital.",
    ],
    [
      "Research league",
      "Not built",
      "Compares pods offline. Its scores never authorize orders.",
    ],
    [
      "Market regime",
      `${sentence(regime.status)}: ${regime.reason.toLowerCase()}`,
      "Deterministic, market-wide state that pods can consult.",
    ],
    [
      "Knowledge library",
      "Not built",
      "Versioned full-text sources, with their usage rights.",
    ],
  ];
  return (
    <>
      <Title
        title="Research"
        note="Where a pod earns evidence before it gets any capital."
      />
      <Section title="Subsystems">
        <TableFrame>
          <table className="ledger">
            <thead>
              <tr>
                <th scope="col">Subsystem</th>
                <th scope="col">Status</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, status, role]) => (
                <tr key={name}>
                  <th
                    scope="row"
                    className="py-2.5 pr-4 font-sans text-[14px] font-medium tracking-normal whitespace-nowrap text-ink normal-case"
                  >
                    {name}
                  </th>
                  <td className="whitespace-nowrap">
                    <Status state="open">{status}</Status>
                  </td>
                  <td className="text-ink-2">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      </Section>
    </>
  );
}

export function OperationsView({ snapshot, freshness, onControl }: ViewProps) {
  const { overview, health, events } = snapshot;
  const rows: [string, State, string, string][] = [
    [
      "Database",
      health.database === "CONNECTED" ? "done" : "warn",
      sentence(health.database),
      "PostgreSQL holds the ledger, controls and events.",
    ],
    [
      "Live updates",
      freshness === "live" ? "done" : "warn",
      sentence(freshness),
      "Server-sent events. A reconnect always reloads everything.",
    ],
    [
      "Execution",
      "open",
      sentence(health.execution),
      "This build has no path to submit orders.",
    ],
    ...overview.integrations.map(
      (integration): [string, State, string, string] => [
        integration.name,
        "open",
        sentence(integration.status),
        "Not chosen or qualified yet.",
      ],
    ),
  ];
  return (
    <>
      <Title title="Operations" />
      <div className="grid gap-x-12 gap-y-12 xl:grid-cols-2">
        <Section title="Dependencies">
          <TableFrame>
            <table className="ledger">
              <thead>
                <tr>
                  <th scope="col">Dependency</th>
                  <th scope="col">Status</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([name, state, status, note]) => (
                  <tr key={name}>
                    <th
                      scope="row"
                      className="py-2.5 pr-4 font-sans text-[14px] font-medium tracking-normal whitespace-nowrap text-ink normal-case"
                    >
                      {name}
                    </th>
                    <td className="whitespace-nowrap">
                      <Status state={state}>{status}</Status>
                    </td>
                    <td className="text-ink-2">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Section>
        <Section title="Controls">
          <ControlRows overview={overview} onChange={onControl} detailed />
        </Section>
      </div>
      <Section
        title="Audit log"
        aside={plural(events.length, "event")}
        className="mt-12"
      >
        <AuditTable events={events} />
      </Section>
    </>
  );
}
