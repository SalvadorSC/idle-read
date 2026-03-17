import React, { createContext, useCallback, useMemo, useReducer } from "react";
import { decode } from "base-64";

const PrestigeContext = createContext();

let encodedSave = localStorage.getItem("encodedSave");
let savegame;
if (encodedSave) {
  savegame = JSON.parse(decode(encodedSave));
}

const initialState = {
  wisdomPoints: savegame ? savegame.wisdomPoints || 0 : 0,
  totalWisdomEarned: savegame ? savegame.totalWisdomEarned || 0 : 0,
  prestigeUpgrades: savegame
    ? savegame.prestigeUpgrades || []
    : [],
};

const actions = {
  SET_WISDOM_POINTS: "SET_WISDOM_POINTS",
  SET_TOTAL_WISDOM_EARNED: "SET_TOTAL_WISDOM_EARNED",
  SET_PRESTIGE_UPGRADES: "SET_PRESTIGE_UPGRADES",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.SET_WISDOM_POINTS:
      return { ...state, wisdomPoints: action.value };
    case actions.SET_TOTAL_WISDOM_EARNED:
      return { ...state, totalWisdomEarned: action.value };
    case actions.SET_PRESTIGE_UPGRADES:
      return { ...state, prestigeUpgrades: action.value };
    default:
      return state;
  }
}

export const PrestigeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setWisdomPoints = useCallback((value) => {
    dispatch({ type: actions.SET_WISDOM_POINTS, value });
  }, []);
  const setTotalWisdomEarned = useCallback((value) => {
    dispatch({ type: actions.SET_TOTAL_WISDOM_EARNED, value });
  }, []);
  const setPrestigeUpgrades = useCallback((value) => {
    dispatch({ type: actions.SET_PRESTIGE_UPGRADES, value });
  }, []);

  const value = useMemo(() => ({
    wisdomPoints: state.wisdomPoints,
    totalWisdomEarned: state.totalWisdomEarned,
    prestigeUpgrades: state.prestigeUpgrades,
    setWisdomPoints,
    setTotalWisdomEarned,
    setPrestigeUpgrades,
  }), [state, setWisdomPoints, setTotalWisdomEarned, setPrestigeUpgrades]);

  return (
    <PrestigeContext.Provider value={value}>{children}</PrestigeContext.Provider>
  );
};

export default PrestigeContext;
