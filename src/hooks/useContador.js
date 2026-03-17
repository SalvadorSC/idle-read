import useSound from "use-sound";
import { useChosenKn } from "./useChosenKn";
import soundUrl1 from "../assets/page-flip-01a.mp3";
import soundUrl2 from "../assets/page-flip-03.mp3";
import { useContext } from "react";
import StatsContext from "../context/StatsContext";
import PrestigeContext from "../context/PrestigeContext";

export const useContador = (
  {
    knCount,
    setKnCount,
    automatron1,
    multiplicador,
    mute,
    squirrels,
    chosenBook,
    pageTrees,
    upgrades,
    bookEnchantments,
  },
  buffClass
) => {
  const {
    goal,
    setGoal,
    totalKnOfAllTime,
    setTotalKnOfAllTime,
    totalKnCountOfThisRun,
    setTotalKnCountOfThisRun,
    maxKn,
    setMaxKn,
  } = useContext(StatsContext);
  const { prestigeUpgrades, totalWisdomEarned } = useContext(PrestigeContext);
  const sounds = [soundUrl1, soundUrl2];
  const [play] = useSound(sounds[1], { volume: mute ? 0 : 0.05 });
  const { setChosenBookEffect } = useChosenKn(chosenBook, buffClass, upgrades, prestigeUpgrades, bookEnchantments, totalWisdomEarned);
  const incrementEverySecond = () => {
    const totalKnOfThisRun =
      totalKnCountOfThisRun.generalKn +
      totalKnCountOfThisRun.bioKn +
      totalKnCountOfThisRun.technoKn +
      totalKnCountOfThisRun.cultureKn;
    setMaxKn({
      generalKn:
        maxKn.generalKn < knCount.generalKn
          ? knCount.generalKn
          : maxKn.generalKn,
      cultureKn:
        maxKn.cultureKn < knCount.cultureKn
          ? knCount.cultureKn
          : maxKn.cultureKn,
      bioKn: maxKn.bioKn < knCount.bioKn ? knCount.bioKn : maxKn.bioKn,
      technoKn:
        maxKn.technoKn < knCount.technoKn ? knCount.technoKn : maxKn.technoKn,
    });
    const {
      genrlKnCountWithEffects,
      technoKnCountWithEffects,
    } = setChosenBookEffect(automatron1);
    const {
      genrlKnCountWithEffects: genrlKnCountWithSquirrelEffects,
      bioKnCountWithEffects,
    } = setChosenBookEffect(squirrels);
    const {
      bioKnCountWithEffects: bioKnCountWithPageTreeEffects,
      technoKnCountWithEffects: technoKnCountWithPageTreeEffects,
    } = setChosenBookEffect(pageTrees);
    // Compute deltas once
    const deltaGeneral =
      Math.floor(
        (genrlKnCountWithEffects + genrlKnCountWithSquirrelEffects) * 100
      ) / 100;
    const deltaBio =
      Math.floor(
        (bioKnCountWithEffects + bioKnCountWithPageTreeEffects * 2) * 100
      ) / 100;
    const deltaTechno =
      Math.floor(
        (technoKnCountWithEffects + technoKnCountWithPageTreeEffects * 2) * 100
      ) / 100;

    setKnCount({
      ...knCount,
      generalKn: knCount.generalKn + deltaGeneral,
      bioKn: knCount.bioKn + deltaBio,
      technoKn: knCount.technoKn + deltaTechno,
    });
    setTotalKnCountOfThisRun({
      ...totalKnCountOfThisRun,
      generalKn: totalKnCountOfThisRun.generalKn + deltaGeneral,
      bioKn: totalKnCountOfThisRun.bioKn + deltaBio,
      technoKn: totalKnCountOfThisRun.technoKn + deltaTechno,
    });
    setTotalKnOfAllTime({
      ...totalKnOfAllTime,
      generalKn: totalKnOfAllTime.generalKn + deltaGeneral,
      bioKn: totalKnOfAllTime.bioKn + deltaBio,
      technoKn: totalKnOfAllTime.technoKn + deltaTechno,
    });

    // Update Progress Bar
    if (totalKnOfThisRun >= goal) {
      setGoal(goal * 10);
    }
    // Sound Effect
    play();
  };

  return {
    knCount,
    automatron1,
    multiplicador,
    incrementEverySecond,
  };
};
