// Dates are local "YYYY-MM-DD" strings. Weeks start on Monday.

export const GOAL_MINUTES = 600; // 10 hours a week

export type Session = {
  id: string;
  course: string;
  minutes: number;
  place: string;
  date: string;
  createdAt: number;
};

export type Day = {
  date: string;
  short: string;
  long: string;
  minutes: number;
  isToday: boolean;
  isFuture: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

function parse(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number) {
  const d = parse(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function weekStart(iso: string) {
  const day = parse(iso).getDay(); // 0 = Sunday
  return addDays(iso, day === 0 ? -6 : 1 - day);
}

export function isSameWeek(a: string, b: string) {
  return weekStart(a) === weekStart(b);
}

export function sessionsInWeek(sessions: Session[], anyDayIso: string) {
  const start = weekStart(anyDayIso);
  const end = addDays(start, 7);
  return sessions.filter((s) => s.date >= start && s.date < end);
}

export const total = (sessions: Session[]) => sessions.reduce((sum, s) => sum + s.minutes, 0);

export function weekDays(sessions: Session[], today: string): Day[] {
  const start = weekStart(today);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    const d = parse(date);
    return {
      date,
      short: d.toLocaleDateString("en-US", { weekday: "short" }),
      long: d.toLocaleDateString("en-US", { weekday: "long" }),
      minutes: total(sessions.filter((s) => s.date === date)),
      isToday: date === today,
      isFuture: date > today,
    };
  });
}

export function byCourse(sessions: Session[]) {
  const map = new Map<string, number>();
  for (const s of sessions) map.set(s.course, (map.get(s.course) ?? 0) + s.minutes);
  return [...map].map(([course, minutes]) => ({ course, minutes })).sort((a, b) => b.minutes - a.minutes);
}

/** How far ahead or behind an even pace toward the goal, counting today. */
export function pace(minutes: number, today: string) {
  const day = parse(today).getDay();
  const daysIn = day === 0 ? 7 : day;
  const expected = Math.round((GOAL_MINUTES * daysIn) / 7);
  return minutes - expected;
}

/** 45m · 2h · 2h 05m. Compact drops the space and the trailing m: 2h05. */
export function formatMinutes(m: number, compact = false) {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (!rest) return `${h}h`;
  return compact ? `${h}h${pad(rest)}` : `${h}h ${pad(rest)}m`;
}

export function formatDay(iso: string, today: string) {
  if (iso === today) return "Today";
  if (iso === addDays(today, -1)) return "Yesterday";
  return parse(iso).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
