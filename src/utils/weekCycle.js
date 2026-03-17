/**
 * Weekly cycle utility for book submissions.
 * Monday-Friday: submissions open
 * Saturday-Sunday: voting open
 */

export const PHASES = {
  SUBMISSION: "SUBMISSION",
  VOTING: "VOTING",
};

export function getCurrentPhase() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  if (day === 0 || day === 6) {
    return PHASES.VOTING;
  }
  return PHASES.SUBMISSION;
}

export function getWeekId() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
}

export function getPhaseEndLabel() {
  const now = new Date();
  const day = now.getDay();
  const phase = getCurrentPhase();

  if (phase === PHASES.SUBMISSION) {
    // Days until Saturday (6)
    const daysLeft = 6 - day;
    return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to submit`;
  } else {
    // Days until Monday (1)
    const daysLeft = day === 6 ? 2 : 1;
    return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to vote`;
  }
}
