// Shared class strings so every control looks and responds the same way.

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg";

const base =
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition active:translate-y-px disabled:cursor-not-allowed disabled:translate-y-0";

export const buttonStyles = {
  // Clay accent: the one primary action on a page.
  primary: `${base} ${focusRing} bg-calm-accent text-white hover:bg-calm-accent-hover active:bg-calm-accent-press disabled:bg-calm-border disabled:text-calm-muted`,
  secondary: `${base} ${focusRing} border border-calm-border bg-calm-surface text-calm-text hover:border-calm-muted hover:bg-calm-bg active:bg-calm-press disabled:border-dashed disabled:text-calm-muted`,
  quiet: `${base} ${focusRing} text-calm-text underline decoration-calm-border decoration-2 underline-offset-4 hover:decoration-calm-accent px-1`,
};
