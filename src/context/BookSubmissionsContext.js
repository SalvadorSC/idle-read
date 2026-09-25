import React, { createContext, useCallback, useMemo, useReducer, useEffect } from "react";
import { getWeekId } from "../utils/weekCycle";
import { normalizeBookSubmissionsState } from "../utils/bookSubmissionsState";
import {
  KN_FIELDS,
  communityBookKey,
  isBuiltinBookTitle,
  sanitizeField,
  sanitizeKnMultipliers,
} from "../utils/communityBooks";

const BookSubmissionsContext = createContext();

const STORAGE_KEY = "bookSubmissions";
const WEEK_CHECK_MS = 30000;

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore malformed JSON
  }
  return null;
}

function getInitialState() {
  return normalizeBookSubmissionsState(loadFromStorage(), getWeekId());
}

const actions = {
  SUBMIT_BOOK: "SUBMIT_BOOK",
  VOTE_BOOK: "VOTE_BOOK",
  RESET_WEEK: "RESET_WEEK",
};

function createSubmissionId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case actions.SUBMIT_BOOK: {
      if (state.hasSubmitted) return state;
      const title =
        action.value && typeof action.value.title === "string"
          ? action.value.title.trim()
          : "";
      const description =
        action.value && typeof action.value.description === "string"
          ? action.value.description.trim()
          : "";
      const field = sanitizeField(action.value && action.value.field);
      const knMultipliers = sanitizeKnMultipliers(
        action.value && action.value.knMultipliers
      );
      if (!title || title.length > 50 || !description || description.length > 200) {
        return state;
      }
      if (!field || !knMultipliers || isBuiltinBookTitle(title)) return state;
      const newSubmission = {
        id: createSubmissionId(),
        title,
        description,
        field,
        knMultipliers,
        votes: 0,
        submittedAt: Date.now(),
      };
      return {
        ...state,
        submissions: [...state.submissions, newSubmission],
        hasSubmitted: true,
      };
    }
    case actions.VOTE_BOOK: {
      if (state.hasVoted) return state;
      const exists = state.submissions.some((sub) => sub.id === action.value);
      if (!exists) return state;
      const updatedSubmissions = state.submissions.map((sub) =>
        sub.id === action.value ? { ...sub, votes: (Number(sub.votes) || 0) + 1 } : sub
      );
      return {
        ...state,
        submissions: updatedSubmissions,
        hasVoted: true,
      };
    }
    case actions.RESET_WEEK: {
      const nextWeek = action.value || getWeekId();
      if (state.currentWeek === nextWeek) return state;
      return normalizeBookSubmissionsState(state, nextWeek);
    }
    default:
      return state;
  }
}

export const BookSubmissionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Roll the week while the tab stays open, including after the machine sleeps.
  useEffect(() => {
    const rollIfNeeded = () => {
      const currentWeek = getWeekId();
      if (state.currentWeek !== currentWeek) {
        dispatch({ type: actions.RESET_WEEK, value: currentWeek });
      }
    };
    rollIfNeeded();
    const timer = setInterval(rollIfNeeded, WEEK_CHECK_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") rollIfNeeded();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [state.currentWeek]);

  const submitBook = useCallback((title, description, field, knMultipliers) => {
    dispatch({
      type: actions.SUBMIT_BOOK,
      value: { title, description, field, knMultipliers },
    });
  }, []);

  const voteBook = useCallback((submissionId) => {
    dispatch({ type: actions.VOTE_BOOK, value: submissionId });
  }, []);

  const getWinnerBooks = useCallback(() => {
    return state.winners
      .map((winner) => {
        if (!winner || !winner.id || !winner.title) return null;
        const field = sanitizeField(winner.field);
        const knMultipliers = sanitizeKnMultipliers(winner.knMultipliers);
        if (!field || !knMultipliers) return null;
        return {
          price: [0, 0, 0, 0],
          field,
          upgrade: communityBookKey(winner.id),
          title: winner.title,
          description: `[Community Book] ${winner.description || ""}`,
          knMultipliers,
          isCommunityBook: true,
        };
      })
      .filter(Boolean);
  }, [state.winners]);

  const value = useMemo(() => ({
    submissions: state.submissions,
    hasSubmitted: state.hasSubmitted,
    hasVoted: state.hasVoted,
    winners: state.winners,
    currentWeek: state.currentWeek,
    submitBook,
    voteBook,
    getWinnerBooks,
    KN_FIELDS,
  }), [state, submitBook, voteBook, getWinnerBooks]);

  return (
    <BookSubmissionsContext.Provider value={value}>
      {children}
    </BookSubmissionsContext.Provider>
  );
};

export default BookSubmissionsContext;
