/**
 * Weekly cycle for book submissions.
 * Monday–Friday: submissions open
 * Saturday–Sunday: voting open
 *
 * Week ids are Luxon ISO weeks (Monday 00:00 through Sunday), so Saturday
 * and Sunday share an id and a calendar year change does not split a week.
 */

import { DateTime } from "luxon";

export const PHASES = {
  SUBMISSION: "SUBMISSION",
  VOTING: "VOTING",
};

function toDateTime(now) {
  if (DateTime.isDateTime(now)) return now;
  if (now instanceof Date) return DateTime.fromJSDate(now);
  if (typeof now === "number" || typeof now === "string") {
    return DateTime.fromJSDate(new Date(now));
  }
  return DateTime.now();
}

export function getCurrentPhase(now) {
  const weekday = toDateTime(now).weekday; // 1=Mon ... 7=Sun
  if (weekday === 6 || weekday === 7) {
    return PHASES.VOTING;
  }
  return PHASES.SUBMISSION;
}

export function getWeekId(now) {
  const dt = toDateTime(now);
  const safe = dt.isValid ? dt : DateTime.now();
  return `${safe.weekYear}-W${String(safe.weekNumber).padStart(2, "0")}`;
}

export function getPhaseEndLabel(now) {
  const dt = toDateTime(now);
  const phase = getCurrentPhase(dt);

  if (phase === PHASES.SUBMISSION) {
    // Saturday is weekday 6. Monday (1) has 5 days left, Friday (5) has 1.
    const daysLeft = 6 - dt.weekday;
    return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to submit`;
  }
  const daysLeft = dt.weekday === 6 ? 2 : 1;
  return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to vote`;
}
