import React, { createContext, useReducer, useEffect } from "react";
import { getWeekId } from "../utils/weekCycle";

const BookSubmissionsContext = createContext();

const STORAGE_KEY = "bookSubmissions";

const KN_FIELDS = ["multiplicador", "technology", "nature", "culture"];

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore
  }
  return null;
}

function getInitialState() {
  const saved = loadFromStorage();
  const currentWeek = getWeekId();

  if (saved && saved.currentWeek === currentWeek) {
    return saved;
  }

  // New week: archive last week's winner if any, reset submissions
  const prevWinners = saved ? saved.winners || [] : [];
  let newWinners = [...prevWinners];

  if (saved && saved.currentWeek !== currentWeek && saved.submissions.length > 0) {
    // Find the winner from last week's submissions
    const sorted = [...saved.submissions].sort((a, b) => b.votes - a.votes);
    if (sorted[0] && sorted[0].votes > 0) {
      newWinners.push({
        ...sorted[0],
        weekId: saved.currentWeek,
        wonAt: Date.now(),
      });
    }
  }

  return {
    currentWeek,
    submissions: [],
    hasSubmitted: false,
    hasVoted: false,
    winners: newWinners,
  };
}

const actions = {
  SUBMIT_BOOK: "SUBMIT_BOOK",
  VOTE_BOOK: "VOTE_BOOK",
  RESET_WEEK: "RESET_WEEK",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.SUBMIT_BOOK: {
      const newSubmission = {
        id: Date.now().toString(),
        title: action.value.title,
        description: action.value.description,
        field: action.value.field,
        knMultipliers: action.value.knMultipliers,
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
      const updatedSubmissions = state.submissions.map((sub) =>
        sub.id === action.value ? { ...sub, votes: sub.votes + 1 } : sub
      );
      return {
        ...state,
        submissions: updatedSubmissions,
        hasVoted: true,
      };
    }
    case actions.RESET_WEEK: {
      return getInitialState();
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

  // Check if week rolled over
  useEffect(() => {
    const currentWeek = getWeekId();
    if (state.currentWeek !== currentWeek) {
      dispatch({ type: actions.RESET_WEEK });
    }
  }, [state.currentWeek]);

  const submitBook = (title, description, field, knMultipliers) => {
    dispatch({
      type: actions.SUBMIT_BOOK,
      value: { title, description, field, knMultipliers },
    });
  };

  const voteBook = (submissionId) => {
    dispatch({ type: actions.VOTE_BOOK, value: submissionId });
  };

  const getWinnerBooks = () => {
    return state.winners.map((winner) => ({
      price: [0, 0, 0, 0],
      field: winner.field,
      upgrade: winner.title,
      description: `[Community Book] ${winner.description}`,
      knMultipliers: winner.knMultipliers,
      isCommunityBook: true,
    }));
  };

  const value = {
    submissions: state.submissions,
    hasSubmitted: state.hasSubmitted,
    hasVoted: state.hasVoted,
    winners: state.winners,
    currentWeek: state.currentWeek,
    submitBook,
    voteBook,
    getWinnerBooks,
    KN_FIELDS,
  };

  return (
    <BookSubmissionsContext.Provider value={value}>
      {children}
    </BookSubmissionsContext.Provider>
  );
};

export default BookSubmissionsContext;
