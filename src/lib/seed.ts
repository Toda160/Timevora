import type { Client, TimeEntry } from "../types";
import { clientRepository, createId, entryRepository } from "./storage";

/** Returns an ISO date string (YYYY-MM-DD) for `daysAgo` before today. */
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Seeds demo data on first run so reviewers see a populated app immediately.
 * Runs only when both repositories are empty, so it never clobbers real edits.
 */
export function seedIfEmpty(): { clients: Client[]; entries: TimeEntry[] } {
  const clientsEmpty = clientRepository.isEmpty();
  const entriesEmpty = entryRepository.isEmpty();

  if (!clientsEmpty || !entriesEmpty) {
    return {
      clients: clientRepository.getAll(),
      entries: entryRepository.getAll(),
    };
  }

  const now = new Date().toISOString();

  const clients: Client[] = [
    { id: createId(), name: "Hendricks & Associates" },
    { id: createId(), name: "Northgate Property Group" },
    { id: createId(), name: "Meridian Biotech Inc." },
  ];

  const [hendricks, northgate, meridian] = clients;

  const entries: TimeEntry[] = [
    {
      id: createId(),
      date: daysAgo(0),
      clientId: hendricks.id,
      description: "Reviewed and revised settlement agreement",
      durationHours: 2.5,
      billable: true,
      createdAt: now,
    },
    {
      id: createId(),
      date: daysAgo(1),
      clientId: northgate.id,
      description: "Drafted commercial lease amendments",
      durationHours: 3.2,
      billable: true,
      createdAt: now,
    },
    {
      id: createId(),
      date: daysAgo(1),
      clientId: meridian.id,
      description: "Patent filing strategy call with client",
      durationHours: 1.0,
      billable: true,
      createdAt: now,
    },
    {
      id: createId(),
      date: daysAgo(2),
      clientId: hendricks.id,
      description: "Internal case-management admin and filing",
      durationHours: 0.6,
      billable: false,
      createdAt: now,
    },
    {
      id: createId(),
      date: daysAgo(3),
      clientId: meridian.id,
      description: "Pro bono community legal clinic session",
      durationHours: 1.5,
      billable: false,
      createdAt: now,
    },
  ];

  clientRepository.save(clients);
  entryRepository.save(entries);

  return { clients, entries };
}
