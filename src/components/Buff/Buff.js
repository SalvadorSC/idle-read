import React, { useContext } from "react";
import CounterContext from "../../context/CounterContext";
import MiscContext from "../../context/MiscContext";
import { Tooltip } from "../Tooltip/Tooltip";
import "./Buff.css";
export const Buff = () => {
  const { upgrades } = useContext(CounterContext);
  const { buffMessage, setBuffMessage, buffClass, setBuffClass } =
    useContext(MiscContext);

  const calculateNextBuff = (max, min) => {
    const random =
      Math.random() * (max * 60 * 1000 - min * 60 * 1000) + min * 60 * 1000;
    return random;
  };

  const startBuff = () => {
    const countDownDate = new Date().getTime() + 30 * 1000;
    // Update the count down every 1 second
    const x = setInterval(function () {
      const now = new Date().getTime();
      // Find the distance between now an the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      /* const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ); */
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      setBuffMessage(`${minutes}m ${seconds}s`);
      setBuffClass("active-buff");

      // If the count down is over, write some text
      if (distance <= 0) {
        clearInterval(x);
        setBuffClass("");
        setBuffMessage("Extreme Focus");
        setBuffClass("unactive-buff");
        const nextBuff = calculateNextBuff(10, 3);
        setTimeout(() => {
          setBuffClass("");
        }, nextBuff);
      }
    }, 1000);
  };
  return (
    <>
      {
        <div
          className={
            upgrades.culture.includes("Atomic habits")
              ? `Buff ${buffClass}`
              : `unactive-buff`
          }
        >
          <Tooltip text="3x knowledge for 30s (needs Atomic Habits)" position="top">
            <button
              onClick={() => {
                if (
                  buffMessage === "Extreme Focus" &&
                  buffClass !== "unactive-buff"
                ) {
                  startBuff();
                }
              }}
            >
              {buffMessage}
            </button>
          </Tooltip>
        </div>
      }
    </>
  );
};
