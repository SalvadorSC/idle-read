import React, { createContext, useState } from "react";
const CounterContext = createContext();

export const StatsProvider = ({ children }) => {
  let savegame = JSON.parse(localStorage.getItem("save"));
  const [multiplicador, setMultiplicador] = useState(
    savegame ? savegame.multiplicador : 0
  );
  const [automatron1, setAutomatron1] = useState(
    savegame ? savegame.automatron1 : 0
  );
  const [knCount, setKnCount] = useState(
    savegame
      ? savegame.knCount
      : { generalKn: 0, cultureKn: 0, bioKn: 0, technoKn: 0 }
  );
  const [totalKnCountOfThisRun, setTotalKnCountOfThisRun] = useState(
    savegame
      ? savegame.totalKnCountOfThisRun
      : { generalKn: 0, cultureKn: 0, bioKn: 0, technoKn: 0 }
  );
  const [clicks, setClicks] = useState(savegame ? savegame.clicks : 0);
  const [totalClicksOfAllTime, setTotalClicksOfAllTime] = useState(
    savegame ? savegame.totalClicksOfAllTime : 0
  );
  const [totalKnOfAllTime, setTotalKnOfAllTime] = useState(
    savegame
      ? savegame.totalKnOfAllTime
      : {
          generalKn: 0,
          cultureKn: 0,
          bioKn: 0,
          technoKn: 0,
        }
  );
  const [resets, setResets] = useState(savegame ? savegame.resets : 0);
  const [potenciaClick, setPotenciaClick] = useState(
    savegame ? savegame.potenciaClick : 0
  );
  const [knForfeitedAtReset, setKnForfeitedAtReset] = useState(
    savegame
      ? savegame.knForfeitedAtReset
      : {
          generalKn: 0,
          cultureKn: 0,
          bioKn: 0,
          technoKn: 0,
        }
  );
  const [goal, setGoal] = useState(savegame ? savegame.goal : 100);
  const baseUpgrades = {
    multiplicador: [],
    technology: [],
    nature: [],
    culture: [],
  };
  const [upgrades, setUpgrades] = useState(
    savegame ? savegame.upgrades : baseUpgrades
  );
  const [chosenBook, setChosenBook] = useState(
    savegame ? savegame.chosenBook : ""
  );
  const [isPlaying, setIsPlaying] = useState(false);
  let save = {
    multiplicador: multiplicador,
    automatron1: automatron1,
    knCount: knCount,
    totalKnCountOfThisRun: totalKnCountOfThisRun,
    goal: goal,
    clicks: clicks,
    totalClicksOfAllTime: totalClicksOfAllTime,
    totalKnOfAllTime: totalKnOfAllTime,
    knForfeitedAtReset: knForfeitedAtReset,
    resets: resets,
    upgrades: upgrades,
    chosenBook: chosenBook,
    potenciaClick: potenciaClick,
  };
  const [volume, setVolume] = useState(0);

  const resetGame = () => {
    setGoal(100);
    setMultiplicador(0);
    setTotalKnCountOfThisRun({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setKnCount({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setAutomatron1(0);
    setResets(resets + 1);
    setClicks(0);
    setTotalClicksOfAllTime(totalClicksOfAllTime);
    setUpgrades(baseUpgrades);
    setKnForfeitedAtReset({
      ...knForfeitedAtReset,
      generalKn: knForfeitedAtReset.generalKn + knCount.generalKn,
    });
    setChosenBook("");
  };
  const resetAllGame = () => {
    setGoal(100);
    setChosenBook("");
    setMultiplicador(0);
    setTotalKnOfAllTime({
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
    setTotalClicksOfAllTime(0);
    setKnCount({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
    setAutomatron1(0);
    setClicks(0);
    setResets(0);
    setUpgrades(baseUpgrades);
    setKnForfeitedAtReset({
      generalKn: 0,
      cultureKn: 0,
      bioKn: 0,
      technoKn: 0,
    });
  };
  const cheat = () => {
    setKnCount({ ...knCount, generalKn: knCount.generalKn + 100000000 });
    setTotalKnCountOfThisRun({
      ...totalKnCountOfThisRun,
      generalKn: totalKnCountOfThisRun.generalKn + 100000000,
    });
    setTotalKnOfAllTime({
      ...totalKnOfAllTime,
      generalKn: totalKnOfAllTime.generalKn + 100000000,
    });
  };
  return (
    <CounterContext.Provider
      value={{
        goal,
        setGoal,
        knCount,
        setKnCount,
        clicks,
        setClicks,
        chosenBook,
        setChosenBook,
        automatron1,
        setAutomatron1,
        multiplicador,
        setMultiplicador,
        totalKnCountOfThisRun,
        setTotalKnCountOfThisRun,
        totalClicksOfAllTime,
        setTotalClicksOfAllTime,
        totalKnOfAllTime,
        setTotalKnOfAllTime,
        knForfeitedAtReset,
        setKnForfeitedAtReset,
        potenciaClick,
        setPotenciaClick,
        upgrades,
        setUpgrades,
        save,
        resetGame,
        resetAllGame,
        cheat,
        baseUpgrades,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};

export default CounterContext;
