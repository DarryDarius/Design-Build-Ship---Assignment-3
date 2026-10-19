import { formatMinutes, type Day } from "@/lib/week";

/** Mon–Sun with a bar for each day's minutes. Empty days read as slots to fill. */
export function WeekStrip({ days }: { days: Day[] }) {
  const max = Math.max(120, ...days.map((d) => d.minutes)); // a 2-hour day fills the bar
  return (
    <ol className="grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Minutes per day this week">
      {days.map((d) => (
        <li key={d.date} className="flex flex-col items-center gap-1.5">
          <div
            className={`relative flex h-20 w-full items-end overflow-hidden rounded-md border ${
              d.isToday ? "border-calm-text" : d.minutes ? "border-calm-border" : "border-dashed border-calm-border"
            } ${d.isFuture ? "bg-transparent" : "bg-calm-surface"}`}
          >
            {d.minutes > 0 && <div className="w-full bg-calm-sage" style={{ height: `${Math.max(8, (d.minutes / max) * 100)}%` }} />}
          </div>
          <span className={`text-xs ${d.isToday ? "font-semibold text-calm-text" : "text-calm-muted"}`}>
            <span aria-hidden>{d.short}</span>
            <span className="sr-only">
              {d.long}
              {d.isToday ? " (today)" : ""}: {d.minutes ? formatMinutes(d.minutes) : "no study"}
            </span>
          </span>
          <span aria-hidden className="text-[11px] text-calm-muted tabular-nums">
            {d.minutes ? formatMinutes(d.minutes, true) : "–"}
          </span>
        </li>
      ))}
    </ol>
  );
}
