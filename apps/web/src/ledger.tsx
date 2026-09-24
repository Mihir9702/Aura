import type { EventRecord, Journal, Overview, Portfolio } from "./api";
import {
  clock,
  describeEvent,
  describeJournal,
  money,
  postedAt,
  stamp,
} from "./format";
import { EmptyRow, TableFrame } from "./ui";

function marketValue(portfolio: Portfolio) {
  return portfolio.valuation_status === "CASH_ONLY" ? money("0") : "No marks";
}

// The account in one line, the way a statement header reads
export function AccountStrip({ overview }: { overview: Overview }) {
  const p = overview.portfolio;
  const pods = overview.strategies.length;
  const cells = [
    {
      label: "Market value",
      value: marketValue(p),
      note: `${p.positions.length} ${p.positions.length === 1 ? "position" : "positions"}`,
    },
    {
      label: "Realized P&L",
      value: money(p.realized_pnl),
      note: "Closed trades",
    },
    { label: "Fees", value: money(p.fees), note: "Paid so far" },
    {
      label: "Starting capital",
      value: money(p.capital),
      note: "Challenge funding",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule-strong pt-4 md:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]">
      <div className="col-span-2 md:col-span-1">
        <div className="label-caps">Equity</div>
        <div className="mt-1.5 inline-block pb-1 double-rule">
          <span className="figure text-[34px] leading-none font-medium">
            {p.equity === null ? "No marks" : money(p.equity)}
          </span>
        </div>
        <div className="mt-2 text-[12px] text-ink-3">
          {p.valuation_status === "CASH_ONLY"
            ? "All cash, nothing to mark"
            : "Positions have no market marks"}
        </div>
      </div>
      <div>
        <div className="label-caps">Cash</div>
        <div className="figure mt-2 text-[20px] leading-tight">
          {money(p.cash)}
        </div>
        <div className="mt-2 text-[12px] text-ink-3">Shared by {pods} pods</div>
      </div>
      {cells.map((cell) => (
        <div key={cell.label}>
          <div className="label-caps">{cell.label}</div>
          <div className="figure mt-2 text-[20px] leading-tight">
            {cell.value}
          </div>
          <div className="mt-2 text-[12px] text-ink-3">{cell.note}</div>
        </div>
      ))}
    </div>
  );
}

// A small balance statement, ruled and totalled like a paper one
export function BalanceStatement({ portfolio }: { portfolio: Portfolio }) {
  const rows: [string, string, string?][] = [
    ["Starting capital", money(portfolio.capital)],
    ["Realized P&L", money(portfolio.realized_pnl)],
    ["Fees", money(portfolio.fees)],
  ];
  return (
    <dl className="figure mt-4 max-w-[420px] text-[14px]">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between py-1.5">
          <dt className="font-sans text-ink-2">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-rule-strong py-1.5">
        <dt className="font-sans text-ink-2">Cash</dt>
        <dd>{money(portfolio.cash)}</dd>
      </div>
      <div className="flex justify-between py-1.5">
        <dt className="font-sans text-ink-2">Market value</dt>
        <dd>{marketValue(portfolio)}</dd>
      </div>
      <div className="mt-2 flex justify-between border-t border-rule-strong pt-2 pb-1.5 double-rule">
        <dt className="font-sans font-semibold">Equity</dt>
        <dd className="font-medium">
          {portfolio.equity === null ? "No marks" : money(portfolio.equity)}
        </dd>
      </div>
    </dl>
  );
}

export function PositionsTable({ portfolio }: { portfolio: Portfolio }) {
  return (
    <TableFrame>
      <table className="ledger">
        <thead>
          <tr>
            <th scope="col">Instrument</th>
            <th scope="col">Pod</th>
            <th scope="col" className="num">
              Quantity
            </th>
            <th scope="col" className="num">
              Cost basis
            </th>
          </tr>
        </thead>
        <tbody>
          {portfolio.positions.length === 0 ? (
            <EmptyRow columns={4}>
              No positions. The account is all cash.
            </EmptyRow>
          ) : (
            portfolio.positions.map((position) => (
              <tr key={position.instrument + position.scope}>
                <td className="font-mono">{position.instrument}</td>
                <td>{position.scope}</td>
                <td className="num">{position.quantity}</td>
                <td className="num">{money(position.cost_basis)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </TableFrame>
  );
}

export function JournalTable({
  journals,
  events,
}: {
  journals: Journal[];
  events: EventRecord[];
}) {
  return (
    <TableFrame>
      <table className="ledger">
        <thead>
          <tr>
            <th scope="col">Posted</th>
            <th scope="col">Source</th>
            <th scope="col">Kind</th>
            <th scope="col" className="num">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {journals.length === 0 ? (
            <EmptyRow columns={4}>Nothing posted yet.</EmptyRow>
          ) : (
            journals.map((journal) => {
              const when = postedAt(journal, events);
              const { kind, amount } = describeJournal(journal);
              return (
                <tr key={journal.id}>
                  <td className="figure whitespace-nowrap text-ink-2">
                    {when ? stamp(when) : "—"}
                  </td>
                  <td className="font-mono">{journal.source}</td>
                  <td>{kind}</td>
                  <td className="num">{amount}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </TableFrame>
  );
}

// Newest first, one line each
export function EventList({
  events,
  limit,
}: {
  events: EventRecord[];
  limit: number;
}) {
  const latest = [...events].reverse().slice(0, limit);
  if (latest.length === 0)
    return <p className="py-3 text-ink-3">No events recorded.</p>;
  return (
    <ol>
      {latest.map((event) => {
        const { title, detail } = describeEvent(event);
        return (
          <li
            key={event.event_id}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 border-b border-rule py-2.5"
          >
            <time
              dateTime={event.recorded_at}
              className="figure text-[12px] leading-[20px] text-ink-3"
            >
              {clock(event.recorded_at)}
            </time>
            <div className="min-w-0">
              <span>{title}</span>
              {detail && (
                <span className="ml-2 font-mono text-[12px] break-words text-ink-2">
                  {detail}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function AuditTable({ events }: { events: EventRecord[] }) {
  const rows = [...events].reverse();
  return (
    <TableFrame>
      <table className="ledger">
        <thead>
          <tr>
            <th scope="col" className="num">
              #
            </th>
            <th scope="col">Recorded</th>
            <th scope="col">Event</th>
            <th scope="col">Detail</th>
            <th scope="col">Aggregate</th>
            <th scope="col">Correlation</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow columns={6}>No events recorded.</EmptyRow>
          ) : (
            rows.map((event) => {
              const { title, detail } = describeEvent(event);
              return (
                <tr key={event.event_id}>
                  <td className="num text-ink-3">{event.sequence}</td>
                  <td className="figure whitespace-nowrap text-ink-2">
                    {stamp(event.recorded_at)}
                  </td>
                  <td className="whitespace-nowrap">{title}</td>
                  <td className="max-w-[28ch] font-mono text-[12px] break-words text-ink-2">
                    {detail || "—"}
                  </td>
                  <td className="font-mono text-[12px] whitespace-nowrap text-ink-2">
                    {event.aggregate_id} v{event.aggregate_version}
                  </td>
                  <td className="max-w-[24ch] truncate font-mono text-[12px] text-ink-3">
                    {event.correlation_id}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </TableFrame>
  );
}
