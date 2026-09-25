import React, { useContext, useState, useEffect, useMemo } from "react";
import CounterContext from "../../context/CounterContext";
import StatsContext from "../../context/StatsContext";
import { Tooltip } from "../Tooltip/Tooltip";
import { formatKnReward, sumKn } from "../../utils/knUtils";
import achievementsData from "../../data/achievements.json";
import "./Stats.css";

const categoryColors = {
  knowledge: "#e8c547",
  clicks: "#c7c2a9",
  buildings: "turquoise",
  prestige: "violet",
};

function checkCondition(condition, state) {
  switch (condition.type) {
    case "goal":
      return state.goal > condition.value;
    case "clicks":
      return state.clicks >= condition.value;
    case "multiplicador":
      return state.multiplicador >= condition.value;
    case "automatron1":
      return state.automatron1 >= condition.value;
    case "squirrels":
      return state.squirrels >= condition.value;
    case "pageTrees":
      return state.pageTrees >= condition.value;
    case "resets":
      return state.resets >= condition.value;
    case "totalKnAllTime":
      return sumKn(state.totalKnOfAllTime) >= condition.value;
    case "totalClicksAllTime":
      return state.totalClicksAllTime >= condition.value;
    default:
      return false;
  }
}

export const Stats = () => {
  const {
    automatron1,
    multiplicador,
    squirrels,
    pageTrees,
    knCount,
    setKnCount,
  } = useContext(CounterContext);
  const {
    goal,
    totalKnCountOfThisRun,
    clicks,
    resets,
    totalClicksOfAllTime,
    totalKnOfAllTime,
    knForfeitedAtReset,
    unlockedAchievements,
    setUnlockedAchievements,
  } = useContext(StatsContext);

  const [notification, setNotification] = useState(null);

  const totalKnOfThisRun = sumKn(totalKnCountOfThisRun);
  const totalKnOfAllRuns = sumKn(totalKnOfAllTime);

  const state = useMemo(
    () => ({
      goal,
      clicks,
      multiplicador,
      automatron1,
      squirrels,
      pageTrees,
      resets,
      totalKnOfAllTime,
      totalClicksAllTime: totalClicksOfAllTime,
    }),
    [goal, clicks, multiplicador, automatron1, squirrels, pageTrees, resets, totalKnOfAllTime, totalClicksOfAllTime]
  );

  // Find all newly unlockable achievements in one pass and batch-claim them
  useEffect(() => {
    const newlyUnlocked = achievementsData.achievements.filter(
      (a) =>
        !unlockedAchievements.includes(a.id) &&
        checkCondition(a.condition, state)
    );
    if (newlyUnlocked.length === 0) return;

    // Sum all rewards
    let totalReward = { generalKn: 0, bioKn: 0, technoKn: 0, cultureKn: 0 };
    for (const a of newlyUnlocked) {
      totalReward.generalKn += a.reward.generalKn || 0;
      totalReward.bioKn += a.reward.bioKn || 0;
      totalReward.technoKn += a.reward.technoKn || 0;
      totalReward.cultureKn += a.reward.cultureKn || 0;
    }

    // Single state update for kN
    setKnCount({
      ...knCount,
      generalKn: knCount.generalKn + totalReward.generalKn,
      bioKn: knCount.bioKn + totalReward.bioKn,
      technoKn: knCount.technoKn + totalReward.technoKn,
      cultureKn: knCount.cultureKn + totalReward.cultureKn,
    });

    // Single state update for unlocked list
    setUnlockedAchievements([
      ...unlockedAchievements,
      ...newlyUnlocked.map((a) => a.id),
    ]);

    // Show notification for the last one unlocked
    setNotification(newlyUnlocked[newlyUnlocked.length - 1]);
  }, [state, unlockedAchievements, knCount, setKnCount, setUnlockedAchievements]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const unlockedCount = unlockedAchievements.length;

  return (
    <>
      {notification && (
        <div className="achievement-notification">
          <span className="achievement-notification-icon">★</span>
          <div>
            <p className="achievement-notification-title">
              Achievement Unlocked!
            </p>
            <p className="achievement-notification-name">{notification.name}</p>
            <p className="achievement-notification-reward">
              {formatKnReward(notification.reward)}
            </p>
          </div>
        </div>
      )}
      <div className="statistics-section">
        <div className="stats-section">
          <p className="stats-section-title">Statistics</p>
          <div className="stats-container">
            <p>Total clicks of this run: {clicks} clicks</p>
            <p>Total clicks of all time: {totalClicksOfAllTime} clicks</p>
            <p>Total Knowledge of this run: {Math.floor(totalKnOfThisRun * 100) / 100} kN</p>
            <p>Total Knowledge of all time: {Math.floor(totalKnOfAllRuns * 100) / 100} kN</p>
            <p>
              Total kN forfeited by reset: {knForfeitedAtReset.generalKn} kN
            </p>
          </div>
        </div>
        <div className="achievements-section">
          <p className="stats-section-title">
            Achievements ({unlockedCount}/{achievementsData.achievements.length})
          </p>
          <div className="achievement-container">
            {achievementsData.achievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              const color = categoryColors[achievement.category] || "#c7c2a9";
              return (
                <Tooltip
                  key={achievement.id}
                  text={
                    isUnlocked
                      ? `${achievement.description} — ${formatKnReward(achievement.reward)}`
                      : achievement.description
                  }
                  position="top"
                >
                  <p
                    className={`achievement-box ${
                      isUnlocked ? "achievement-unlocked" : "achievement-locked"
                    }`}
                    style={
                      isUnlocked ? { borderColor: color, color: color } : {}
                    }
                  >
                    {isUnlocked ? achievement.name : "???"}
                  </p>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
