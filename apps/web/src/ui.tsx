import { useId, type ReactNode } from "react";

export function Section({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={className}>
      <div className="flex items-baseline justify-between gap-4 border-b border-rule-strong pb-2">
        <h2 id={id} className="text-[15px] font-semibold">
          {title}
        </h2>
        {aside && <div className="text-[13px] text-ink-3">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

export type State = "done" | "open" | "stop" | "warn";

// A small square beside a state word, so state never relies on colour alone
export function Mark({ state }: { state: State }) {
  const look = {
    done: "bg-go",
    open: "border border-ink-3",
    stop: "bg-stop",
    warn: "bg-warn",
  }[state];
  return (
    <span aria-hidden className={`inline-block size-[7px] shrink-0 ${look}`} />
  );
}

export function Status({
  state,
  children,
}: {
  state: State;
  children: ReactNode;
}) {
  const tone = {
    done: "text-ink",
    open: "text-ink-2",
    stop: "text-stop font-medium",
    warn: "text-warn",
  }[state];
  return (
    <span className={`inline-flex items-center gap-2 ${tone}`}>
      <Mark state={state} />
      {children}
    </span>
  );
}

// Wide tables scroll inside their section instead of widening the page
export function TableFrame({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}

export function EmptyRow({
  columns,
  children,
}: {
  columns: number;
  children: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={columns} className="text-ink-3">
        {children}
      </td>
    </tr>
  );
}
