import React, { useContext } from "react";
import StatsContext from "../../context/StatsContext";
import PrestigeContext from "../../context/PrestigeContext";
import { useCheats } from "../../hooks/useCheats";
import { sumKn } from "../../utils/knUtils";
import { getCurrentTier, getNextTier, getTierIndex } from "../../utils/prestigeUtils";
import prestigeData from "../../data/prestigeUpgrades.json";
import { Tooltip } from "../Tooltip/Tooltip";
import "./Prestige.css";

export const Prestige = () => {
  const { totalKnCountOfThisRun, resets } = useContext(StatsContext);
  const {
    wisdomPoints,
    setWisdomPoints,
    totalWisdomEarned,
    setTotalWisdomEarned,
    prestigeUpgrades,
    setPrestigeUpgrades,
  } = useContext(PrestigeContext);
  const { resetGame } = useCheats();

  const totalKnThisRun = sumKn(totalKnCountOfThisRun);

  const currentTier = getCurrentTier(totalWisdomEarned);
  const nextTier = getNextTier(totalWisdomEarned);

  const calcWisdomGain = () => {
    if (totalKnThisRun < 1000) return 0;
    const base = Math.floor(Math.sqrt(totalKnThisRun / 1000));
    // Resets bonus: +5% per reset, capped at +50%
    const resetBonus = 1 + Math.min(resets * 0.05, 0.5);
    return Math.floor(base * resetBonus);
  };

  const wisdomGain = calcWisdomGain();

  const handlePrestige = () => {
    if (wisdomGain <= 0) return;
    setWisdomPoints(wisdomPoints + wisdomGain);
    setTotalWisdomEarned(totalWisdomEarned + wisdomGain);
    resetGame();
  };

  const handleBuyUpgrade = (upgrade) => {
    if (wisdomPoints < upgrade.cost) return;
    if (prestigeUpgrades.includes(upgrade.id)) return;
    // Check tier requirement
    const requiredTierIdx = getTierIndex(upgrade.requiredTier || "novice");
    const currentTierIdx = getTierIndex(currentTier.id);
    if (currentTierIdx < requiredTierIdx) return;
    setWisdomPoints(wisdomPoints - upgrade.cost);
    setPrestigeUpgrades([...prestigeUpgrades, upgrade.id]);
  };

  const tierProgressPercent = nextTier
    ? Math.min(
        100,
        ((totalWisdomEarned - currentTier.wpRequired) /
          (nextTier.wpRequired - currentTier.wpRequired)) *
          100
      )
    : 100;

  return (
    <div className="prestige-container">
      <div className="prestige-header">
        <h3 className="prestige-title">Prestige</h3>
        <p className="prestige-wp">
          <Tooltip text="Earned by resetting with enough kN" position="right">
            <span className="wp-amount">{wisdomPoints}</span>
          </Tooltip>{" "}
          Wisdom Points
        </p>
        <p className="prestige-total-wp">
          Total earned: {totalWisdomEarned} WP
        </p>
      </div>

      <div className="prestige-tier-section">
        <div className="prestige-tier-header">
          <span className="prestige-tier-label">Prestige Tier:</span>
          <span className="prestige-tier-name">{currentTier.name}</span>
        </div>
        <Tooltip
          text={`Passive bonus: x${currentTier.passiveMultiplier} all kN`}
          position="bottom"
        >
          <p className="prestige-tier-bonus">
            Tier Bonus: x{currentTier.passiveMultiplier} all kN
          </p>
        </Tooltip>
        {nextTier ? (
          <>
            <div className="prestige-tier-progress-bar">
              <div
                className="prestige-tier-progress-fill"
                style={{ width: `${tierProgressPercent}%` }}
              />
            </div>
            <p className="prestige-tier-next">
              Next: {nextTier.name} ({totalWisdomEarned}/{nextTier.wpRequired} WP)
            </p>
          </>
        ) : (
          <p className="prestige-tier-max">Maximum tier reached!</p>
        )}
      </div>

      <div className="prestige-reset-section">
        <p className="prestige-gain-info">
          Total kN this run:{" "}
          {Math.floor(totalKnThisRun * 100) / 100}
        </p>
        <p className="prestige-gain-info">
          Resetting now would grant:{" "}
          <span className="wp-amount">
            {wisdomGain} WP
          </span>
        </p>
        <p className="prestige-formula">
          Formula: floor(sqrt(totalKn / 1000) * resetBonus)
        </p>
        <p className="prestige-formula">
          Reset bonus: +{Math.min(resets * 5, 50)}% (from {resets} resets)
        </p>
        <Tooltip
          text={
            wisdomGain <= 0
              ? "Need at least 1,000 total kN to prestige"
              : "Resets your run but keeps Wisdom Points and upgrades"
          }
          position="top"
        >
          <button
            className="prestige-button"
            disabled={wisdomGain <= 0}
            onClick={handlePrestige}
          >
            Prestige{wisdomGain > 0 ? ` (+${wisdomGain} WP)` : ""}
          </button>
        </Tooltip>
      </div>

      <div className="prestige-upgrades">
        <h4 className="prestige-upgrades-title">Wisdom Upgrades</h4>
        {prestigeData.prestigeUpgrades.map((upgrade) => {
          const owned = prestigeUpgrades.includes(upgrade.id);
          const canAfford = wisdomPoints >= upgrade.cost;
          const requiredTierIdx = getTierIndex(upgrade.requiredTier || "novice");
          const currentTierIdx = getTierIndex(currentTier.id);
          const tierLocked = currentTierIdx < requiredTierIdx;
          const requiredTierName =
            prestigeData.prestigeTiers[requiredTierIdx]?.name || "Novice";
          return (
            <div
              key={upgrade.id}
              className={`prestige-upgrade-item ${owned ? "prestige-owned" : ""} ${tierLocked ? "prestige-tier-locked" : ""}`}
            >
              <div className="prestige-upgrade-info">
                <span className="prestige-upgrade-name">
                  {upgrade.name}
                  {tierLocked && (
                    <span className="prestige-upgrade-tier-tag">
                      {requiredTierName}
                    </span>
                  )}
                </span>
                <span className="prestige-upgrade-desc">
                  {upgrade.description}
                </span>
              </div>
              <button
                className="prestige-upgrade-button"
                disabled={owned || !canAfford || tierLocked}
                onClick={() => handleBuyUpgrade(upgrade)}
              >
                {owned ? "Owned" : tierLocked ? "Locked" : `${upgrade.cost} WP`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
