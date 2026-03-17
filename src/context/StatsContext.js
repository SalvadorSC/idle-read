import React, { createContext, useReducer } from "react";
import { decode } from "base-64";

const StatsContext = createContext();

let encodedSave = localStorage.getItem("encodedSave");
let savegame;
if (encodedSave) {
  savegame = JSON.parse(decode(encodedSave));
}

const initialState = {
  totalKnCountOfThisRun: savegame
    ? savegame.totalKnCountOfThisRun
    : { generalKn: 0, cultureKn: 0, bioKn: 0, technoKn: 0 },
  clicks: savegame ? savegame.clicks : 0,
  totalClicksOfAllTime: savegame ? savegame.totalClicksOfAllTime : 0,
  totalKnOfAllTime: savegame
    ? savegame.totalKnOfAllTime
    : {
        generalKn: 0,
        cultureKn: 0,
        bioKn: 0,
        technoKn: 0,
      },
  resets: savegame ? savegame.resets : 0,
  potenciaClick: savegame ? savegame.potenciaClick : 0,
  knForfeitedAtReset: savegame
    ? savegame.knForfeitedAtReset
    : {
        generalKn: 0,
        cultureKn: 0,
        bioKn: 0,
        technoKn: 0,
      },
  maxKn: savegame
    ? savegame.maxKn
    : {
        generalKn: 0,
        cultureKn: 0,
        bioKn: 0,
        technoKn: 0,
      },
  goal: savegame ? savegame.goal : 100,
  unlockedAchievements: savegame ? savegame.unlockedAchievements || [] : [],
};

const actions = {
  SET_CLICKS: "SET_CLICKS",
  SET_TOTALCLICKSOFALLTIME: "SET_TOTALCLICKSOFALLTIME",
  SET_TOTALKNCOUNTOFTHISRUN: "SET_TOTALKNCOUNTOFTHISRUN",
  SET_TOTALKNOFALLTIME: "SET_TOTALKNOFALLTIME",
  SET_RESETS: "SET_RESETS",
  SET_POTENCIACLICK: "SET_POTENCIACLICK",
  SET_KNFORFEITEDATRESET: "SET_KNFORFEITEDATRESET",
  SET_MAXKN: "SET_MAXKN",
  SET_GOAL: "SET_GOAL",
  SET_UNLOCKED_ACHIEVEMENTS: "SET_UNLOCKED_ACHIEVEMENTS",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.SET_CLICKS:
      return { ...state, clicks: action.value };
    case actions.SET_TOTALCLICKSOFALLTIME:
      return { ...state, totalClicksOfAllTime: action.value };
    case actions.SET_TOTALKNCOUNTOFTHISRUN:
      return { ...state, totalKnCountOfThisRun: action.value };
    case actions.SET_TOTALKNOFALLTIME:
      return { ...state, totalKnOfAllTime: action.value };
    case actions.SET_RESETS:
      return { ...state, resets: action.value };
    case actions.SET_KNFORFEITEDATRESET:
      return { ...state, knForfeitedAtReset: action.value };
    case actions.SET_MAXKN:
      return { ...state, maxKn: action.value };
    case actions.SET_POTENCIACLICK:
      return { ...state, potenciaClick: action.value };
    case actions.SET_GOAL:
      return { ...state, goal: action.value };
    case actions.SET_UNLOCKED_ACHIEVEMENTS:
      return { ...state, unlockedAchievements: action.value };
    default:
      return state;
  }
}
export const StatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    goal: state.goal,
    clicks: state.clicks,
    totalKnCountOfThisRun: state.totalKnCountOfThisRun,
    totalClicksOfAllTime: state.totalClicksOfAllTime,
    totalKnOfAllTime: state.totalKnOfAllTime,
    knForfeitedAtReset: state.knForfeitedAtReset,
    potenciaClick: state.potenciaClick,
    resets: state.resets,
    maxKn: state.maxKn,
    unlockedAchievements: state.unlockedAchievements,
    setUnlockedAchievements: (value) => {
      dispatch({ type: actions.SET_UNLOCKED_ACHIEVEMENTS, value });
    },
    setGoal: (value) => {
      dispatch({ type: actions.SET_GOAL, value });
    },
    setClicks: (value) => {
      dispatch({ type: actions.SET_CLICKS, value });
    },
    setTotalKnCountOfThisRun: (value) => {
      dispatch({ type: actions.SET_TOTALKNCOUNTOFTHISRUN, value });
    },
    setTotalClicksOfAllTime: (value) => {
      dispatch({ type: actions.SET_TOTALCLICKSOFALLTIME, value });
    },
    setTotalKnOfAllTime: (value) => {
      dispatch({ type: actions.SET_TOTALKNOFALLTIME, value });
    },
    setKnForfeitedAtReset: (value) => {
      dispatch({ type: actions.SET_KNFORFEITEDATRESET, value });
    },
    setPotenciaClick: (value) => {
      dispatch({ type: actions.SET_POTENCIACLICK, value });
    },
    setResets: (value) => {
      dispatch({ type: actions.SET_RESETS, value });
    },
    setMaxKn: (value) => {
      dispatch({ type: actions.SET_MAXKN, value });
    },
  };

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
};

export default StatsContext;
