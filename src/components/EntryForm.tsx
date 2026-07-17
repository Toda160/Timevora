import { useState, type FormEvent } from "react";
import type { Client, TimeEntry } from "../types";
import type { EntryInput } from "../hooks/useTimeEntries";
import { todayIso } from "../lib/format";

interface EntryFormProps {
  clients: Client[];
  /** When set, the form is in edit mode for this entry. */
  editingEntry: TimeEntry | null;
  onAdd: (input: EntryInput) => void;
  onUpdate: (id: string, input: EntryInput) => void;
  onCancelEdit: () => void;
}

interface FormErrors {
  clientId?: string;
  durationHours?: string;
}

function emptyDraft(clients: Client[]): EntryInput {
  return {
    date: todayIso(),
    clientId: clients[0]?.id ?? "",
    description: "",
    durationHours: 1,
    billable: true,
  };
}

function draftFromEntry(entry: TimeEntry): EntryInput {
  return {
    date: entry.date,
    clientId: entry.clientId,
    description: entry.description,
    durationHours: entry.durationHours,
    billable: entry.billable,
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export function EntryForm({
  clients,
  editingEntry,
  onAdd,
  onUpdate,
  onCancelEdit,
}: EntryFormProps) {
  const isEditing = editingEntry !== null;
  // The parent remounts this form (via `key`) when the edit target changes,
  // so initializing state from props here is enough — no effect required.
  const [draft, setDraft] = useState<EntryInput>(() =>
    editingEntry ? draftFromEntry(editingEntry) : emptyDraft(clients),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(value: EntryInput): FormErrors {
    const next: FormErrors = {};
    if (!value.clientId) next.clientId = "Please select a client.";
    if (!value.durationHours || value.durationHours <= 0)
      next.durationHours = "Duration must be greater than 0.";
    return next;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validate(draft);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const clean = { ...draft, description: draft.description.trim() };
    if (isEditing && editingEntry) {
      onUpdate(editingEntry.id, clean);
    } else {
      onAdd(clean);
      setDraft(emptyDraft(clients));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        isEditing ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        {isEditing ? "Edit time entry" : "Log time"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={draft.date}
            max={todayIso()}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="client" className={labelClass}>
            Client
          </label>
          <select
            id="client"
            value={draft.clientId}
            onChange={(e) => setDraft({ ...draft, clientId: e.target.value })}
            className={inputClass}
          >
            <option value="" disabled>
              Select a client…
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-xs text-red-600">{errors.clientId}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <input
            id="description"
            type="text"
            value={draft.description}
            placeholder="e.g. Drafted settlement agreement"
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="duration" className={labelClass}>
            Duration (hours)
          </label>
          <input
            id="duration"
            type="number"
            step="0.1"
            min="0.1"
            value={draft.durationHours}
            onChange={(e) =>
              setDraft({ ...draft, durationHours: Number(e.target.value) })
            }
            className={inputClass}
          />
          {errors.durationHours && (
            <p className="mt-1 text-xs text-red-600">{errors.durationHours}</p>
          )}
        </div>

        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2.5 py-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={draft.billable}
              onChange={(e) => setDraft({ ...draft, billable: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Billable
          </label>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {isEditing ? "Update entry" : "Add entry"}
        </button>
      </div>
    </form>
  );
}
