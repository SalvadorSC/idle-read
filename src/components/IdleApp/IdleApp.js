import React, { useContext, useState } from "react";
import { Link, Route } from "react-router-dom";
import { Options } from "../Options/Options";
import { Shop } from "../Shop/Shop";
import { Stats } from "../Stats/Stats";
import CounterContext from "../../context/CounterContext";
import { useNumberParsing } from "../../hooks/useNumberParsing";
import "./IdleApp.css";
import BoopButton from "../BoopButton/BoopButton";
import { useIncrementByClick } from "../../hooks/useIncrementByClick";
import { Shelf } from "../Shelf/Shelf";
import soundUrl from "../../assets/page-flip-01a.mp3";
import useSound from "use-sound";
import buffer from "../../assets/Infinity.svg";
import personajeOneLoop from "../../assets/lecteur-oneloop-3-silla.gif";
import StatsContext from "../../context/StatsContext";
import MiscContext from "../../context/MiscContext";
import { Buff } from "../Buff/Buff";
import { useChosenKn } from "../../hooks/useChosenKn";
import { ReactFlowProvider } from "reactflow";
import { BookSubmissions } from "../BookSubmissions/BookSubmissions";
const IdleApp = () => {
  const dependencies = useContext(CounterContext);
  const statDependencies = useContext(StatsContext);
  const { setShowGeneratedKnAlert, setRewardsTaken } =
    useContext(CounterContext);
  const { mute, setMute } = useContext(MiscContext);
  const [play] = useSound(soundUrl, { volume: mute ? 0 : 0.1 });
  const { increment } = useIncrementByClick(dependencies);
  const { parseNumber } = useNumberParsing();
  const { setChosenBookEffect } = useChosenKn(
    dependencies.chosenBook,
    dependencies.buffClass,
    dependencies.upgrades
  );
  const is_mobile =
    !!navigator.userAgent.match(/iphone|android|blackberry/gi) || false;
  const [showPrimaryView, setShowPrimaryView] = useState(is_mobile);
  const resetAnimation = () => {
    const characterGif = document.querySelector(
      !showPrimaryView ? ".character" : ".character-cc"
    );
    if (
      !dependencies.automatron1 ||
      !dependencies.squirrels ||
      !dependencies.pageTrees
    ) {
      characterGif.src = personajeOneLoop;
      // eslint-disable-next-line no-self-assign
      characterGif.src = characterGif.src;
    } else {
      // eslint-disable-next-line no-self-assign
      characterGif.src = characterGif.src;
    }
  };
  const handleClick = () => {
    increment(dependencies.upgrades);
    resetAnimation();
    //Sound Effect
    play();
  };

  const {
    genrlKnCountWithEffects,
    bioKnCountWithEffects,
    technoKnCountWithEffects,
    cultureKnCountWithEffects,
  } = setChosenBookEffect(dependencies.multiplicador);

  return (
    <div className="contador">
      {dependencies.showBuffer && (
        <div className="buffer">
          <img src={buffer} alt="loading infinite loop gif" />
        </div>
      )}
      {dependencies.showGeneratedKnAlert && (
        <div className="buffer">
          <p className="generatedKn-p">
            You have gained {dependencies.generatedKn.generatedGnKn}
            kN, {dependencies.generatedKn.generatedBioKn}
            <span className="bioKn">kN</span>,{" "}
            {dependencies.generatedKn.generatedTechnoKn}
            <span className="technoKn">kN</span> and{" "}
            {dependencies.generatedKn.generatedCultureKn}
            <span className="cultureKn">kN</span>, while lucid dreaming.
            <button
              className="generatedKn-button"
              onClick={() => {
                setShowGeneratedKnAlert(false);
                setRewardsTaken(true);
              }}
            >
              &times;
            </button>
          </p>
        </div>
      )}

      {showPrimaryView ? (
        <>
          <div className="first-half">
            <div className="header">
              <form className="music-div">
                <label className="music-tag">Music</label>
                {BoopButton()}
              </form>

              {!is_mobile && (
                <button
                  className="view-button"
                  onClick={() => setShowPrimaryView(!showPrimaryView)}
                >
                  Change View
                </button>
              )}
              <button className="mute-button" onClick={() => setMute(!mute)}>
                {mute ? "Unmute" : "Mute"}
              </button>
            </div>

            <div className="display-stats">
              <p>
                Goal:
                <br />
                {parseNumber(statDependencies.goal)} kN
              </p>

              <p>
                Progress:
                <br />
                {Math.floor(
                  (statDependencies.totalKnCountOfThisRun.generalKn /
                    statDependencies.goal) *
                    100 *
                    100
                ) / 100}
                %
              </p>
              {/* <p>Total: {parseNumber(Math.floor(totalKn * 100) / 100)} kN</p> */}
            </div>
            <div
              unselectable="on"
              onClick={handleClick}
              className="display-knCount unselectable"
            >
              <div className="kn-amount-display">
                <div>
                  <p>
                    {/* parseNumber( */ dependencies.knCount.generalKn /* ) */}
                    <span>kN</span>{" "}
                  </p>
                  <p>
                    {/* parseNumber( */ dependencies.knCount.bioKn /* ) */}
                    <span className="bioKn">kN</span>{" "}
                  </p>
                </div>
                <div>
                  <p>
                    {/* parseNumber( */ dependencies.knCount.technoKn /* ) */}
                    <span className="technoKn">kN</span>{" "}
                  </p>
                  <p>
                    {/* parseNumber( */ dependencies.knCount.cultureKn /* ) */}
                    <span className="cultureKn">kN</span>{" "}
                  </p>
                </div>
              </div>
              <Buff />
              <img
                className="character"
                src={personajeOneLoop}
                alt="personaje"
              />
            </div>
          </div>
          <div className="second-half">
            <nav className="second-half-nav">
              <ul className="second-half-ul">
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/">
                    Shop
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/stats">
                    Stats
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/shelf">
                    Shelf
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/community">
                    Community
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/options">
                    Options
                  </Link>
                </li>
              </ul>
            </nav>

            <Route exact path="/">
              <Shop />
            </Route>
            <Route path="/options">
              <Options showPrimaryView={true} />
            </Route>
            <Route path="/stats">
              <Stats />
            </Route>
            <Route path="/shelf">
              <ReactFlowProvider>
                <Shelf />
              </ReactFlowProvider>
            </Route>
            <Route path="/community">
              <BookSubmissions />
            </Route>
          </div>
        </>
      ) : (
        <div className="second-view">
          <div className="first-half-cc">
            <div className="header">
              <form className="music-div">
                <label className="music-tag">Music</label>
                {BoopButton()}
              </form>

              <button
                className="view-button"
                onClick={() => setShowPrimaryView(!showPrimaryView)}
              >
                Change View
              </button>
              <button className="mute-button" onClick={() => setMute(!mute)}>
                {mute ? "Unmute" : "Mute"}
              </button>
            </div>

            <div className="display-stats">
              <p>
                Goal:
                <br />
                {parseNumber(statDependencies.goal)} kN
              </p>

              <p>
                Progress:
                <br />
                {Math.floor(
                  (statDependencies.totalKnCountOfThisRun.generalKn /
                    statDependencies.goal) *
                    100 *
                    100
                ) / 100}
                %
              </p>
              {/* <p>Total: {parseNumber(Math.floor(totalKn * 100) / 100)} kN</p> */}
            </div>
            <div
              unselectable="on"
              onClick={handleClick}
              className="display-knCount unselectable"
            >
              <div className="info-buff-container">
                <div className="kn-amount-display">
                  <div>
                    <p>
                      {
                        /* parseNumber( */ dependencies.knCount
                          .generalKn /* ) */
                      }
                      <span>kN</span>{" "}
                    </p>
                    <p>
                      {/* parseNumber( */ dependencies.knCount.bioKn /* ) */}
                      <span className="bioKn">kN</span>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      {/* parseNumber( */ dependencies.knCount.technoKn /* ) */}
                      <span className="technoKn">kN</span>{" "}
                    </p>
                    <p>
                      {
                        /* parseNumber( */ dependencies.knCount
                          .cultureKn /* ) */
                      }
                      <span className="cultureKn">kN</span>{" "}
                    </p>
                  </div>
                </div>
                <Buff />
              </div>

              <div className="character-container">
                <img
                  className="character character-cc"
                  src={personajeOneLoop}
                  alt="personaje"
                />
                <div className="square">
                  <div className="open-book">
                    <div className="currentlyReading">
                      Currently Reading: <br />
                      <br />
                      {dependencies.chosenBook}
                    </div>
                    <br />
                    <div className="currentlyReading">
                      Generating:
                      <div className="kn-amount-display kn-amount-horizontal-display">
                        <span className="kn-amount-ps">
                          {genrlKnCountWithEffects}
                          <span>kN</span>
                        </span>
                        <span className="kn-amount-ps">
                          {bioKnCountWithEffects}
                          <span className="bioKn">kN</span>
                        </span>
                        <span className="kn-amount-ps">
                          {technoKnCountWithEffects}
                          <span className="technoKn">kN</span>
                        </span>
                        <span className="kn-amount-ps">
                          {cultureKnCountWithEffects}
                          <span className="cultureKn">kN</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="second-half-cc">
            <nav className="second-half-nav">
              <ul className="second-half-ul">
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/">
                    Shop
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/stats">
                    Stats
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/shelf">
                    Shelf
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/community">
                    Community
                  </Link>
                </li>
                <li className="second-half-ul-li">
                  <Link className="second-half-nav-button" to="/options">
                    Options
                  </Link>
                </li>
              </ul>
            </nav>

            <Route exact path="/">
              <Shop />
            </Route>
            <Route path="/options">
              <Options showPrimaryView={false} />
            </Route>
            <Route path="/stats">
              <Stats />
            </Route>
            <Route path="/shelf">
              <ReactFlowProvider>
                <Shelf />
              </ReactFlowProvider>
            </Route>
            <Route path="/community">
              <BookSubmissions />
            </Route>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdleApp;
