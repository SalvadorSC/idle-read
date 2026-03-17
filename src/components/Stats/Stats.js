import React, { useContext, useState, useEffect, useCallback } from "react";
import CounterContext from "../../context/CounterContext";
import StatsContext from "../../context/StatsContext";
import { Tooltip } from "../Tooltip/Tooltip";
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
      return (
        state.totalKnOfAllTime.generalKn +
          state.totalKnOfAllTime.bioKn +
          state.totalKnOfAllTime.technoKn +
          state.totalKnOfAllTime.cultureKn >=
        condition.value
      );
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

  const totalKnOfThisRun =
    totalKnCountOfThisRun.generalKn +
    totalKnCountOfThisRun.bioKn +
    totalKnCountOfThisRun.technoKn +
    totalKnCountOfThisRun.cultureKn;
  const totalKnOfAllRuns =
    totalKnOfAllTime.generalKn +
    totalKnOfAllTime.bioKn +
    totalKnOfAllTime.technoKn +
    totalKnOfAllTime.cultureKn;

  const state = {
    goal,
    clicks,
    multiplicador,
    automatron1,
    squirrels,
    pageTrees,
    resets,
    totalKnOfAllTime,
    totalClicksAllTime: totalClicksOfAllTime,
  };

  const claimReward = useCallback(
    (achievement) => {
      if (unlockedAchievements.includes(achievement.id)) return;
      const reward = achievement.reward;
      setKnCount({
        ...knCount,
        generalKn: knCount.generalKn + (reward.generalKn || 0),
        bioKn: knCount.bioKn + (reward.bioKn || 0),
        technoKn: knCount.technoKn + (reward.technoKn || 0),
        cultureKn: knCount.cultureKn + (reward.cultureKn || 0),
      });
      setUnlockedAchievements([...unlockedAchievements, achievement.id]);
      setNotification(achievement);
    },
    [knCount, setKnCount, unlockedAchievements, setUnlockedAchievements]
  );

  // Auto-claim newly unlocked achievements
  useEffect(() => {
    achievementsData.achievements.forEach((achievement) => {
      if (
        !unlockedAchievements.includes(achievement.id) &&
        checkCondition(achievement.condition, state)
      ) {
        claimReward(achievement);
      }
    });
  });

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const unlockedCount = achievementsData.achievements.filter((a) =>
    unlockedAchievements.includes(a.id)
  ).length;

  const formatReward = (reward) => {
    const parts = [];
    if (reward.generalKn) parts.push(`+${reward.generalKn} kN`);
    if (reward.bioKn) parts.push(`+${reward.bioKn} bioKn`);
    if (reward.technoKn) parts.push(`+${reward.technoKn} technoKn`);
    if (reward.cultureKn) parts.push(`+${reward.cultureKn} cultureKn`);
    return parts.join(", ");
  };

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
              {formatReward(notification.reward)}
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
                      ? `${achievement.description} — ${formatReward(achievement.reward)}`
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
