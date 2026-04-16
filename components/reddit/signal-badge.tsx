const SIGNAL_LABELS: Record<string, string> = {
  tool_seeking: "Seeking a tool",
  frustration: "Frustration",
  comparison: "Comparing",
  decision_making: "Purchase decision",
  problem_statement: "Problem",
  advice_seeking: "Advice seeking",
};

// Hover copy — explains what the ICP classifier actually detected in the
// post for this signal. Helps users calibrate trust in the score instead
// of seeing opaque tags.
const SIGNAL_EXPLANATIONS: Record<string, string> = {
  tool_seeking: "Poster is explicitly asking for software/tool recommendations.",
  frustration: "Poster is venting about a workflow or existing tool — warm-lead territory.",
  comparison: "Poster is evaluating multiple options side-by-side.",
  decision_making: "Poster is close to purchase — weighing trade-offs, budget, or timing.",
  problem_statement: "Poster described a concrete problem your product could solve.",
  advice_seeking: "Poster wants guidance from peers — receptive to helpful replies.",
};

export function SignalBadge({ signal }: { signal: string }) {
  const label = SIGNAL_LABELS[signal] ?? signal;
  const explanation = SIGNAL_EXPLANATIONS[signal];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-accent text-primary border border-primary/20 cursor-help"
      title={explanation ?? label}
    >
      {label}
    </span>
  );
}
