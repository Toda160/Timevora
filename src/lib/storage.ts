import type { Client, TimeEntry } from "../types";

/**
 * A tiny localStorage-backed repository.
 *
 * Everything is namespaced and versioned (`lextime.<entity>.v1`) so the schema
 * can evolve later without colliding with old data, and every read is guarded
 * with safe JSON parsing so a corrupted value never crashes the app.
 */

const STORAGE_VERSION = "v1";
const KEYS = {
  clients: `lextime.clients.${STORAGE_VERSION}`,
  entries: `lextime.entries.${STORAGE_VERSION}`,
} as const;

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.warn(`[storage] Failed to read "${key}", resetting.`, error);
    return [];
  }
}

function writeList<T>(key: string, value: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage] Failed to write "${key}".`, error);
  }
}

/** Generates a reasonably unique id, using crypto when available. */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeRepository<T extends { id: string }>(key: string) {
  return {
    getAll(): T[] {
      return readList<T>(key);
    },
    save(items: T[]): T[] {
      writeList(key, items);
      return items;
    },
    add(item: T): T[] {
      const next = [...readList<T>(key), item];
      writeList(key, next);
      return next;
    },
    update(id: string, patch: Partial<Omit<T, "id">>): T[] {
      const next = readList<T>(key).map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      );
      writeList(key, next);
      return next;
    },
    remove(id: string): T[] {
      const next = readList<T>(key).filter((item) => item.id !== id);
      writeList(key, next);
      return next;
    },
    isEmpty(): boolean {
      return readList<T>(key).length === 0;
    },
  };
}

export const clientRepository = makeRepository<Client>(KEYS.clients);
export const entryRepository = makeRepository<TimeEntry>(KEYS.entries);
