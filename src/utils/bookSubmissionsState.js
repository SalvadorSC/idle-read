/**
 * Turn whatever was stored under `bookSubmissions` into a full state object.
 * Never throws: missing arrays, a non-object payload, or a week change are all safe.
 */
export function normalizeBookSubmissionsState(saved, currentWeek) {
  const safeSaved =
    saved && typeof saved === "object" && !Array.isArray(saved) ? saved : null;
  const submissions = Array.isArray(safeSaved && safeSaved.submissions)
    ? safeSaved.submissions.filter((entry) => entry && typeof entry === "object")
    : [];
  const winners = Array.isArray(safeSaved && safeSaved.winners)
    ? safeSaved.winners.filter((entry) => entry && typeof entry === "object")
    : [];
  const savedWeek =
    safeSaved && typeof safeSaved.currentWeek === "string"
      ? safeSaved.currentWeek
      : null;

  const withIds = (list, prefix) =>
    list.map((entry, index) =>
      entry.id ? entry : { ...entry, id: `${prefix}-${savedWeek || "unknown"}-${index}` }
    );

  if (savedWeek === currentWeek) {
    return {
      currentWeek,
      submissions: withIds(submissions, "submission"),
      hasSubmitted: Boolean(safeSaved && safeSaved.hasSubmitted),
      hasVoted: Boolean(safeSaved && safeSaved.hasVoted),
      winners: withIds(winners, "winner"),
    };
  }

  let newWinners = withIds(winners, "winner");
  if (savedWeek && submissions.length > 0) {
    const sorted = [...submissions].sort(
      (a, b) => (Number(b.votes) || 0) - (Number(a.votes) || 0)
    );
    const leader = sorted[0];
    if (leader && Number(leader.votes) > 0) {
      const archived = leader.id
        ? leader
        : { ...leader, id: `winner-${savedWeek}` };
      newWinners = [
        ...newWinners,
        {
          ...archived,
          weekId: savedWeek,
          wonAt: Date.now(),
        },
      ];
    }
  }

  return {
    currentWeek,
    submissions: [],
    hasSubmitted: false,
    hasVoted: false,
    winners: newWinners,
  };
}
