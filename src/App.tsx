import { useMemo, useState } from "react";
import { EntryForm } from "./components/EntryForm";
import { EntryTable } from "./components/EntryTable";
import { useTimeEntries } from "./hooks/useTimeEntries";
import type { EntryInput } from "./hooks/useTimeEntries";
import type { TimeEntry } from "./types";

function App() {
  const { clients, entries, addEntry, updateEntry, removeEntry, clientNameById } =
    useTimeEntries();
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingEntry = useMemo(
    () => entries.find((entry) => entry.id === editingId) ?? null,
    [entries, editingId],
  );

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
        <EntryForm
          clients={clients}
          editingEntry={editingEntry}
          onAdd={addEntry}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingId(null)}
        />

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Logged time
          </h2>
          <EntryTable
            entries={entries}
            clientNameById={clientNameById}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
