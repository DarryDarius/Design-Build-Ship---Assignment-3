import type { ReactNode } from "react";

/** Never a dead end: says what's missing and offers the next step. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-calm-border px-5 py-8 text-center sm:px-8">
      <p className="font-display text-xl text-calm-text">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-sm text-calm-muted">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Shown for a moment while saved data is read from this browser. */
export function Skeleton() {
  return (
    <div role="status" className="animate-pulse-soft space-y-4" aria-label="Loading your sessions">
      <div className="h-9 w-2/3 rounded bg-calm-border" />
      <div className="h-4 w-1/2 rounded bg-calm-border" />
      <div className="h-24 rounded-xl bg-calm-border/70" />
    </div>
  );
}
