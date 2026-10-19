import type { ComponentProps } from "react";
import { focusRing } from "./styles";

/** A small pill that fills in a value. Shows as selected when it matches. */
export function Chip({ selected, className = "", children, ...rest }: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm whitespace-nowrap transition active:scale-95 ${focusRing} ${
        selected
          ? "border-calm-text bg-calm-text text-calm-surface hover:bg-[#45392f]"
          : "border-calm-border bg-calm-surface text-calm-text hover:border-calm-muted hover:bg-calm-bg"
      } ${className}`}
      {...rest}
    >
      {selected && (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M2.5 6.5 5 9l4.5-6" />
        </svg>
      )}
      {children}
    </button>
  );
}
