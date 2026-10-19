"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Skeleton } from "@/components/EmptyState";
import { WeekStrip } from "@/components/WeekStrip";
import { addSession, markVisit, useStudyLog, useToday } from "@/lib/store";
import { weekDays } from "@/lib/week";

// One tap logs a real session, so the first visit is useful right away.
const STARTERS = [
  { course: "Reading", minutes: 25 },
  { course: "Problem set", minutes: 50 },
  { course: "Review notes", minutes: 30 },
];

export function TodayView() {
  const store = useStudyLog();
  const router = useRouter();
  const today = useToday();

  useEffect(() => {
    if (store && today) markVisit(today);
  }, [store, today]);

  if (!store || !today) return <Skeleton />;
  const { sessions } = store.data;

  const quickLog = (course: string, minutes: number) => {
    const s = addSession({ course, minutes, place: "", date: today });
    router.push(`/week?added=${s.id}`);
  };

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">What did you study today?</h1>
        <p className="mt-3 max-w-md text-calm-muted">Log a session and watch your week add up toward 10 hours.</p>
        <ButtonLink href="/log" className="mt-6">
          Log a session
        </ButtonLink>

        <div className="mt-8 border-t border-calm-border pt-6">
          <h2 className="font-medium">Or start with one tap</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <li key={s.course}>
                <Button variant="secondary" onClick={() => quickLog(s.course, s.minutes)}>
                  <span aria-hidden>+</span> {s.course} · {s.minutes} min
                </Button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-calm-muted">Tap one, and it counts toward today.</p>
        </div>
      </section>

      <section aria-labelledby="week-h">
        <h2 id="week-h" className="font-display text-2xl">
          This week
        </h2>
        <div className="mt-4">
          <WeekStrip days={weekDays(sessions, today)} />
        </div>
        <p className="mt-3 text-sm text-calm-muted">Your week fills in as you log.</p>
      </section>
    </div>
  );
}
