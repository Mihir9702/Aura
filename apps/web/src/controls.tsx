import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ControlName, Overview } from "./api";
import { Status } from "./ui";

type Copy = { title: string; effect: string; confirm: string; stop: boolean };

// What each change does, in the words shown before it is confirmed
function copyFor(control: ControlName, active: boolean): Copy {
  if (control === "full_kill")
    return {
      title: "Activate full kill",
      effect:
        "Every new order submission is blocked, exits included. Nothing you hold is sold. It stays on through restarts, and it can't be re-armed until data, adapter and reconciliation checks exist.",
      confirm: "Activate full kill",
      stop: true,
    };
  return active
    ? {
        title: "Lift the entry halt",
        effect:
          "New and larger positions are allowed again, still subject to the mode, Full kill and health checks. In Observe mode nothing is traded either way.",
        confirm: "Lift halt",
        stop: false,
      }
    : {
        title: "Halt new entries",
        effect:
          "New and larger positions are blocked until you lift the halt. Exits that reduce a position can still go through when their checks pass.",
        confirm: "Halt entries",
        stop: false,
      };
}

export function ControlRows({
  overview,
  onChange,
  detailed = false,
}: {
  overview: Overview;
  onChange: (control: ControlName) => void;
  detailed?: boolean;
}) {
  const { entry_halt, full_kill } = overview.controls;
  const rows = [
    {
      id: "entry_halt" as const,
      name: "Entry halt",
      on: entry_halt,
      summary: "Blocks new or larger positions.",
      detail:
        "Reducing exits can continue when they are authorized and their checks pass.",
      action: (
        <button
          type="button"
          className="btn"
          onClick={() => onChange("entry_halt")}
        >
          {entry_halt ? "Lift halt" : "Halt entries"}
        </button>
      ),
    },
    {
      id: "full_kill" as const,
      name: "Full kill",
      on: full_kill,
      summary: "Blocks every order submission.",
      detail:
        "Holdings are never sold automatically. Re-arming needs a person and healthy dependencies, which don't exist yet.",
      action: full_kill ? (
        <button type="button" className="btn" disabled>
          Re-arm unavailable
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-stop"
          onClick={() => onChange("full_kill")}
        >
          Activate
        </button>
      ),
    },
  ];

  return (
    <div>
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-rule py-3"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-medium">{row.name}</span>
            <Status state={row.on ? "stop" : "open"}>
              {row.on ? "On" : "Off"}
            </Status>
          </div>
          <div className="row-span-2 self-center">{row.action}</div>
          <p className="text-[13px] text-ink-2">
            {row.summary}
            {detailed && <> {row.detail}</>}
          </p>
        </div>
      ))}
      <p className="mt-2 text-[12px] text-ink-3">
        Every change asks for a reason and goes in the audit log.
      </p>
    </div>
  );
}

export function ControlDialog({
  control,
  overview,
  busy,
  error,
  onConfirm,
  onClose,
}: {
  control: ControlName | null;
  overview: Overview;
  busy: boolean;
  error: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (control && !element.open) {
      setReason("");
      element.showModal();
    }
    if (!control && element.open) element.close();
  }, [control]);

  const copy = control ? copyFor(control, overview.controls[control]) : null;

  function submit(event: FormEvent) {
    event.preventDefault();
    onConfirm(reason);
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="control-title"
      className="m-auto w-[min(460px,calc(100vw-32px))] border border-rule-strong bg-paper p-0 text-ink"
    >
      {copy && (
        <form onSubmit={submit} className="p-6">
          <h2 id="control-title" className="text-[17px] font-semibold">
            {copy.title}
          </h2>
          <p className="mt-2 text-ink-2">{copy.effect}</p>
          <label
            htmlFor="control-reason"
            className="mt-5 block text-[13px] font-medium"
          >
            Reason for the audit log
          </label>
          <input
            id="control-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            minLength={4}
            maxLength={500}
            required
            autoFocus
            className="mt-2 h-10 w-full border border-ink bg-sheet px-3"
          />
          {error && (
            <p
              role="alert"
              className="mt-3 border-l-2 border-stop pl-3 text-stop"
            >
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className={"btn " + (copy.stop ? "btn-stop-solid" : "btn-solid")}
            >
              {busy ? "Recording…" : copy.confirm}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
