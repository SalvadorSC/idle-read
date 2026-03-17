import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import CounterContext from "../../context/CounterContext";
import StatsContext from "../../context/StatsContext";
import PrestigeContext from "../../context/PrestigeContext";
import challengesData from "../../data/timedChallenges.json";
import "./TimedChallenges.css";

export const TimedChallenges = () => {
  const { knCount, setKnCount } = useContext(CounterContext);
  const { clicks } = useContext(StatsContext);
  const { wisdomPoints, setWisdomPoints, totalWisdomEarned, setTotalWisdomEarned } =
    useContext(PrestigeContext);

  // { challengeId: { active, startKn, startClicks, timeLeft, completed, cooldownEnd } }
  const [challengeStates, setChallengeStates] = useState({});
  const intervalRef = useRef(null);

  const getActiveChallenge = () => {
    return Object.entries(challengeStates).find(
      ([, state]) => state.active && !state.completed
    );
  };

  const getCurrentValue = useCallback(
    (challenge, startState) => {
      const goalType = challenge.goal.type;
      switch (goalType) {
        case "generalKn":
          return Math.max(0, knCount.generalKn - startState.startKn.generalKn);
        case "bioKn":
          return Math.max(0, knCount.bioKn - startState.startKn.bioKn);
        case "technoKn":
          return Math.max(0, knCount.technoKn - startState.startKn.technoKn);
        case "cultureKn":
          return Math.max(0, knCount.cultureKn - startState.startKn.cultureKn);
        case "clicks":
          return Math.max(0, clicks - startState.startClicks);
        case "totalKn": {
          const startTotal =
            startState.startKn.generalKn +
            startState.startKn.bioKn +
            startState.startKn.technoKn +
            startState.startKn.cultureKn;
          const currentTotal =
            knCount.generalKn + knCount.bioKn + knCount.technoKn + knCount.cultureKn;
          return Math.max(0, currentTotal - startTotal);
        }
        default:
          return 0;
      }
    },
    [knCount, clicks]
  );

  const startChallenge = (challenge) => {
    if (getActiveChallenge()) return;
    const state = challengeStates[challenge.id];
    if (state && state.cooldownEnd && Date.now() < state.cooldownEnd) return;

    setChallengeStates((prev) => ({
      ...prev,
      [challenge.id]: {
        active: true,
        startKn: { ...knCount },
        startClicks: clicks,
        timeLeft: challenge.duration,
        completed: false,
        failed: false,
        cooldownEnd: 0,
      },
    }));
  };

  // Timer tick
  useEffect(() => {
    const active = getActiveChallenge();
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setChallengeStates((prev) => {
        const updated = { ...prev };
        for (const [id, state] of Object.entries(updated)) {
          if (state.active && !state.completed && !state.failed) {
            const newTimeLeft = state.timeLeft - 1;
            if (newTimeLeft <= 0) {
              const challenge = challengesData.challenges.find((c) => c.id === id);
              updated[id] = {
                ...state,
                timeLeft: 0,
                active: false,
                failed: true,
                cooldownEnd: Date.now() + (challenge ? challenge.cooldown * 1000 : 0),
              };
            } else {
              updated[id] = { ...state, timeLeft: newTimeLeft };
            }
          }
        }
        return updated;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeStates]);

  // Check completion
  useEffect(() => {
    const active = getActiveChallenge();
    if (!active) return;
    const [id, state] = active;
    const challenge = challengesData.challenges.find((c) => c.id === id);
    if (!challenge) return;

    const current = getCurrentValue(challenge, state);
    if (current >= challenge.goal.amount) {
      setChallengeStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], active: false, completed: true },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knCount, clicks]);

  const claimReward = (challenge) => {
    const state = challengeStates[challenge.id];
    if (!state || !state.completed) return;

    if (challenge.reward.type === "kn") {
      setKnCount({
        ...knCount,
        generalKn: knCount.generalKn + (challenge.reward.generalKn || 0),
        bioKn: knCount.bioKn + (challenge.reward.bioKn || 0),
        technoKn: knCount.technoKn + (challenge.reward.technoKn || 0),
        cultureKn: knCount.cultureKn + (challenge.reward.cultureKn || 0),
      });
    } else if (challenge.reward.type === "wp") {
      setWisdomPoints(wisdomPoints + challenge.reward.amount);
      setTotalWisdomEarned(totalWisdomEarned + challenge.reward.amount);
    }

    setChallengeStates((prev) => ({
      ...prev,
      [challenge.id]: {
        ...prev[challenge.id],
        completed: false,
        active: false,
        failed: false,
        cooldownEnd: Date.now() + challenge.cooldown * 1000,
      },
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatReward = (reward) => {
    if (reward.type === "wp") return `+${reward.amount} WP`;
    const parts = [];
    if (reward.generalKn) parts.push(`+${reward.generalKn} kN`);
    if (reward.bioKn) parts.push(`+${reward.bioKn} bioKn`);
    if (reward.technoKn) parts.push(`+${reward.technoKn} technoKn`);
    if (reward.cultureKn) parts.push(`+${reward.cultureKn} cultureKn`);
    return parts.join(", ");
  };

  const getCooldownRemaining = (challengeId) => {
    const state = challengeStates[challengeId];
    if (!state || !state.cooldownEnd) return 0;
    return Math.max(0, Math.ceil((state.cooldownEnd - Date.now()) / 1000));
  };

  const activeEntry = getActiveChallenge();

  return (
    <div className="timed-challenges-panel">
      <h3>Timed Challenges</h3>
      <p className="challenges-subtitle">
        Complete objectives within the time limit to earn bonus rewards.
        Only one challenge can be active at a time.
      </p>

      <div className="challenges-list">
        {challengesData.challenges.map((challenge) => {
          const state = challengeStates[challenge.id];
          const isActive = state && state.active && !state.completed;
          const isCompleted = state && state.completed;
          const isFailed = state && state.failed && !state.completed;
          const cooldown = getCooldownRemaining(challenge.id);
          const onCooldown = cooldown > 0 && !isActive && !isCompleted;
          const anotherActive = activeEntry && activeEntry[0] !== challenge.id;

          let progress = 0;
          if (isActive && state) {
            progress = Math.min(
              1,
              getCurrentValue(challenge, state) / challenge.goal.amount
            );
          }

          return (
            <div
              key={challenge.id}
              className={`challenge-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isFailed ? "failed" : ""} ${onCooldown || anotherActive ? "disabled" : ""}`}
            >
              <div className="challenge-header">
                <span className="challenge-name">{challenge.name}</span>
                <span className="challenge-duration">{formatTime(challenge.duration)}</span>
              </div>
              <p className="challenge-description">{challenge.description}</p>
              <p className="challenge-reward">Reward: {formatReward(challenge.reward)}</p>

              {isActive && state && (
                <div className="challenge-progress-section">
                  <div className="challenge-timer">
                    Time: {formatTime(state.timeLeft)}
                  </div>
                  <div className="challenge-progress-bar">
                    <div
                      className="challenge-progress-fill"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <div className="challenge-progress-text">
                    {Math.floor(getCurrentValue(challenge, state))} / {challenge.goal.amount}
                  </div>
                </div>
              )}

              {isCompleted && (
                <button
                  className="challenge-claim-btn"
                  onClick={() => claimReward(challenge)}
                >
                  Claim Reward
                </button>
              )}

              {isFailed && !onCooldown && (
                <span className="challenge-failed-text">Failed — try again!</span>
              )}

              {onCooldown && (
                <span className="challenge-cooldown-text">
                  Cooldown: {formatTime(cooldown)}
                </span>
              )}

              {!isActive && !isCompleted && !onCooldown && !anotherActive && (
                <button
                  className="challenge-start-btn"
                  onClick={() => startChallenge(challenge)}
                >
                  Start Challenge
                </button>
              )}

              {anotherActive && !isActive && !isCompleted && (
                <span className="challenge-locked-text">Another challenge active</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
