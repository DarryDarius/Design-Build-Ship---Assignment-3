"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/Button";
import { EmptyState, Skeleton } from "@/components/EmptyState";
import { Progress } from "@/components/Progress";
import { Toast, toastAction } from "@/components/Toast";
import { WeekStrip } from "@/components/WeekStrip";
import { removeSession, useStudyLog, useToday } from "@/lib/store";
import {
  addDays,
  byCourse,
  formatDay,
  formatMinutes,
  GOAL_MINUTES,
  sessionsInWeek,
  total,
  weekDays,
  weekStart,
  type Session,
} from "@/lib/week";

function rangeLabel(today: string) {
  const fmt = (iso: string) => new Date(`${iso}T12:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const start = weekStart(today);
  return `${fmt(start)} – ${fmt(addDays(start, 6))}`;
}

export function WeekView() {
  const store = useStudyLog();
  const today = useToday();
  const router = useRouter();
  const added = useSearchParams().get("added");
  const [undone, setUndone] = useState<Session | null>(null);

  const sessions = store?.data.sessions ?? [];
  const addedSession = added ? sessions.find((s) => s.id === added) : undefined;

  function undo(s: Session) {
    removeSession(s.id);
    setUndone(s);
    router.replace("/week", { scroll: false });
  }

  function dismiss() {
    setUndone(null);
    router.replace("/week", { scroll: false });
  }

  const toast = undone ? (
    <Toast onDismiss={dismiss}>
      Removed {undone.minutes} min of {undone.course}.
    </Toast>
  ) : addedSession ? (
    <Toast
      onDismiss={dismiss}
      action={
        <button type="button" className={toastAction} onClick={() => undo(addedSession)}>
          Undo
        </button>
      }
    >
      Logged {addedSession.minutes} min of {addedSession.course}.
    </Toast>
  ) : null;

  return (
    <>
      {/* Present from the first paint so screen readers announce the toast. */}
      <div aria-live="polite" aria-atomic="true">
        {store && today && toast}
      </div>
      {!store || !today ? <Skeleton /> : <Week sessions={sessions} today={today} highlight={addedSession?.id} />}
      {/* Room at the bottom so the toast never covers the last row. */}
      {toast && <div aria-hidden className="h-20" />}
    </>
  );
}

function Week({ sessions, today, highlight }: { sessions: Session[]; today: string; highlight?: string }) {
  const week = sessionsInWeek(sessions, today);
  const lastWeek = total(sessionsInWeek(sessions, addDays(weekStart(today), -1)));
  const minutes = total(week);

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl leading-tight">This week</h1>
        <p className="mt-1 text-calm-muted">{rangeLabel(today)}</p>
      </div>
      {week.length > 0 && <ButtonLink href="/log">Log a session</ButtonLink>}
    </div>
  );

  if (week.length === 0)
    return (
      <div className="space-y-8">
        {header}
        <EmptyState title="No sessions this week yet" action={<ButtonLink href="/log">Log a session</ButtonLink>}>
          {lastWeek > 0 ? `Last week you studied ${formatMinutes(lastWeek)}. Log one to start this week.` : "Log one and it shows up here."}
        </EmptyState>
        <WeekStrip days={weekDays(sessions, today)} />
      </div>
    );

  // Newest day first; within a day, newest session first.
  const days = [...new Set(week.map((s) => s.date))].sort().reverse();

  return (
    <div className="space-y-10">
      {header}

      <section aria-label="Progress" className="space-y-6 rounded-xl border border-calm-border bg-calm-surface p-5 sm:p-6">
        <Progress minutes={minutes} goal={GOAL_MINUTES} />
        <WeekStrip days={weekDays(sessions, today)} />
        {lastWeek > 0 && <p className="text-sm text-calm-muted">Last week: {formatMinutes(lastWeek)}</p>}
      </section>

      <section aria-labelledby="sessions-h">
        <h2 id="sessions-h" className="font-display text-2xl">
          Sessions
        </h2>
        <div className="mt-4 space-y-6">
          {days.map((date) => {
            const list = week.filter((s) => s.date === date).sort((a, b) => b.createdAt - a.createdAt);
            return (
              <div key={date}>
                <h3 className="flex justify-between border-b border-calm-border pb-2 text-sm font-medium">
                  <span>{formatDay(date, today)}</span>
                  <span className="text-calm-muted tabular-nums">{formatMinutes(total(list))}</span>
                </h3>
                <ul>
                  {list.map((s) => (
                    <li
                      key={s.id}
                      className={`flex items-baseline justify-between gap-4 border-b border-calm-border px-2 py-3 transition-colors ${
                        s.id === highlight ? "bg-calm-sage-tint" : ""
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg">{s.course}</span>
                        {s.place && <span className="block truncate text-sm text-calm-muted">{s.place}</span>}
                      </span>
                      <span className="shrink-0 text-calm-muted tabular-nums">{s.minutes} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="courses-h">
        <h2 id="courses-h" className="font-display text-2xl">
          By course
        </h2>
        <ul className="mt-4 space-y-3">
          {byCourse(week).map((c) => (
            <li key={c.course}>
              <div className="flex justify-between gap-4 text-sm">
                <span>{c.course}</span>
                <span className="text-calm-muted tabular-nums">{formatMinutes(c.minutes)}</span>
              </div>
              <div aria-hidden className="mt-1.5 h-1.5 rounded-full bg-calm-border/60">
                <div className="h-full rounded-full bg-calm-muted" style={{ width: `${(c.minutes / minutes) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
