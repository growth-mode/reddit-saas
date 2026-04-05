const SIGNAL_LABELS: Record<string, string> = {
  tool_seeking: "Seeking a tool",
  frustration: "Frustration",
  comparison: "Comparing",
  decision_making: "Purchase decision",
  problem_statement: "Problem",
  advice_seeking: "Advice seeking",
};

export function SignalBadge({ signal }: { signal: string }) {
  const label = SIGNAL_LABELS[signal] ?? signal;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-accent text-primary border border-primary/20">
      {label}
    </span>
  );
}
