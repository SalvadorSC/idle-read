import React, { useContext, useState, useMemo } from "react";
import CounterContext from "../../context/CounterContext";
import enchantmentsData from "../../data/enchantments.json";
import { Tooltip } from "../Tooltip/Tooltip";
import { getOwnedBooks, formatKnReward } from "../../utils/knUtils";
import "./BookEnchantments.css";

export const BookEnchantments = () => {
  const { upgrades, knCount, setKnCount, bookEnchantments, setBookEnchantments } =
    useContext(CounterContext);

  const [selectedBook, setSelectedBook] = useState(null);

  const ownedBooks = useMemo(() => getOwnedBooks(upgrades), [upgrades]);

  const canAfford = (cost) => {
    return (
      knCount.generalKn >= (cost.generalKn || 0) &&
      knCount.bioKn >= (cost.bioKn || 0) &&
      knCount.technoKn >= (cost.technoKn || 0) &&
      knCount.cultureKn >= (cost.cultureKn || 0)
    );
  };

  const applyEnchantment = (enchantment) => {
    if (!selectedBook || !canAfford(enchantment.cost)) return;
    setKnCount({
      ...knCount,
      generalKn: knCount.generalKn - (enchantment.cost.generalKn || 0),
      bioKn: knCount.bioKn - (enchantment.cost.bioKn || 0),
      technoKn: knCount.technoKn - (enchantment.cost.technoKn || 0),
      cultureKn: knCount.cultureKn - (enchantment.cost.cultureKn || 0),
    });
    setBookEnchantments({
      ...bookEnchantments,
      [selectedBook]: enchantment.id,
    });
  };

  const removeEnchantment = (bookName) => {
    const updated = { ...bookEnchantments };
    delete updated[bookName];
    setBookEnchantments(updated);
  };

  const getEnchantmentForBook = (bookName) => {
    const id = bookEnchantments[bookName];
    if (!id) return null;
    return enchantmentsData.enchantments.find((e) => e.id === id);
  };

  const formatCost = (cost) => {
    const parts = [];
    if (cost.generalKn) parts.push(`${cost.generalKn} kN`);
    if (cost.bioKn) parts.push(`${cost.bioKn} bioKn`);
    if (cost.technoKn) parts.push(`${cost.technoKn} technoKn`);
    if (cost.cultureKn) parts.push(`${cost.cultureKn} cultureKn`);
    return parts.join(", ");
  };

  return (
    <div className="enchantments-panel">
      <h3>Book Enchantments</h3>
      <p className="enchantments-subtitle">
        Select a book, then apply an enchantment to boost its power.
      </p>

      <div className="enchantments-book-list">
        <p className="enchantments-label">Your Books</p>
        <div className="enchantments-books">
          {ownedBooks.map((book) => {
            const enchant = getEnchantmentForBook(book);
            const isSelected = selectedBook === book;
            return (
              <div
                key={book}
                className={`enchantment-book-card ${isSelected ? "selected" : ""} ${enchant ? "enchanted" : ""}`}
                onClick={() => setSelectedBook(isSelected ? null : book)}
              >
                <span className="enchantment-book-name">{book}</span>
                {enchant && (
                  <div className="enchantment-active-badge">
                    <span className="enchantment-active-name">{enchant.name}</span>
                    <Tooltip text="Remove enchantment (no refund)" position="top">
                      <button
                        className="enchantment-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEnchantment(book);
                        }}
                      >
                        &times;
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedBook && (
        <div className="enchantments-available">
          <p className="enchantments-label">
            Enchantments for: <span className="enchantments-selected-book">{selectedBook}</span>
          </p>
          <div className="enchantments-list">
            {enchantmentsData.enchantments.map((enchantment) => {
              const isApplied = bookEnchantments[selectedBook] === enchantment.id;
              const affordable = canAfford(enchantment.cost);
              return (
                <div
                  key={enchantment.id}
                  className={`enchantment-item ${isApplied ? "applied" : ""} ${!affordable && !isApplied ? "unaffordable" : ""}`}
                >
                  <div className="enchantment-header">
                    <span className="enchantment-name">{enchantment.name}</span>
                    {isApplied && <span className="enchantment-applied-badge">Active</span>}
                  </div>
                  <p className="enchantment-description">{enchantment.description}</p>
                  <p className="enchantment-cost">Cost: {formatCost(enchantment.cost)}</p>
                  {!isApplied && (
                    <button
                      className="enchantment-apply-btn"
                      disabled={!affordable}
                      onClick={() => applyEnchantment(enchantment)}
                    >
                      {bookEnchantments[selectedBook]
                        ? "Replace Enchantment"
                        : "Apply Enchantment"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
