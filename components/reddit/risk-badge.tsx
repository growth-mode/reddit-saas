import type { RiskScore } from "@/lib/supabase/types";

const styles: Record<RiskScore, string> = {
  safe: "bg-green-50 text-green-700 border border-green-200",
  borderline: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  avoid: "bg-red-50 text-red-700 border border-red-200",
  unknown: "bg-muted text-muted-foreground border border-border",
};

const labels: Record<RiskScore, string> = {
  safe: "Safe",
  borderline: "Borderline",
  avoid: "Avoid",
  unknown: "Unknown",
};

export function RiskBadge({ score }: { score: RiskScore }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[score]}`}>
      {labels[score]}
    </span>
  );
}
