/**
 * Sum all kN types into a single number.
 */
export function sumKn(kn) {
  return (kn.generalKn || 0) + (kn.bioKn || 0) + (kn.technoKn || 0) + (kn.cultureKn || 0);
}

/**
 * Get all owned book names from the upgrades object.
 */
export function getOwnedBooks(upgrades) {
  if (!upgrades) return [];
  return [
    ...(upgrades.multiplicador || []),
    ...(upgrades.technology || []),
    ...(upgrades.nature || []),
    ...(upgrades.culture || []),
  ];
}

/**
 * Format a kN reward object as a human-readable string.
 * Supports both kN rewards and WP rewards.
 */
export function formatKnReward(reward) {
  if (reward.type === "wp") return `+${reward.amount} WP`;
  const parts = [];
  if (reward.generalKn) parts.push(`+${reward.generalKn} kN`);
  if (reward.bioKn) parts.push(`+${reward.bioKn} bioKn`);
  if (reward.technoKn) parts.push(`+${reward.technoKn} technoKn`);
  if (reward.cultureKn) parts.push(`+${reward.cultureKn} cultureKn`);
  return parts.join(", ");
}
