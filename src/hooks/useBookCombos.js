import { useMemo } from "react";
import bookCombosData from "../data/bookCombos.json";

export const useBookCombos = (upgrades) => {
  const ownedBooks = useMemo(() => {
    if (!upgrades) return [];
    const allBooks = [
      ...(upgrades.multiplicador || []),
      ...(upgrades.technology || []),
      ...(upgrades.nature || []),
      ...(upgrades.culture || []),
    ];
    return allBooks;
  }, [upgrades]);

  const activeCombos = useMemo(() => {
    return bookCombosData.bookCombos.filter((combo) => {
      if (combo.requiredBookCount) {
        return ownedBooks.length >= combo.requiredBookCount;
      }
      return combo.requiredBooks.every((book) => ownedBooks.includes(book));
    });
  }, [ownedBooks]);

  const comboMultipliers = useMemo(() => {
    const multipliers = {
      generalKn: 1,
      bioKn: 1,
      technoKn: 1,
      cultureKn: 1,
    };

    activeCombos.forEach((combo) => {
      multipliers.generalKn *= combo.bonusMultipliers.generalKn;
      multipliers.bioKn *= combo.bonusMultipliers.bioKn;
      multipliers.technoKn *= combo.bonusMultipliers.technoKn;
      multipliers.cultureKn *= combo.bonusMultipliers.cultureKn;
    });

    return multipliers;
  }, [activeCombos]);

  return {
    activeCombos,
    allCombos: bookCombosData.bookCombos,
    comboMultipliers,
    ownedBooks,
  };
};
