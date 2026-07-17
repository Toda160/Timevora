# LexTime

**Time tracking for law firms — log employee hours by day, client, and billability.**

LexTime is a clean, fast, single-page app for logging and reviewing billable and non-billable time. It runs entirely in the browser with local persistence, so a fresh clone works instantly with realistic demo data already on screen.

---

## Features

- **Log time entries** with date, client, description, duration, and billable/non-billable status.
- **0.1h billing increments** — duration uses a `0.1` step (6-minute units), matching how law firms actually bill.
- **Utilization rate** — a live KPI showing the percentage of billable hours, alongside Total, Billable, and Non-Billable hours.
- **Full editing** — add, inline-edit, and delete entries. The form switches into a clearly marked edit mode with Update/Cancel.
- **Live filtering & search** — filter by client and billable status, and search descriptions. Filters combine and update instantly.
- **CSV export** — download the currently visible (filtered) entries as an Excel-friendly CSV.
- **Local persistence** — everything is saved to `localStorage`, so data survives refreshes and restarts. No account or backend required.
- **Responsive UI** — usable on desktop and mobile, with a horizontally scrollable table that never breaks the page layout.
- **Input validation** — client is required and duration must be greater than zero.

---

## Tech Stack

| Area | Choice |
| --- | --- |
| Build tool | [Vite](https://vite.dev/) |
| UI library | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`) |
| Persistence | Browser `localStorage` (no backend) |

---

## Getting Started

### Prerequisites

- **Node.js 20.19+ or 22+** (required by Vite 8)
- **npm** (bundled with Node)

### Install & Run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd lextime

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL printed in the terminal (typically `http://localhost:5173`).

### Other scripts

```bash
npm run build     # Type-check and build for production (output in dist/)
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## Data & Persistence

LexTime stores all data in the browser's `localStorage` under versioned keys (`lextime.clients.v1`, `lextime.entries.v1`), with safe JSON parsing so corrupted values never crash the app.

- **First run:** if storage is empty, the app seeds **3 realistic law-firm clients** and **5 sample time entries** (a mix of billable and non-billable, with recent dates). This means reviewers see a populated, working app immediately — never a blank table.
- **After that:** the seed never runs again, so your own edits are always preserved.
- **Reset demo data:** clear the site's `localStorage` (via your browser dev tools) and refresh — the seed will repopulate.

Persistence is implemented behind a small repository abstraction (`src/lib/storage.ts`), which keeps the storage details in one place and makes swapping in a real backend later a contained change.

---

## Project Structure

```
src/
├── components/
│   ├── EntryForm.tsx     # Add/edit form with validation
│   ├── EntryTable.tsx    # Sortable table, badges, edit/delete, empty state
│   ├── FilterBar.tsx     # Client, status, and search filters
│   └── StatsBar.tsx      # Total / Billable / Non-billable / Utilization
├── hooks/
│   └── useTimeEntries.ts # State + persistence, seeds on first load
├── lib/
│   ├── storage.ts        # Versioned localStorage repository
│   ├── seed.ts           # First-run demo data
│   ├── filters.ts        # Filter types & helpers
│   ├── format.ts         # Hours/date formatting
│   └── csv.ts            # RFC 4180 CSV export
├── types.ts              # Client & TimeEntry domain model
└── App.tsx               # Layout and composition
```

---

## AI & Vibe Coding Approach

This project was built with **Cursor** using an AI-assisted ("vibe coding") workflow. The goal was to spend time on **product decisions and quality**, not boilerplate.

- **Orchestration over typing:** the AI generated the domain model, storage layer, components, and styling from focused, product-oriented prompts, while I directed architecture, reviewed every change, and made the calls on UX and scope.
- **Product-first increments:** the app was built in small, reviewable steps — data model → persistence → form/table → editing → filters → stats/export → polish — each verified with a type-check and build before moving on.
- **Empirical debugging:** a real issue (the page panning sideways on mobile) was diagnosed instrumentally — driving a headless browser at an iPhone 14 Pro Max viewport to measure exactly which element overflowed — rather than guessing. The fix (`overflow-x: clip`) was then verified the same way.
- **Senior touches:** the details that separate a shippable tool from a to-do list — utilization rate, 0.1h increments, CSV export, edit mode, filters, validation, empty states, and a responsive layout — were prioritized deliberately.

---

## Future Improvements

- **Real backend** — replace the `localStorage` repository with a proper API and database (the repository abstraction is designed for this).
- **Authentication & multi-user** — real login, per-user data, and roles (partner, associate, paralegal).
- **Invoicing** — generate client invoices from billable time, with rates per client/matter.
- **Matters & rates** — support matter/case grouping and configurable hourly rates.
- **Reporting** — date-range reports, per-client summaries, and charts.
- **Timers** — a live start/stop timer in addition to manual duration entry.

---

## License

Built for assessment purposes.
