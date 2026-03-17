import React, { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import { useOfflineProduction } from "../hooks/useOfflineProduction";
import { decode } from "base-64";
let encodedSave = localStorage.getItem("encodedSave");
let savegame;
if (encodedSave) {
  savegame = JSON.parse(decode(encodedSave));
}
const CounterContext = createContext();
const baseUpgrades = {
  multiplicador: ["General Culture I"],
  technology: [],
  nature: [],
  culture: [],
};
const initialState = {
  stop: false,
  multiplicador: savegame ? savegame.multiplicador : 1,
  automatron1: savegame ? savegame.automatron1 : 0,
  squirrels: savegame ? savegame.squirrels : 0,
  pageTrees: savegame ? savegame.pageTrees : 0,
  knCount: savegame
    ? savegame.knCount
    : { generalKn: 0, cultureKn: 0, bioKn: 0, technoKn: 0 },
  upgrades: savegame ? savegame.upgrades : baseUpgrades,
  chosenBook: savegame ? savegame.chosenBook : "General Culture I",
  lastLogin: savegame ? savegame.lastLogin : 0,
  bookEnchantments: savegame ? savegame.bookEnchantments || {} : {},
};

const actions = {
  SET_STOP: "SET_STOP",
  SET_MULTIPLICADOR: "SET_MULTIPLICADOR",
  SET_AUTOMATRON1: "SET_AUTOMATRON1",
  SET_SQUIRRELS: "SET_SQUIRRELS",
  SET_PAGETREES: "SET_PAGETREES",
  SET_KNCOUNT: "SET_KNCOUNT",
  SET_UPGRADES: "SET_UPGRADES",
  SET_CHOSENBOOK: "SET_CHOSENBOOK",
  SET_LASTLOGIN: "SET_LASTLOGIN",
  SET_VOLUME: "SET_VOLUME",
  SET_BOOKENCHANTMENTS: "SET_BOOKENCHANTMENTS",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.SET_STOP:
      return { ...state, stop: action.value };
    case actions.SET_MULTIPLICADOR:
      return { ...state, multiplicador: action.value };
    case actions.SET_AUTOMATRON1:
      return { ...state, automatron1: action.value };
    case actions.SET_SQUIRRELS:
      return { ...state, squirrels: action.value };
    case actions.SET_PAGETREES:
      return { ...state, pageTrees: action.value };
    case actions.SET_KNCOUNT:
      return { ...state, knCount: action.value };
    case actions.SET_UPGRADES:
      return { ...state, upgrades: action.value };
    case actions.SET_CHOSENBOOK:
      return { ...state, chosenBook: action.value };
    case actions.SET_LASTLOGIN:
      return { ...state, lastLogin: action.value };
    case actions.SET_VOLUME:
      return { ...state, volume: action.value };
    case actions.SET_BOOKENCHANTMENTS:
      return { ...state, bookEnchantments: action.value };
    default:
      return state;
  }
}
export const CounterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  ///Calculate OFFLINE PRODUCTION
  const dependencies = {
    knCount: state.knCount,
    chosenBook: state.chosenBook,
    multiplicador: state.multiplicador,
    setKnCount: (value) => {
      dispatch({ type: actions.SET_KNCOUNT, value });
    },
    lastLogin: state.lastLogin,
    setLastLogin: (value) => {
      dispatch({ type: actions.SET_LASTLOGIN, value });
    },
    upgrades: state.upgrades,
    prestigeUpgrades: savegame ? savegame.prestigeUpgrades || [] : [],
    bookEnchantments: state.bookEnchantments,
    totalWisdomEarned: savegame ? savegame.totalWisdomEarned || 0 : 0,
  };

  const {
    showBuffer,
    generatedKn,
    showGeneratedKnAlert,
    setShowBuffer,
    setGeneratedKn,
    setRewardsTaken,
    setShowGeneratedKnAlert,
    calculateOfflineProduction,
  } = useOfflineProduction(dependencies);
  useEffect(() => {
    calculateOfflineProduction();
  }, [calculateOfflineProduction]);
  ///

  const setKnCount = useCallback((value) => {
    dispatch({ type: actions.SET_KNCOUNT, value });
  }, []);
  const setStop = useCallback((value) => {
    dispatch({ type: actions.SET_STOP, value });
  }, []);
  const setChosenBook = useCallback((value) => {
    dispatch({ type: actions.SET_CHOSENBOOK, value });
  }, []);
  const setAutomatron1 = useCallback((value) => {
    dispatch({ type: actions.SET_AUTOMATRON1, value });
  }, []);
  const setMultiplicador = useCallback((value) => {
    dispatch({ type: actions.SET_MULTIPLICADOR, value });
  }, []);
  const setVolume = useCallback((value) => {
    dispatch({ type: actions.SET_VOLUME, value });
  }, []);
  const setSquirrels = useCallback((value) => {
    dispatch({ type: actions.SET_SQUIRRELS, value });
  }, []);
  const setPageTrees = useCallback((value) => {
    dispatch({ type: actions.SET_PAGETREES, value });
  }, []);
  const setUpgrades = useCallback((value) => {
    dispatch({ type: actions.SET_UPGRADES, value });
  }, []);
  const setLastLogin = useCallback((value) => {
    dispatch({ type: actions.SET_LASTLOGIN, value });
  }, []);
  const setBookEnchantments = useCallback((value) => {
    dispatch({ type: actions.SET_BOOKENCHANTMENTS, value });
  }, []);

  const value = useMemo(() => ({
    knCount: state.knCount,
    stop: state.stop,
    chosenBook: state.chosenBook,
    automatron1: state.automatron1,
    multiplicador: state.multiplicador,
    volume: state.volume,
    pageTrees: state.pageTrees,
    upgrades: state.upgrades,
    squirrels: state.squirrels,
    lastLogin: state.lastLogin,
    bookEnchantments: state.bookEnchantments,
    setKnCount,
    setStop,
    setChosenBook,
    setAutomatron1,
    setMultiplicador,
    setVolume,
    setSquirrels,
    setPageTrees,
    setUpgrades,
    setLastLogin,
    setBookEnchantments,
    generatedKn,
    setGeneratedKn,
    showBuffer,
    setShowBuffer,
    setShowGeneratedKnAlert,
    showGeneratedKnAlert,
    setRewardsTaken,
    baseUpgrades,
  }), [
    state, generatedKn, setGeneratedKn, showBuffer, setShowBuffer,
    setShowGeneratedKnAlert, showGeneratedKnAlert, setRewardsTaken,
    setKnCount, setStop, setChosenBook, setAutomatron1, setMultiplicador,
    setVolume, setSquirrels, setPageTrees, setUpgrades, setLastLogin,
    setBookEnchantments,
  ]);

  return (
    <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
  );
};

export default CounterContext;
