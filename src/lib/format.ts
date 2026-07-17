/** Formats a duration in hours as e.g. "1.5h" (trailing ".0" trimmed). */
export function formatHours(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}h`;
}

/** Formats an ISO date string (YYYY-MM-DD) as a short, readable date. */
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Today as an ISO date string (YYYY-MM-DD), suitable for a date input default. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
