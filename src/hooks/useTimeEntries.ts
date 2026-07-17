import { useCallback, useMemo, useState } from "react";
import type { Client, TimeEntry } from "../types";
import { createId, entryRepository } from "../lib/storage";
import { seedIfEmpty } from "../lib/seed";

/** Fields the user supplies when creating or editing an entry. */
export type EntryInput = Omit<TimeEntry, "id" | "createdAt">;

/**
 * Central state hook for the app. Loads clients + entries from localStorage
 * (seeding demo data on first run) and keeps the repository in sync on every
 * mutation, so a page refresh always reflects the latest state.
 */
export function useTimeEntries() {
  // Seed + load synchronously on first render so the UI is populated
  // immediately (no empty-then-filled flash) and no effect is needed.
  const [initial] = useState(seedIfEmpty);
  const [clients] = useState<Client[]>(initial.clients);
  const [entries, setEntries] = useState<TimeEntry[]>(initial.entries);

  const addEntry = useCallback((input: EntryInput) => {
    const entry: TimeEntry = {
      ...input,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    setEntries(entryRepository.add(entry));
  }, []);

  const updateEntry = useCallback((id: string, input: EntryInput) => {
    setEntries(entryRepository.update(id, input));
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(entryRepository.remove(id));
  }, []);

  /** Fast lookup from clientId to client name for rendering. */
  const clientNameById = useMemo(() => {
    return new Map(clients.map((c) => [c.id, c.name]));
  }, [clients]);

  return {
    clients,
    entries,
    addEntry,
    updateEntry,
    removeEntry,
    clientNameById,
  };
}
