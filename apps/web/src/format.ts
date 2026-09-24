import type { EventRecord, Journal } from "./api";

// Amounts arrive as decimal strings. They are formatted as text so no
// precision is lost: trailing zeros past the cents go, anything else stays.
// Negative amounts use accounting parentheses.
export function money(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === "") return "—";
  const trimmed = value.trim();
  const negative = trimmed.startsWith("-");
  const [whole = "0", fraction = ""] = trimmed.replace(/^[-+]/, "").split(".");
  const cents = fraction.replace(/0+$/, "").padEnd(2, "0");
  const text = "$" + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + cents;
  return negative && /[1-9]/.test(whole + fraction) ? `(${text})` : text;
}

// Server enums like ACTIVE_PAPER read as "Active paper"
export function sentence(value: string): string {
  const words = value.replaceAll("_", " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const clockFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});

const stampFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});

const dayFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// 14:05:09 EDT
export const clock = (date: Date | string) =>
  clockFormat.format(new Date(date));
// Sep 24, 14:05 EDT
export const stamp = (date: Date | string) =>
  stampFormat.format(new Date(date));
// Sep 24, 2026
export const day = (date: Date | string) => dayFormat.format(new Date(date));

export function describeEvent(event: EventRecord): {
  title: string;
  detail: string;
} {
  const payload = event.payload;
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  switch (event.event_type) {
    case "LEDGER_POSTED":
      return { title: "Ledger posted", detail: text(payload.source) };
    case "ENTRY_HALT_CHANGED":
      return {
        title: payload.active ? "Entry halt on" : "Entry halt lifted",
        detail: text(payload.reason),
      };
    case "FULL_KILL_CHANGED":
      return {
        title: payload.active ? "Full kill on" : "Full kill re-armed",
        detail: text(payload.reason),
      };
    case "FIXTURE_ORDER_RESERVED":
      return { title: "Test order reserved", detail: text(payload.order_id) };
    default:
      return { title: sentence(event.event_type), detail: "" };
  }
}

// When each journal was posted, from its LEDGER_POSTED event
export function postedAt(journal: Journal, events: EventRecord[]) {
  return events.find(
    (event) =>
      event.event_type === "LEDGER_POSTED" &&
      event.payload.journal_id === journal.id,
  )?.recorded_at;
}

export function describeJournal(journal: Journal): {
  kind: string;
  amount: string;
} {
  const facts = journal.facts;
  if (facts.kind === "FUNDING" && typeof facts.capital === "string")
    return { kind: "Funding", amount: money(facts.capital) };
  if (facts.kind === "FILL")
    return {
      kind: "Fill",
      amount: `${String(facts.quantity)} @ ${money(String(facts.price))}`,
    };
  return {
    kind: typeof facts.kind === "string" ? sentence(facts.kind) : "Journal",
    amount: "—",
  };
}
