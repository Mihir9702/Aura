import type { Strategy } from "./api";
import { TableFrame } from "./ui";

// The order pods move through (see aura.strategies.validate_transition)
const STAGES = [
  ["DEVELOPMENT", "Development"],
  ["BACKTESTING", "Backtesting"],
  ["PAPER_SHADOW", "Paper shadow"],
  ["QUALIFIED", "Qualified"],
  ["ACTIVE_PAPER", "Active paper"],
] as const;

export function podCounts(pods: Strategy[]) {
  return {
    qualified: pods.filter(
      (pod) => pod.status === "QUALIFIED" || pod.status === "ACTIVE_PAPER",
    ).length,
    trading: pods.filter((pod) => pod.status === "ACTIVE_PAPER").length,
  };
}

function Stage({
  index,
  current,
  label,
}: {
  index: number;
  current: number;
  label: string;
}) {
  const first = index === 0;
  const last = index === STAGES.length - 1;
  // The line leading out of a stage is inked once the pod has moved past it
  const done = index < current;
  let marker = <span className="size-[7px] border border-ink-3 bg-paper" />;
  if (index < current) marker = <span className="size-[7px] bg-ink" />;
  if (index === current) marker = <span className="size-[11px] bg-ink" />;
  return (
    <td className="px-0 py-3">
      <div
        className={
          "track" +
          (first ? " track-first" : "") +
          (last ? " track-last" : "") +
          (done ? " track-done" : "")
        }
      >
        {marker}
      </div>
      {index === current && (
        <span className="sr-only">Current stage: {label}</span>
      )}
    </td>
  );
}

// Each pod on its lifecycle, so it's plain how far any of them has come
export function PodMatrix({ pods }: { pods: Strategy[] }) {
  return (
    <TableFrame>
      <table className="ledger">
        <thead>
          <tr>
            <th scope="col" className="w-[34%] min-w-[200px]">
              Pod
            </th>
            {STAGES.map(([id, label]) => (
              <th
                key={id}
                scope="col"
                className="px-1 text-center text-[10px] tracking-[0.04em]"
              >
                {label}
              </th>
            ))}
            <th scope="col" className="pl-4 text-right">
              Method
            </th>
          </tr>
        </thead>
        <tbody>
          {pods.map((pod) => {
            const current = STAGES.findIndex(([id]) => id === pod.status);
            return (
              <tr key={pod.id}>
                <th
                  scope="row"
                  className="py-2.5 pr-4 font-sans text-[14px] font-medium tracking-normal text-ink normal-case"
                >
                  {pod.name}
                  <div className="mt-0.5 text-[12px] font-normal whitespace-normal text-ink-3">
                    {pod.description}
                  </div>
                </th>
                {STAGES.map(([id, label], index) => (
                  <Stage
                    key={id}
                    index={index}
                    current={current}
                    label={label}
                  />
                ))}
                <td className="pl-4 text-right whitespace-nowrap">
                  {pod.status === "SUSPENDED" ? (
                    <span className="font-medium text-stop">Suspended</span>
                  ) : pod.implementation === "UNIMPLEMENTED" ? (
                    <span className="text-ink-2">Not built</span>
                  ) : (
                    "Built"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableFrame>
  );
}

export function LifecycleRules() {
  return (
    <ol className="mt-5 max-w-[64ch] list-decimal space-y-2 pl-6 text-ink-2 marker:font-mono marker:text-[12px] marker:text-ink-3">
      <li>
        Pods move one stage at a time: development, backtesting, then paper
        shadow, where they run forward on paper with no capital.
      </li>
      <li>
        Qualified and active paper also need evidence and your approval. Code on
        its own never gives a pod money.
      </li>
      <li>
        A pod can be suspended at any stage. Bringing it back means qualifying
        it again.
      </li>
    </ol>
  );
}
