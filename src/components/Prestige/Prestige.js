import React, { useContext } from "react";
import StatsContext from "../../context/StatsContext";
import PrestigeContext from "../../context/PrestigeContext";
import { useCheats } from "../../hooks/useCheats";
import prestigeData from "../../data/prestigeUpgrades.json";
import { Tooltip } from "../Tooltip/Tooltip";
import "./Prestige.css";

export const Prestige = () => {
  const { totalKnCountOfThisRun } = useContext(StatsContext);
  const {
    wisdomPoints,
    setWisdomPoints,
    totalWisdomEarned,
    setTotalWisdomEarned,
    prestigeUpgrades,
    setPrestigeUpgrades,
  } = useContext(PrestigeContext);
  const { resetGame } = useCheats();

  const totalKnThisRun =
    totalKnCountOfThisRun.generalKn +
    totalKnCountOfThisRun.bioKn +
    totalKnCountOfThisRun.technoKn +
    totalKnCountOfThisRun.cultureKn;

  const calcWisdomGain = () => {
    if (totalKnThisRun < 1000) return 0;
    return Math.floor(Math.sqrt(totalKnThisRun / 1000));
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
    setWisdomPoints(wisdomPoints - upgrade.cost);
    setPrestigeUpgrades([...prestigeUpgrades, upgrade.id]);
  };

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
          Formula: floor(sqrt(totalKn / 1000))
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
          return (
            <div
              key={upgrade.id}
              className={`prestige-upgrade-item ${
                owned ? "prestige-owned" : ""
              }`}
            >
              <div className="prestige-upgrade-info">
                <span className="prestige-upgrade-name">{upgrade.name}</span>
                <span className="prestige-upgrade-desc">
                  {upgrade.description}
                </span>
              </div>
              <button
                className="prestige-upgrade-button"
                disabled={owned || !canAfford}
                onClick={() => handleBuyUpgrade(upgrade)}
              >
                {owned ? "Owned" : `${upgrade.cost} WP`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
