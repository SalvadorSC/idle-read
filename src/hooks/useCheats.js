import { useContext } from "react";
import CounterContext from "../context/CounterContext";
import StatsContext from "../context/StatsContext";
import PrestigeContext from "../context/PrestigeContext";

export const useCheats = () => {
  const {
    setMultiplicador,
    setKnCount,
    setAutomatron1,
    setSquirrels,
    knCount,
    setChosenBook,
    setPageTrees,
    setUpgrades,
    baseUpgrades,
  } = useContext(CounterContext);
  const {
    setGoal,
    resets,
    setResets,
    setClicks,
    setTotalClicksOfAllTime,
    totalClicksOfAllTime,
    setKnForfeitedAtReset,
    knForfeitedAtReset,
    setTotalKnOfAllTime,
    totalKnCountOfThisRun,
    totalKnOfAllTime,
    setMaxKn,
    setPotenciaClick,
    setTotalKnCountOfThisRun,
    setUnlockedAchievements,
  } = useContext(StatsContext);
  const {
    setWisdomPoints,
    setTotalWisdomEarned,
    setPrestigeUpgrades,
  } = useContext(PrestigeContext);
  const resetGame = () => {
    setGoal(100);
    setMultiplicador(1);
    setKnCount({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setTotalKnCountOfThisRun({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setMaxKn({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setPotenciaClick(0);
    setAutomatron1(0);
    setSquirrels(0);
    setPageTrees(0);
    setResets(resets + 1);
    setClicks(0);
    setTotalClicksOfAllTime(totalClicksOfAllTime);
    setUpgrades(baseUpgrades);
    setKnForfeitedAtReset({
      ...knForfeitedAtReset,
      generalKn: knForfeitedAtReset.generalKn + knCount.generalKn,
    });
    setChosenBook("General Culture I");
  };
  const resetAllGame = () => {
    setGoal(100);
    setChosenBook("General Culture I");
    setMultiplicador(1);
    setTotalKnOfAllTime({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setMaxKn({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setPotenciaClick(0);
    setTotalKnCountOfThisRun({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setTotalClicksOfAllTime(0);
    setKnCount({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setAutomatron1(0);
    setSquirrels(0);
    setClicks(0);
    setResets(0);
    setUpgrades(baseUpgrades);
    setKnForfeitedAtReset({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setPageTrees(0);
    setWisdomPoints(0);
    setTotalWisdomEarned(0);
    setPrestigeUpgrades([]);
    setUnlockedAchievements([]);
  };
  const cheat = () => {
    setKnCount({
      ...knCount,
      generalKn: knCount.generalKn + 100000000,
      bioKn: knCount.bioKn + 100000000,
      technoKn: knCount.technoKn + 100000000,
      cultureKn: knCount.cultureKn + 100000000,
    });
    setTotalKnCountOfThisRun({
      ...totalKnCountOfThisRun,
      generalKn: totalKnCountOfThisRun.generalKn + 100000000,
      bioKn: totalKnCountOfThisRun.bioKn + 100000000,
      technoKn: totalKnCountOfThisRun.technoKn + 100000000,
      cultureKn: totalKnCountOfThisRun.cultureKn + 100000000,
    });
    setTotalKnOfAllTime({
      ...totalKnOfAllTime,
      generalKn: totalKnOfAllTime.generalKn + 100000000,
      bioKn: totalKnOfAllTime.bioKn + 100000000,
      technoKn: totalKnOfAllTime.technoKn + 100000000,
      cultureKn: totalKnOfAllTime.cultureKn + 100000000,
    });
  };

  return {
    cheat,
    resetGame,
    resetAllGame,
  };
};
