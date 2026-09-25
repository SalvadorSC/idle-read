import React, { useContext } from "react";
import CounterContext from "../../context/CounterContext";
import { useBookCombos } from "../../hooks/useBookCombos";
import "./BookCombos.css";

const bonusLabel = (multipliers) => {
  const parts = [];
  if (multipliers.generalKn > 1)
    parts.push(`${multipliers.generalKn}x generalKn`);
  if (multipliers.bioKn > 1) parts.push(`${multipliers.bioKn}x bioKn`);
  if (multipliers.technoKn > 1)
    parts.push(`${multipliers.technoKn}x technoKn`);
  if (multipliers.cultureKn > 1)
    parts.push(`${multipliers.cultureKn}x cultureKn`);
  return parts.join(", ");
};

export const BookCombos = () => {
  const { upgrades } = useContext(CounterContext);
  const { activeCombos, allCombos, ownedBooks } = useBookCombos(upgrades);

  const activeIds = activeCombos.map((c) => c.id);

  return (
    <div className="book-combos-panel">
      <h3>Book Combos & Synergies</h3>
      <div className="book-combos-list">
        {allCombos.map((combo) => {
          const isActive = activeIds.includes(combo.id);
          const ownedCount = combo.requiredBookCount
            ? ownedBooks.length
            : combo.requiredBooks.filter((b) => ownedBooks.includes(b)).length;
          const totalRequired = combo.requiredBookCount
            ? combo.requiredBookCount
            : combo.requiredBooks.length;

          return (
            <div
              key={combo.id}
              className={`book-combo-item ${isActive ? "active" : "inactive"}`}
            >
              <div className="combo-header">
                <span className={`combo-name ${isActive ? "active" : ""}`}>
                  {combo.name}
                </span>
                <span className={`combo-badge ${isActive ? "active" : "inactive"}`}>
                  {isActive ? "Active" : "Locked"}
                </span>
              </div>
              <div className="combo-description">{combo.description}</div>
              <div className="combo-bonus">
                Bonus: {bonusLabel(combo.bonusMultipliers)}
              </div>
              {!isActive && (
                <div className="combo-progress">
                  Progress: {ownedCount}/{totalRequired} books
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
