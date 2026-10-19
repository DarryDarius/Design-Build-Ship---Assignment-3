"use client";

import { useSyncExternalStore } from "react";
import { todayISO, type Session } from "./week";

// Everything Study Log remembers lives under one localStorage key.
const KEY = "study-log:v1";

export type Draft = { course: string; minutes: string; place: string; date: string };

export type Data = {
  version: 1;
  sessions: Session[];
  lastVisit?: string; // the last day the Today page was opened
  prevVisit?: string; // the visit before that, for "Welcome back"
  draft?: Draft; // what was typed into the log form but not submitted
};

type State = { data: Data; canSave: boolean };

const EMPTY: Data = { version: 1, sessions: [] };
const ISO = /^\d{4}-\d{2}-\d{2}$/;

let state: State | null = null;
const listeners = new Set<() => void>();

/** Keep only well-formed sessions so one bad entry can't break the app. */
function normalize(raw: unknown): Data {
  const r = raw as Partial<Data> | null;
  const sessions = Array.isArray(r?.sessions)
    ? r.sessions.filter(
        (s): s is Session =>
          !!s && typeof s.id === "string" && typeof s.course === "string" && Number.isFinite(s.minutes) && typeof s.date === "string" && ISO.test(s.date),
      )
    : [];
  return {
    version: 1,
    sessions: sessions.map((s) => ({ ...s, place: typeof s.place === "string" ? s.place : "", createdAt: Number(s.createdAt) || 0 })),
    lastVisit: typeof r?.lastVisit === "string" && ISO.test(r.lastVisit) ? r.lastVisit : undefined,
    prevVisit: typeof r?.prevVisit === "string" && ISO.test(r.prevVisit) ? r.prevVisit : undefined,
    draft: r?.draft && typeof r.draft === "object" ? (r.draft as Draft) : undefined,
  };
}

function load(): State {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
    // Reading can work while writing is blocked (full or locked down), so test a write too.
    localStorage.setItem(`${KEY}:test`, "1");
    localStorage.removeItem(`${KEY}:test`);
  } catch {
    return { data: EMPTY, canSave: false };
  }
  if (!raw) return { data: EMPTY, canSave: true };
  try {
    return { data: normalize(JSON.parse(raw)), canSave: true };
  } catch {
    // Unreadable data: keep a copy for recovery, then start fresh.
    try {
      localStorage.setItem(`${KEY}:corrupt`, raw);
    } catch {}
    return { data: EMPTY, canSave: true };
  }
}

function getState() {
  if (!state) state = load();
  return state;
}

function emit() {
  for (const l of listeners) l();
}

function update(change: (d: Data) => Data) {
  const data = change(getState().data);
  let canSave = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    canSave = false; // keep working in memory for this visit
  }
  state = { data, canSave };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab saved: reload from storage.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      state = null;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved data, or null during the server render and the first paint. */
export function useStudyLog(): State | null {
  return useSyncExternalStore(subscribe, getState, () => null);
}

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export function addSession(s: Omit<Session, "id" | "createdAt">) {
  const session: Session = { ...s, id: newId(), createdAt: Date.now() };
  update((d) => ({ ...d, sessions: [...d.sessions, session] }));
  return session;
}

export function removeSession(id: string) {
  update((d) => ({ ...d, sessions: d.sessions.filter((s) => s.id !== id) }));
}

export function saveDraft(draft: Draft | undefined) {
  update((d) => ({ ...d, draft }));
}

/** Record today's visit, keeping the previous visit day for "Welcome back". */
export function markVisit(today: string) {
  if (getState().data.lastVisit !== today) update((d) => ({ ...d, prevVisit: d.lastVisit, lastVisit: today }));
}

/** The last day before today that this person opened Today, if any. */
export function previousVisit(d: Data, today: string) {
  return d.lastVisit === today ? d.prevVisit : d.lastVisit;
}

/** The most recently logged session, for prefilling and "Log again". */
export function lastSession(sessions: Session[]) {
  return sessions.reduce<Session | undefined>((latest, s) => (!latest || s.createdAt > latest.createdAt ? s : latest), undefined);
}

// Today's date is read in the browser only (never during the prerender),
// and refreshes if the tab stays open past midnight.
function subscribeToday(listener: () => void) {
  const timer = window.setInterval(listener, 60_000);
  return () => window.clearInterval(timer);
}

export function useToday(): string | null {
  return useSyncExternalStore(subscribeToday, todayISO, () => null);
}
