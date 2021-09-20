import React, { useContext } from "react";
import CounterContext from "../../context/CounterContext";
import { UpgradeItem } from "../UpgradeItem/UpgradeItem";
import upgradesInformation from "../../data/upgradesInfo.json";
import "./NewBooks.css";
export const NewBooks = () => {
  const { upgradesInfo } = upgradesInformation;
  return (
    <>
      <div className="newBooks">
        <h3 className="newBooks-title">New books:</h3>
        <div className="newBooks-container">
          {upgradesInfo.map((upgradeInfo) => (
            <UpgradeItem
              price={upgradeInfo.price}
              field={upgradeInfo.field}
              upgrade={upgradeInfo.upgrade}
              requirementField={upgradeInfo.requirementField}
              requirement={upgradeInfo.requirement}
            />
          ))}
        </div>
        <hr />
      </div>
    </>
  );
};
