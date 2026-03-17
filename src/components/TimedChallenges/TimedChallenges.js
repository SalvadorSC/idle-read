import React, { useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import CounterContext from "../../context/CounterContext";
import StatsContext from "../../context/StatsContext";
import PrestigeContext from "../../context/PrestigeContext";
import { formatKnReward, sumKn } from "../../utils/knUtils";
import challengesData from "../../data/timedChallenges.json";
import "./TimedChallenges.css";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const TimedChallenges = () => {
  const { knCount, setKnCount } = useContext(CounterContext);
  const { clicks } = useContext(StatsContext);
  const { wisdomPoints, setWisdomPoints, totalWisdomEarned, setTotalWisdomEarned } =
    useContext(PrestigeContext);

  const [challengeStates, setChallengeStates] = useState({});
  const intervalRef = useRef(null);

  const hasActive = useMemo(
    () =>
      Object.values(challengeStates).some(
        (s) => s.active && !s.completed && !s.failed
      ),
    [challengeStates]
  );

  const activeEntry = useMemo(() => {
    const entry = Object.entries(challengeStates).find(
      ([, s]) => s.active && !s.completed
    );
    return entry || null;
  }, [challengeStates]);

  const getCurrentValue = useCallback(
    (challenge, startState) => {
      switch (challenge.goal.type) {
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
        case "totalKn":
          return Math.max(0, sumKn(knCount) - sumKn(startState.startKn));
        default:
          return 0;
      }
    },
    [knCount, clicks]
  );

  const startChallenge = (challenge) => {
    if (activeEntry) return;
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

  // Timer tick — only depends on hasActive boolean, not the full state object
  useEffect(() => {
    if (!hasActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Don't create a new interval if one already exists
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setChallengeStates((prev) => {
        let changed = false;
        const updated = { ...prev };
        for (const [id, state] of Object.entries(updated)) {
          if (state.active && !state.completed && !state.failed) {
            changed = true;
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
        return changed ? updated : prev;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [hasActive]);

  // Check completion
  useEffect(() => {
    if (!activeEntry) return;
    const [id, state] = activeEntry;
    const challenge = challengesData.challenges.find((c) => c.id === id);
    if (!challenge) return;

    const current = getCurrentValue(challenge, state);
    if (current >= challenge.goal.amount) {
      setChallengeStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], active: false, completed: true },
      }));
    }
  }, [activeEntry, getCurrentValue]);

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

  const getCooldownRemaining = (challengeId) => {
    const state = challengeStates[challengeId];
    if (!state || !state.cooldownEnd) return 0;
    return Math.max(0, Math.ceil((state.cooldownEnd - Date.now()) / 1000));
  };

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
              <p className="challenge-reward">Reward: {formatKnReward(challenge.reward)}</p>

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
