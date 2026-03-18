import bookCombosData from "../data/bookCombos.json";
import prestigeData from "../data/prestigeUpgrades.json";
import enchantmentsData from "../data/enchantments.json";
import { getOwnedBooks } from "../utils/knUtils";
import { getCurrentTier } from "../utils/prestigeUtils";

function getPrestigeMultipliers(prestigeUpgrades, totalWisdomEarned) {
  const multipliers = { generalKn: 1, bioKn: 1, technoKn: 1, cultureKn: 1 };
  if (prestigeUpgrades && prestigeUpgrades.length) {
    const upgradeSet = new Set(prestigeUpgrades);
    prestigeData.prestigeUpgrades.forEach((upgrade) => {
      if (upgradeSet.has(upgrade.id)) {
        multipliers.generalKn *= upgrade.multipliers.generalKn;
        multipliers.bioKn *= upgrade.multipliers.bioKn;
        multipliers.technoKn *= upgrade.multipliers.technoKn;
        multipliers.cultureKn *= upgrade.multipliers.cultureKn;
      }
    });
  }
  // Apply tier passive multiplier
  const tierMult = getCurrentTier(totalWisdomEarned).passiveMultiplier;
  multipliers.generalKn *= tierMult;
  multipliers.bioKn *= tierMult;
  multipliers.technoKn *= tierMult;
  multipliers.cultureKn *= tierMult;
  return multipliers;
}

function getComboMultipliers(upgrades, comboBoost) {
  if (!upgrades) return { generalKn: 1, bioKn: 1, technoKn: 1, cultureKn: 1 };
  const ownedBooks = getOwnedBooks(upgrades);
  const multipliers = { generalKn: 1, bioKn: 1, technoKn: 1, cultureKn: 1 };
  bookCombosData.bookCombos.forEach((combo) => {
    const isActive = combo.requiredBookCount
      ? ownedBooks.length >= combo.requiredBookCount
      : combo.requiredBooks.every((book) => ownedBooks.includes(book));
    if (isActive) {
      multipliers.generalKn *= combo.bonusMultipliers.generalKn;
      multipliers.bioKn *= combo.bonusMultipliers.bioKn;
      multipliers.technoKn *= combo.bonusMultipliers.technoKn;
      multipliers.cultureKn *= combo.bonusMultipliers.cultureKn;
    }
  });
  // Apply combo boost enchantment if present
  if (comboBoost > 1) {
    multipliers.generalKn *= comboBoost;
    multipliers.bioKn *= comboBoost;
    multipliers.technoKn *= comboBoost;
    multipliers.cultureKn *= comboBoost;
  }
  return multipliers;
}

// Cache community book multipliers — parsed once, refreshed only when localStorage changes
let _communityCache = null;
let _communityCacheRaw = null;

function getCommunityBookMultipliers(bookTitle) {
  try {
    const raw = localStorage.getItem("bookSubmissions");
    if (raw !== _communityCacheRaw) {
      _communityCacheRaw = raw;
      _communityCache = raw ? JSON.parse(raw) : null;
    }
    if (_communityCache && _communityCache.winners) {
      const winner = _communityCache.winners.find((w) => w.title === bookTitle);
      if (winner && winner.knMultipliers) {
        return winner.knMultipliers;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Pre-build enchantment lookup map for O(1) access
const enchantmentMap = {};
enchantmentsData.enchantments.forEach((e) => { enchantmentMap[e.id] = e; });

function getEnchantmentEffects(libro, bookEnchantments) {
  const knMults = { generalKn: 1, bioKn: 1, technoKn: 1, cultureKn: 1 };
  let comboBoost = 1;
  if (!bookEnchantments || !bookEnchantments[libro]) return { knMults, comboBoost };
  const enchantId = bookEnchantments[libro];
  const enchant = enchantmentMap[enchantId];
  if (!enchant) return { knMults, comboBoost };
  if (enchant.effect.type === "knMultiplier") {
    knMults.generalKn = enchant.effect.multipliers.generalKn;
    knMults.bioKn = enchant.effect.multipliers.bioKn;
    knMults.technoKn = enchant.effect.multipliers.technoKn;
    knMults.cultureKn = enchant.effect.multipliers.cultureKn;
  } else if (enchant.effect.type === "comboBoost") {
    comboBoost = enchant.effect.value;
  }
  return { knMults, comboBoost };
}

export const useChosenKn = (libro, buffClass, upgrades, prestigeUpgradeIds, bookEnchantments, totalWisdomEarned) => {
  // Compute multipliers once per render, not per setChosenBookEffect call
  const { knMults: enchantMults, comboBoost } = getEnchantmentEffects(libro, bookEnchantments);
  const comboMults = getComboMultipliers(upgrades, comboBoost);
  const prestigeMults = getPrestigeMultipliers(prestigeUpgradeIds, totalWisdomEarned);
  const communityMultipliers = getCommunityBookMultipliers(libro);
  const hasBuff = buffClass === "active-buff" && upgrades && upgrades.culture && upgrades.culture.includes("Atomic habits");

  const setChosenBookEffect = (item) => {
    let genrlKnCountWithEffects;
    let bioKnCountWithEffects;
    let technoKnCountWithEffects;
    let cultureKnCountWithEffects;
    if (hasBuff) {
      item = item * 3;
    }

    if (communityMultipliers) {
      return {
        genrlKnCountWithEffects: item * communityMultipliers.generalKn * enchantMults.generalKn * comboMults.generalKn * prestigeMults.generalKn,
        bioKnCountWithEffects: item * communityMultipliers.bioKn * enchantMults.bioKn * comboMults.bioKn * prestigeMults.bioKn,
        technoKnCountWithEffects: item * communityMultipliers.technoKn * enchantMults.technoKn * comboMults.technoKn * prestigeMults.technoKn,
        cultureKnCountWithEffects: item * communityMultipliers.cultureKn * enchantMults.cultureKn * comboMults.cultureKn * prestigeMults.cultureKn,
      };
    }

    switch (libro) {
      case "General Culture I":
        genrlKnCountWithEffects = item * 1;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0;
        break;
      case "General Culture II":
        genrlKnCountWithEffects = item * 1.25;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0;
        break;
      case "General Culture III":
        genrlKnCountWithEffects = item * 1.5;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0;
        break;
      case "Stuff 101":
        genrlKnCountWithEffects = item * 0;
        bioKnCountWithEffects = item * 0.5;
        technoKnCountWithEffects = item * 0.5;
        cultureKnCountWithEffects = item * 0;
        break;
      case "Technology for dummies":
        genrlKnCountWithEffects = item * 0.5;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 0.5;
        cultureKnCountWithEffects = item * 0;
        break;
      case "DIY at home":
        genrlKnCountWithEffects = item * 1;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 1;
        cultureKnCountWithEffects = item * 0;
        break;
      case "Introduction to Nature":
        genrlKnCountWithEffects = item * 0.5;
        bioKnCountWithEffects = item * 0.5;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0;
        break;
      case "Nature inside out":
        genrlKnCountWithEffects = item * 1;
        bioKnCountWithEffects = item * 1;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0;
        break;
      case "Novel":
        genrlKnCountWithEffects = item * 0.5;
        technoKnCountWithEffects = item * 0;
        bioKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0.5;
        break;
      case "Poems of Rose":
        genrlKnCountWithEffects = item * 0;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 1;
        break;
      case "History about humanity I":
        genrlKnCountWithEffects = item * 0.5;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 1;
        break;
      case "The grand book of animals":
        genrlKnCountWithEffects = item * 0;
        bioKnCountWithEffects = item * 1.25;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0;
        break;
      case "Learning how to teach":
        genrlKnCountWithEffects = item * 0;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 1.25;
        break;
      case "The secret life of trees":
        genrlKnCountWithEffects = item * 0.25;
        bioKnCountWithEffects = item * 1.5;
        technoKnCountWithEffects = item * 0;
        cultureKnCountWithEffects = item * 0;
        break;
      case "Steps into robotics":
        genrlKnCountWithEffects = item * 0.25;
        bioKnCountWithEffects = item * 0;
        technoKnCountWithEffects = item * 1.5;
        cultureKnCountWithEffects = item * 0;
        break;
      default:
        genrlKnCountWithEffects = item * 0.25;
        bioKnCountWithEffects = item * 0.25;
        technoKnCountWithEffects = item * 0.25;
        cultureKnCountWithEffects = item * 0.25;
    }
    return {
      genrlKnCountWithEffects: genrlKnCountWithEffects * enchantMults.generalKn * comboMults.generalKn * prestigeMults.generalKn,
      bioKnCountWithEffects: bioKnCountWithEffects * enchantMults.bioKn * comboMults.bioKn * prestigeMults.bioKn,
      technoKnCountWithEffects: technoKnCountWithEffects * enchantMults.technoKn * comboMults.technoKn * prestigeMults.technoKn,
      cultureKnCountWithEffects: cultureKnCountWithEffects * enchantMults.cultureKn * comboMults.cultureKn * prestigeMults.cultureKn,
    };
  };

  return {
    setChosenBookEffect,
  };
};
