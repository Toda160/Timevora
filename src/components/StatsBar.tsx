import { useMemo } from "react";
import type { TimeEntry } from "../types";
import { formatHours } from "../lib/format";

interface StatsBarProps {
  entries: TimeEntry[];
}

interface MetricCardProps {
  label: string;
  value: string;
  accent?: boolean;
}

function MetricCard({ label, value, accent = false }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1.5 text-2xl font-bold tabular-nums ${
          accent ? "text-blue-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function StatsBar({ entries }: StatsBarProps) {
  const stats = useMemo(() => {
    const total = entries.reduce((sum, e) => sum + e.durationHours, 0);
    const billable = entries.reduce(
      (sum, e) => sum + (e.billable ? e.durationHours : 0),
      0,
    );
    const nonBillable = total - billable;
    const utilization = total > 0 ? (billable / total) * 100 : 0;
    return { total, billable, nonBillable, utilization };
  }, [entries]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard label="Total Hours" value={formatHours(stats.total)} />
      <MetricCard label="Billable Hours" value={formatHours(stats.billable)} />
      <MetricCard
        label="Non-Billable Hours"
        value={formatHours(stats.nonBillable)}
      />
      <MetricCard
        label="Utilization Rate"
        value={`${Math.round(stats.utilization)}%`}
        accent
      />
    </div>
  );
}
