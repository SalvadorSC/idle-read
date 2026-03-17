import React, { useContext } from "react";
import { UpgradeItem } from "../UpgradeItem/UpgradeItem";
import upgradesInformation from "../../data/upgradesInfo.json";
import BookSubmissionsContext from "../../context/BookSubmissionsContext";
import "./NewBooks.css";
export const NewBooks = () => {
  const { upgradesInfo } = upgradesInformation;
  const { getWinnerBooks } = useContext(BookSubmissionsContext);
  const communityBooks = getWinnerBooks();
  return (
    <>
      <div className="newBooks">
        <h3 className="newBooks-title">New books:</h3>
        <div className="newBooks-container">
          {upgradesInfo.map((upgradeInfo) => (
            <UpgradeItem
              key={upgradeInfo.upgrade}
              price={upgradeInfo.price}
              field={upgradeInfo.field}
              upgrade={upgradeInfo.upgrade}
              requirementField={upgradeInfo.requirementField}
              requirement={upgradeInfo.requirement}
            />
          ))}
        </div>
        {communityBooks.length > 0 && (
          <>
            <hr />
            <h3 className="newBooks-title">Community books:</h3>
            <div className="newBooks-container">
              {communityBooks.map((book) => (
                <UpgradeItem
                  key={book.upgrade}
                  price={book.price}
                  field={book.field}
                  upgrade={book.upgrade}
                  requirementField={undefined}
                  requirement={undefined}
                  description={book.description}
                  isCommunityBook={true}
                />
              ))}
            </div>
          </>
        )}
        <hr />
      </div>
    </>
  );
};
