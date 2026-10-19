import type { ComponentProps, ReactNode } from "react";

/** Ids for a field's hint and error, for aria-describedby. */
export function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

/** Label, optional hint, the control, and an error that says what to do next. */
export function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
  after,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  /** Shortcuts like chips, placed below the error so the error stays next to the input. */
  after?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium text-calm-text">
        {label}
        {optional && <span className="font-normal text-calm-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-calm-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-calm-error">
          <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5v4M8 11v.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
      {after && <div className="mt-2.5">{after}</div>}
    </div>
  );
}

const control = (invalid?: boolean) =>
  `w-full rounded-md border bg-white/70 px-3 py-2.5 text-base text-calm-text transition placeholder:text-calm-muted hover:border-calm-muted focus:border-calm-accent focus:ring-1 focus:ring-calm-accent outline-none ${
    invalid ? "border-calm-error ring-1 ring-calm-error" : "border-calm-border"
  }`;

export function Input({ invalid, className = "", ...rest }: ComponentProps<"input"> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={`${control(invalid)} ${className}`} {...rest} />;
}

export function Select({ invalid, className = "", children, ...rest }: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <span className="relative block">
      <select aria-invalid={invalid || undefined} className={`${control(invalid)} cursor-pointer appearance-none pr-10 ${className}`} {...rest}>
        {children}
      </select>
      <svg viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-calm-muted" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="m4 6 4 4 4-4" />
      </svg>
    </span>
  );
}

