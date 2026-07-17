import type { Client } from "../types";
import {
  emptyFilters,
  hasActiveFilters,
  type BillableFilter,
  type Filters,
} from "../lib/filters";

interface FilterBarProps {
  clients: Client[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
}

const controlClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export function FilterBar({ clients, filters, onChange, resultCount }: FilterBarProps) {
  const isFiltered = hasActiveFilters(filters);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="filter-search" className={labelClass}>
            Search description
          </label>
          <input
            id="filter-search"
            type="text"
            value={filters.search}
            placeholder="Search…"
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className={controlClass}
          />
        </div>

        <div>
          <label htmlFor="filter-client" className={labelClass}>
            Client
          </label>
          <select
            id="filter-client"
            value={filters.clientId}
            onChange={(e) => onChange({ ...filters, clientId: e.target.value })}
            className={controlClass}
          >
            <option value="">All clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-billable" className={labelClass}>
            Status
          </label>
          <select
            id="filter-billable"
            value={filters.billable}
            onChange={(e) =>
              onChange({
                ...filters,
                billable: e.target.value as BillableFilter,
              })
            }
            className={controlClass}
          >
            <option value="all">All statuses</option>
            <option value="billable">Billable</option>
            <option value="non-billable">Non-billable</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {resultCount} {resultCount === 1 ? "entry" : "entries"}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={() => onChange(emptyFilters)}
            className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
