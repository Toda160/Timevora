/**
 * Core domain model for the LexTime law-firm time tracker.
 */

/** A client the firm bills time against. */
export interface Client {
  id: string;
  name: string;
}

/** A single logged unit of work. */
export interface TimeEntry {
  id: string;
  /** Calendar day the work was performed, stored as an ISO date string (YYYY-MM-DD). */
  date: string;
  /** References {@link Client.id}. */
  clientId: string;
  description: string;
  /** Logged duration in hours. Law firms bill in 0.1h (6-minute) increments. */
  durationHours: number;
  /** Whether the time can be billed to the client. */
  billable: boolean;
  /** ISO timestamp of when the entry was created. */
  createdAt: string;
}
