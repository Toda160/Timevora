import { useMemo } from "react";
import type { TimeEntry } from "../types";
import { formatDate, formatHours } from "../lib/format";

interface EntryTableProps {
  entries: TimeEntry[];
  clientNameById: Map<string, string>;
  editingId: string | null;
  isFiltered: boolean;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
}

function BillableBadge({ billable }: { billable: boolean }) {
  return billable ? (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
      Billable
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
      Non-billable
    </span>
  );
}

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-900">
        {isFiltered ? "No matching entries" : "No time entries yet"}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {isFiltered
          ? "Try adjusting or clearing your filters."
          : "Log your first entry using the form above."}
      </p>
    </div>
  );
}

function EntryActions({
  entry,
  onEdit,
  onDelete,
}: {
  entry: TimeEntry;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onEdit(entry)}
        className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
        aria-label="Edit entry"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(entry.id)}
        className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        aria-label="Delete entry"
      >
        Delete
      </button>
    </div>
  );
}

/**
 * Mobile uses stacked cards (nothing wider than the viewport — this is what
 * prevents the page from panning sideways on phones). Desktop keeps a table.
 */
export function EntryTable({
  entries,
  clientNameById,
  editingId,
  isFiltered,
  onEdit,
  onDelete,
}: EntryTableProps) {
  const sorted = useMemo(
    () =>
      [...entries].sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return a.createdAt < b.createdAt ? 1 : -1;
      }),
    [entries],
  );

  if (sorted.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EmptyState isFiltered={isFiltered} />
      </div>
    );
  }

  return (
    <>
      {/* Mobile: cards — never wider than the screen */}
      <ul className="space-y-3 md:hidden">
        {sorted.map((entry) => (
          <li
            key={entry.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
              editingId === entry.id
                ? "border-blue-300 ring-2 ring-blue-100"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {clientNameById.get(entry.clientId) ?? "Unknown client"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatDate(entry.date)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold tabular-nums text-slate-900">
                {formatHours(entry.durationHours)}
              </p>
            </div>
            <p className="mt-2 break-words text-sm text-slate-600">
              {entry.description || (
                <span className="text-slate-400">No description</span>
              )}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <BillableBadge billable={entry.billable} />
              <EntryActions
                entry={entry}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: classic table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="w-full max-w-full min-w-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Duration
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((entry) => (
                <tr
                  key={entry.id}
                  className={`transition ${
                    editingId === entry.id
                      ? "bg-blue-50/70"
                      : "hover:bg-slate-50/70"
                  }`}
                >
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                    {formatDate(entry.date)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">
                    {clientNameById.get(entry.clientId) ?? "Unknown client"}
                  </td>
                  <td className="max-w-xs px-5 py-3.5 text-slate-600">
                    {entry.description || (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium tabular-nums text-slate-900">
                    {formatHours(entry.durationHours)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <BillableBadge billable={entry.billable} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="flex justify-end">
                      <EntryActions
                        entry={entry}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
