"use client";

import { useEffect, type ReactNode } from "react";
import { focusRing } from "./styles";

/** Confirmation after an action, with an optional undo. Stays until dismissed. */
export function Toast({ children, action, onDismiss }: { children: ReactNode; action?: ReactNode; onDismiss: () => void }) {
  // Esc closes it from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDismiss();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div className="animate-rise fixed inset-x-4 bottom-4 z-10 mx-auto flex max-w-md items-center gap-3 rounded-lg bg-calm-text py-2 pr-2 pl-4 text-sm text-calm-surface sm:bottom-6">
      <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M2.5 6.5 5 9l4.5-6" />
      </svg>
      <p className="flex-1">{children}</p>
      {action}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-calm-border hover:bg-white/10 hover:text-calm-surface ${focusRing} focus-visible:ring-offset-calm-text`}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}

export const toastAction = `cursor-pointer rounded-md px-3 py-2 font-medium text-calm-surface underline decoration-calm-surface/40 decoration-2 underline-offset-4 hover:decoration-calm-surface ${focusRing} focus-visible:ring-offset-calm-text`;
