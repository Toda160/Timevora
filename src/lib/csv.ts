import type { TimeEntry } from "../types";

/** Wraps a value in quotes and escapes embedded quotes per RFC 4180. */
function escapeCell(value: string | number | boolean): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Builds an RFC 4180 CSV string for the given entries. */
export function entriesToCsv(
  entries: TimeEntry[],
  clientNameById: Map<string, string>,
): string {
  const header = ["Date", "Client", "Description", "Duration (h)", "Billable"];
  const rows = entries.map((entry) => [
    entry.date,
    clientNameById.get(entry.clientId) ?? "Unknown client",
    entry.description,
    entry.durationHours,
    entry.billable ? "Yes" : "No",
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");
}

/** Triggers a client-side download of the given text as a file. */
export function downloadCsv(filename: string, csv: string): void {
  // Prepend a BOM so Excel opens UTF-8 content correctly.
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
