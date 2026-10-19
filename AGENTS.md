<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Study Log

A small tool for a university student to log study sessions toward a weekly goal (default 10 hours). Built for MPCS 51238 Assignment 3 (Patterns & Flows).

Main task: "I log a study session → it counts toward my week → I come back on Thursday, and my progress is still there."

## Flows and pages
- `/` Today. First visit (nothing saved): one-tap starters that log a real session. Coming back: "Welcome back", weekly progress, pace, "Log again".
- `/log` Log a session. One-column form with validation; draft saved as you type.
- `/week` This week. Progress, 7-day strip, sessions by day, Undo toast after logging.
- Diagram: `flows.md` (Mermaid), embedded in `README.md`.

## Rules
- Static Next.js + Tailwind only. Data lives in `localStorage["study-log:v1"]`. No database, accounts, external APIs, or extra npm packages.
- Use the shared components in `src/components/` everywhere (Button, Field, Chip, Toast, Progress, WeekStrip, Nav, EmptyState).
- Style: the Calm design system from Assignment 2 (oat paper, Fraunces + DM Sans, 1px lines, no shadows). The clay accent is reserved for the primary action on each page.
- Form errors sit next to the field and say what to do next ("Enter how many minutes you studied."). Never clear what the person typed.
- Every control works by keyboard, every field has a real `<label>`, text contrast ≥ 4.5:1.

## Commands
- `npm run dev`, `npm run lint`, `npx tsc --noEmit`, `npm run build`
