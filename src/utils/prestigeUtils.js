import prestigeData from "../data/prestigeUpgrades.json";

/**
 * Get the current prestige tier for a given totalWisdomEarned.
 */
export function getCurrentTier(totalWisdomEarned) {
  let tier = prestigeData.prestigeTiers[0];
  for (const t of prestigeData.prestigeTiers) {
    if ((totalWisdomEarned || 0) >= t.wpRequired) tier = t;
  }
  return tier;
}

/**
 * Get the next prestige tier (or null if at max).
 */
export function getNextTier(totalWisdomEarned) {
  for (const t of prestigeData.prestigeTiers) {
    if ((totalWisdomEarned || 0) < t.wpRequired) return t;
  }
  return null;
}

/**
 * Get the index of a tier by its id.
 */
export function getTierIndex(tierId) {
  return prestigeData.prestigeTiers.findIndex((t) => t.id === tierId);
}
