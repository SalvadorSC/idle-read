import React, { useContext, useState } from "react";
import BookSubmissionsContext from "../../context/BookSubmissionsContext";
import {
  getCurrentPhase,
  PHASES,
  getPhaseEndLabel,
} from "../../utils/weekCycle";
import "./BookSubmissions.css";

export const BookSubmissions = () => {
  const {
    submissions,
    hasSubmitted,
    hasVoted,
    winners,
    submitBook,
    voteBook,
    KN_FIELDS,
  } = useContext(BookSubmissionsContext);

  const phase = getCurrentPhase();
  const phaseLabel = getPhaseEndLabel();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("multiplicador");
  const [generalKn, setGeneralKn] = useState(0.5);
  const [bioKn, setBioKn] = useState(0);
  const [technoKn, setTechnoKn] = useState(0);
  const [cultureKn, setCultureKn] = useState(0);

  const fieldLabels = {
    multiplicador: "General",
    technology: "Technology",
    nature: "Nature",
    culture: "Culture",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const totalKn =
      parseFloat(generalKn) +
      parseFloat(bioKn) +
      parseFloat(technoKn) +
      parseFloat(cultureKn);
    if (totalKn <= 0 || totalKn > 2) return;

    submitBook(title.trim(), description.trim(), field, {
      generalKn: parseFloat(generalKn),
      bioKn: parseFloat(bioKn),
      technoKn: parseFloat(technoKn),
      cultureKn: parseFloat(cultureKn),
    });

    setTitle("");
    setDescription("");
    setGeneralKn(0.5);
    setBioKn(0);
    setTechnoKn(0);
    setCultureKn(0);
  };

  const totalKn =
    parseFloat(generalKn || 0) +
    parseFloat(bioKn || 0) +
    parseFloat(technoKn || 0) +
    parseFloat(cultureKn || 0);

  const sortedSubmissions = [...submissions].sort(
    (a, b) => b.votes - a.votes
  );

  return (
    <div className="book-submissions">
      <div className="submissions-header">
        <h3 className="submissions-title">Community Books</h3>
        <div className="phase-badge">
          <span
            className={`phase-indicator ${
              phase === PHASES.SUBMISSION ? "phase-submit" : "phase-vote"
            }`}
          >
            {phase === PHASES.SUBMISSION
              ? "Submissions Open"
              : "Voting Open"}
          </span>
          <span className="phase-timer">{phaseLabel}</span>
        </div>
      </div>

      {phase === PHASES.SUBMISSION && (
        <div className="submission-section">
          {hasSubmitted ? (
            <div className="already-submitted">
              <p>You've submitted your book for this week!</p>
              <p className="submitted-hint">
                Come back on the weekend to vote.
              </p>
            </div>
          ) : (
            <form className="submission-form" onSubmit={handleSubmit}>
              <h4>Submit a Book</h4>
              <div className="form-field">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your book title..."
                  maxLength={50}
                  required
                />
              </div>
              <div className="form-field">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this book about?"
                  maxLength={200}
                  rows={3}
                  required
                />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                >
                  {KN_FIELDS.map((f) => (
                    <option key={f} value={f}>
                      {fieldLabels[f]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field kn-multipliers">
                <label>
                  kN Multipliers{" "}
                  <span className={totalKn > 2 ? "kn-over" : "kn-budget"}>
                    (Total: {totalKn.toFixed(2)}/2.00)
                  </span>
                </label>
                <div className="kn-inputs">
                  <div className="kn-input-group">
                    <label>
                      <span>kN</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.25"
                      value={generalKn}
                      onChange={(e) => setGeneralKn(e.target.value)}
                    />
                  </div>
                  <div className="kn-input-group">
                    <label>
                      <span className="bioKn">kN</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.25"
                      value={bioKn}
                      onChange={(e) => setBioKn(e.target.value)}
                    />
                  </div>
                  <div className="kn-input-group">
                    <label>
                      <span className="technoKn">kN</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.25"
                      value={technoKn}
                      onChange={(e) => setTechnoKn(e.target.value)}
                    />
                  </div>
                  <div className="kn-input-group">
                    <label>
                      <span className="cultureKn">kN</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.25"
                      value={cultureKn}
                      onChange={(e) => setCultureKn(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="submit-book-btn"
                disabled={!title.trim() || !description.trim() || totalKn <= 0 || totalKn > 2}
              >
                Submit Book
              </button>
            </form>
          )}
        </div>
      )}

      {submissions.length > 0 && (
        <div className="submissions-list">
          <h4>
            {phase === PHASES.VOTING
              ? "Vote for this week's book!"
              : "This week's submissions"}
          </h4>
          {sortedSubmissions.map((sub, index) => (
            <div
              key={sub.id}
              className={`submission-card ${
                index === 0 && sub.votes > 0 ? "leading" : ""
              }`}
            >
              <div className="submission-info">
                <span className="submission-rank">#{index + 1}</span>
                <div className="submission-details">
                  <span className="submission-book-title">{sub.title}</span>
                  <span className="submission-description">
                    {sub.description}
                  </span>
                  <span className="submission-field">
                    {fieldLabels[sub.field]} &middot;{" "}
                    {sub.knMultipliers.generalKn > 0 && (
                      <span>{sub.knMultipliers.generalKn}<span>kN</span> </span>
                    )}
                    {sub.knMultipliers.bioKn > 0 && (
                      <span>{sub.knMultipliers.bioKn}<span className="bioKn">kN</span> </span>
                    )}
                    {sub.knMultipliers.technoKn > 0 && (
                      <span>{sub.knMultipliers.technoKn}<span className="technoKn">kN</span> </span>
                    )}
                    {sub.knMultipliers.cultureKn > 0 && (
                      <span>{sub.knMultipliers.cultureKn}<span className="cultureKn">kN</span> </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="submission-vote-section">
                <span className="vote-count">{sub.votes}</span>
                {phase === PHASES.VOTING && !hasVoted && (
                  <button
                    className="vote-btn"
                    onClick={() => voteBook(sub.id)}
                  >
                    Vote
                  </button>
                )}
              </div>
            </div>
          ))}
          {phase === PHASES.VOTING && hasVoted && (
            <p className="voted-message">
              Thanks for voting! The winner will be available next week.
            </p>
          )}
        </div>
      )}

      {submissions.length === 0 && phase === PHASES.VOTING && (
        <div className="no-submissions">
          <p>No submissions this week. Submit a book next week!</p>
        </div>
      )}

      {winners.length > 0 && (
        <div className="winners-section">
          <h4>Past Winners</h4>
          {winners.map((winner, i) => (
            <div key={i} className="winner-card">
              <span className="winner-trophy">W{i + 1}</span>
              <div className="winner-details">
                <span className="winner-book-title">{winner.title}</span>
                <span className="winner-description">
                  {winner.description}
                </span>
                <span className="winner-week">{winner.weekId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
