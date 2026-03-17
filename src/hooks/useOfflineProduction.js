import { useState } from "react";
import { useChosenKn } from "./useChosenKn";

export const useOfflineProduction = (
  {
    knCount,
    chosenBook,
    multiplicador,
    setKnCount,
    lastLogin,
    setLastLogin,
    upgrades,
    prestigeUpgrades,
  },
  buffClass
) => {
  const [showBuffer, setShowBuffer] = useState(true);
  const [showGeneratedKnAlert, setShowGeneratedKnAlert] = useState(false);
  const [rewardsTaken, setRewardsTaken] = useState(false);
  const [generatedKn, setGeneratedKn] = useState({
    generatedGnKn: 0,
    generatedBioKn: 0,
    generatedTechnoKn: 0,
    generatedCultureKn: 0,
  });
  const { setChosenBookEffect } = useChosenKn(chosenBook, buffClass, upgrades, prestigeUpgrades);
  const {
    genrlKnCountWithEffects,
    bioKnCountWithEffects,
    technoKnCountWithEffects,
    cultureKnCountWithEffects,
  } = setChosenBookEffect(multiplicador);

  const calculateOfflineProduction = () => {
    const newLogin = Date.now();
    if (showBuffer && lastLogin !== 0) {
      setShowBuffer(false);
      if (newLogin - lastLogin > 60 * 1000 && upgrades.culture.length >= 5) {
        setShowGeneratedKnAlert(true);
        const secondsElapsedSinceLastLogin = (Date.now() - lastLogin) / 1000;
        const getGeneratedKn = (knWithEffects) =>
          Math.floor(knWithEffects * secondsElapsedSinceLastLogin * 0.1 * 100) /
          100;
        setKnCount({
          ...knCount,
          generalKn:
            Math.floor(
              (knCount.generalKn + getGeneratedKn(genrlKnCountWithEffects)) *
                100
            ) / 100,

          bioKn:
            Math.floor(
              (knCount.bioKn + getGeneratedKn(bioKnCountWithEffects)) * 100
            ) / 100,
          technoKn:
            Math.floor(
              (knCount.technoKn + getGeneratedKn(technoKnCountWithEffects)) *
                100
            ) / 100,
          cultureKn:
            Math.floor(
              (knCount.cultureKn + getGeneratedKn(cultureKnCountWithEffects)) *
                100
            ) / 100,
        });
        /* setMaxKn((maxKn) => {
          return {
            generalKn:
              Math.floor(
                (maxKn.generalKn + getGeneratedKn(genrlKnCountWithEffects)) *
                  100
              ) / 100,

            bioKn:
              Math.floor(
                (maxKn.bioKn + getGeneratedKn(bioKnCountWithEffects)) * 100
              ) / 100,
            technoKn:
              Math.floor(
                (maxKn.technoKn + getGeneratedKn(technoKnCountWithEffects)) *
                  100
              ) / 100,
            cultureKn:
              Math.floor(
                (maxKn.cultureKn + getGeneratedKn(cultureKnCountWithEffects)) *
                  100
              ) / 100,
          };
        });
        setTotalKnCountOfThisRun((totalKnCountOfThisRun) => {
          return {
            ...totalKnCountOfThisRun,
            generalKn:
              Math.floor(
                (totalKnCountOfThisRun.generalKn +
                  getGeneratedKn(genrlKnCountWithEffects)) *
                  100
              ) / 100,

            bioKn:
              Math.floor(
                (totalKnCountOfThisRun.bioKn +
                  getGeneratedKn(bioKnCountWithEffects)) *
                  100
              ) / 100,
            technoKn:
              Math.floor(
                (totalKnCountOfThisRun.technoKn +
                  getGeneratedKn(technoKnCountWithEffects)) *
                  100
              ) / 100,
            cultureKn:
              Math.floor(
                (totalKnCountOfThisRun.cultureKn +
                  getGeneratedKn(cultureKnCountWithEffects)) *
                  100
              ) / 100,
          };
        });
        setTotalKnOfAllTime((totalKnOfAllTime) => {
          return {
            ...totalKnOfAllTime,
            generalKn:
              Math.floor(
                (totalKnOfAllTime.generalKn +
                  getGeneratedKn(genrlKnCountWithEffects)) *
                  100
              ) / 100,

            bioKn:
              Math.floor(
                (totalKnOfAllTime.bioKn +
                  getGeneratedKn(bioKnCountWithEffects)) *
                  100
              ) / 100,
            technoKn:
              Math.floor(
                (totalKnOfAllTime.technoKn +
                  getGeneratedKn(technoKnCountWithEffects)) *
                  100
              ) / 100,
            cultureKn:
              Math.floor(
                (totalKnOfAllTime.cultureKn +
                  getGeneratedKn(cultureKnCountWithEffects)) *
                  100
              ) / 100,
          };
        }); */
        setGeneratedKn({
          generatedGnKn: getGeneratedKn(genrlKnCountWithEffects),
          generatedBioKn: getGeneratedKn(bioKnCountWithEffects),
          generatedTechnoKn: getGeneratedKn(technoKnCountWithEffects),
          generatedCultureKn: getGeneratedKn(cultureKnCountWithEffects),
        });
      }
      setLastLogin(0);
    } else if (
      (lastLogin === 0 && !rewardsTaken) ||
      (newLogin - lastLogin < 60 * 1000 && rewardsTaken)
    ) {
      /* setShowGeneratedKnAlert(false); */

      const timer = setTimeout(() => {
        setLastLogin(Date.now());
        setShowBuffer(false);
      }, 1e3);
      return () => clearTimeout(timer);
    }
  };

  return {
    lastLogin,
    showBuffer,
    generatedKn,
    showGeneratedKnAlert,
    setLastLogin,
    setShowBuffer,
    setGeneratedKn,
    setRewardsTaken,
    setShowGeneratedKnAlert,
    calculateOfflineProduction,
  };
};
