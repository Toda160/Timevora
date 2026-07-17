import { useMemo, useState } from "react";
import { EntryForm } from "./components/EntryForm";
import { EntryTable } from "./components/EntryTable";
import { FilterBar, emptyFilters, type Filters } from "./components/FilterBar";
import { StatsBar } from "./components/StatsBar";
import { useTimeEntries } from "./hooks/useTimeEntries";
import type { EntryInput } from "./hooks/useTimeEntries";
import type { TimeEntry } from "./types";
import { downloadCsv, entriesToCsv } from "./lib/csv";
import { todayIso } from "./lib/format";

function App() {
  const { clients, entries, addEntry, updateEntry, removeEntry, clientNameById } =
    useTimeEntries();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const editingEntry = useMemo(
    () => entries.find((entry) => entry.id === editingId) ?? null,
    [entries, editingId],
  );

  const filteredEntries = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (filters.clientId && entry.clientId !== filters.clientId) return false;
      if (filters.billable === "billable" && !entry.billable) return false;
      if (filters.billable === "non-billable" && entry.billable) return false;
      if (search && !entry.description.toLowerCase().includes(search))
        return false;
      return true;
    });
  }, [entries, filters]);

  function handleEdit(entry: TimeEntry) {
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleUpdate(id: string, input: EntryInput) {
    updateEntry(id, input);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    if (id === editingId) setEditingId(null);
    removeEntry(id);
  }

  function handleExportCsv() {
    const csv = entriesToCsv(filteredEntries, clientNameById);
    downloadCsv(`lextime-entries-${todayIso()}.csv`, csv);
  }

  const isFiltered =
    filters.clientId !== "" ||
    filters.billable !== "all" ||
    filters.search.trim() !== "";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Lex<span className="text-blue-600">Time</span>
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Time tracking for law firms — by day, client, and billability.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <StatsBar entries={filteredEntries} />

        <EntryForm
          clients={clients}
          editingEntry={editingEntry}
          onAdd={addEntry}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingId(null)}
        />

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Logged time
            </h2>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredEntries.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export CSV
            </button>
          </div>
          <FilterBar
            clients={clients}
            filters={filters}
            onChange={setFilters}
            resultCount={filteredEntries.length}
          />
          <EntryTable
            entries={filteredEntries}
            clientNameById={clientNameById}
            editingId={editingId}
            isFiltered={isFiltered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
