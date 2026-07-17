import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [clients, setClients] = useState<Client[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    const { clients: seededClients, entries: seededEntries } = seedIfEmpty();
    setClients(seededClients);
    setEntries(seededEntries);
  }, []);

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
