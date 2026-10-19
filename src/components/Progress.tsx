import { formatMinutes } from "@/lib/week";

/** Minutes toward the weekly goal, as text and a bar. */
export function Progress({ minutes, goal }: { minutes: number; goal: number }) {
  const pct = Math.min(100, Math.round((minutes / goal) * 100));
  return (
    <div>
      <p className="flex items-baseline justify-between gap-3">
        <span className="font-display text-3xl text-calm-text tabular-nums">{formatMinutes(minutes)}</span>
        <span className="text-sm text-calm-muted">of {formatMinutes(goal)} this week</span>
      </p>
      <div
        role="progressbar"
        aria-label="Weekly goal"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(minutes, goal)}
        aria-valuetext={`${formatMinutes(minutes)} of ${formatMinutes(goal)}`}
        className="mt-3 h-2.5 overflow-hidden rounded-full border border-calm-border bg-calm-bg"
      >
        <div className="h-full rounded-full bg-calm-sage transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
