import type { Draft } from "./store";
import { earliestDay } from "./week";

export type FieldName = "course" | "minutes" | "date";
export type Errors = Partial<Record<FieldName, string>>;

// Each message says what to do next, not just what went wrong.
export function validateSession(d: Draft, today: string): Errors {
  const errors: Errors = {};
  const course = d.course.trim();
  if (!course) errors.course = "Enter what you studied, like a course or topic.";
  else if (course.length > 60) errors.course = "Keep it under 60 characters.";

  const minutes = d.minutes.trim();
  if (!minutes) errors.minutes = "Enter how many minutes you studied.";
  else if (!/^\d+$/.test(minutes)) errors.minutes = "Enter minutes as a whole number, like 45.";
  else if (+minutes < 5 || +minutes > 600) errors.minutes = "Enter between 5 and 600 minutes.";

  if (!d.date) errors.date = "Pick the day you studied.";
  else if (d.date > today) errors.date = "Pick today or an earlier day.";
  else if (d.date < earliestDay(today)) errors.date = "Pick a day this week or last week.";

  return errors;
}

export const FIELD_ORDER: FieldName[] = ["course", "minutes", "date"];
