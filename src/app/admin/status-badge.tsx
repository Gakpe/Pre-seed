import type { InvestorStatus } from "@/lib/types";

const styles: Record<InvestorStatus, string> = {
  approved:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  blocked: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const labels: Record<InvestorStatus, string> = {
  approved: "approuvé",
  pending: "en attente",
  blocked: "bloqué",
};

export function StatusBadge({ status }: { status: InvestorStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
