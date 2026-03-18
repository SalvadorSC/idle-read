import React, { useContext, useState, useEffect } from "react";
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
import { BookCombos } from "../BookCombos/BookCombos";
import { Prestige } from "../Prestige/Prestige";
import { BookEnchantments } from "../BookEnchantments/BookEnchantments";
import { TimedChallenges } from "../TimedChallenges/TimedChallenges";
import { Tooltip } from "../Tooltip/Tooltip";
import PrestigeContext from "../../context/PrestigeContext";
const IdleApp = () => {
  const dependencies = useContext(CounterContext);
  const statDependencies = useContext(StatsContext);
  const { setShowGeneratedKnAlert, setRewardsTaken } =
    useContext(CounterContext);
  const { mute, setMute, theme, setTheme } = useContext(MiscContext);
  const { prestigeUpgrades, totalWisdomEarned } = useContext(PrestigeContext);
  const [play] = useSound(soundUrl, { volume: mute ? 0 : 0.1 });
  const { increment } = useIncrementByClick(dependencies);
  const { parseNumber } = useNumberParsing();
  const { setChosenBookEffect } = useChosenKn(
    dependencies.chosenBook,
    dependencies.buffClass,
    dependencies.upgrades,
    prestigeUpgrades,
    dependencies.bookEnchantments,
    totalWisdomEarned
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === "dark" ? "L" : "D"}
              </button>
              <button className="mute-button" onClick={() => setMute(!mute)}>
                {mute ? "Unmute" : "Mute"}
              </button>
            </div>

            <div className="display-stats">
              <Tooltip text="General kN target for this run" position="bottom">
                <p>
                  Goal:
                  <br />
                  {parseNumber(statDependencies.goal)} kN
                </p>
              </Tooltip>

              <Tooltip text="General kN earned vs. goal" position="bottom">
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
              </Tooltip>
            </div>
            <div
              unselectable="on"
              onClick={handleClick}
              className="display-knCount unselectable"
            >
              <div className="kn-amount-display">
                <div>
                  <Tooltip text="General Knowledge" position="bottom">
                    <p>
                      {dependencies.knCount.generalKn}
                      <span>kN</span>{" "}
                    </p>
                  </Tooltip>
                  <Tooltip text="Biology Knowledge" position="bottom">
                    <p>
                      {dependencies.knCount.bioKn}
                      <span className="bioKn">kN</span>{" "}
                    </p>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip text="Technology Knowledge" position="bottom">
                    <p>
                      {dependencies.knCount.technoKn}
                      <span className="technoKn">kN</span>{" "}
                    </p>
                  </Tooltip>
                  <Tooltip text="Culture Knowledge" position="bottom">
                    <p>
                      {dependencies.knCount.cultureKn}
                      <span className="cultureKn">kN</span>{" "}
                    </p>
                  </Tooltip>
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
                  <Tooltip text="Buy books and buildings" position="bottom">
                    <Link className="second-half-nav-button" to="/">
                      Shop
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="View achievements and progress" position="bottom">
                    <Link className="second-half-nav-button" to="/stats">
                      Stats
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Book dependency tree" position="bottom">
                    <Link className="second-half-nav-button" to="/shelf">
                      Shelf
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Submit and vote on custom books" position="bottom">
                    <Link className="second-half-nav-button" to="/community">
                      Community
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Book synergy bonuses" position="bottom">
                    <Link className="second-half-nav-button" to="/combos">
                      Combos
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Enchant books for bonus effects" position="bottom">
                    <Link className="second-half-nav-button" to="/enchant">
                      Enchant
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Timed challenges for bonus rewards" position="bottom">
                    <Link className="second-half-nav-button" to="/challenges">
                      Challenges
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Reset for permanent bonuses" position="bottom">
                    <Link className="second-half-nav-button" to="/prestige">
                      Prestige
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Save, load, reset, and settings" position="bottom">
                    <Link className="second-half-nav-button" to="/options">
                      Options
                    </Link>
                  </Tooltip>
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
            <Route path="/combos">
              <BookCombos />
            </Route>
            <Route path="/enchant">
              <BookEnchantments />
            </Route>
            <Route path="/challenges">
              <TimedChallenges />
            </Route>
            <Route path="/prestige">
              <Prestige />
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
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === "dark" ? "L" : "D"}
              </button>
              <button className="mute-button" onClick={() => setMute(!mute)}>
                {mute ? "Unmute" : "Mute"}
              </button>
            </div>

            <div className="display-stats">
              <Tooltip text="General kN target for this run" position="bottom">
                <p>
                  Goal:
                  <br />
                  {parseNumber(statDependencies.goal)} kN
                </p>
              </Tooltip>

              <Tooltip text="General kN earned vs. goal" position="bottom">
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
              </Tooltip>
            </div>
            <div
              unselectable="on"
              onClick={handleClick}
              className="display-knCount unselectable"
            >
              <div className="info-buff-container">
                <div className="kn-amount-display">
                  <div>
                    <Tooltip text="General Knowledge" position="bottom">
                      <p>
                        {dependencies.knCount.generalKn}
                        <span>kN</span>{" "}
                      </p>
                    </Tooltip>
                    <Tooltip text="Biology Knowledge" position="bottom">
                      <p>
                        {dependencies.knCount.bioKn}
                        <span className="bioKn">kN</span>{" "}
                      </p>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip text="Technology Knowledge" position="bottom">
                      <p>
                        {dependencies.knCount.technoKn}
                        <span className="technoKn">kN</span>{" "}
                      </p>
                    </Tooltip>
                    <Tooltip text="Culture Knowledge" position="bottom">
                      <p>
                        {dependencies.knCount.cultureKn}
                        <span className="cultureKn">kN</span>{" "}
                      </p>
                    </Tooltip>
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
                    <Tooltip text="Knowledge per click from your current book" position="top">
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
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="second-half-cc">
            <nav className="second-half-nav">
              <ul className="second-half-ul">
                <li className="second-half-ul-li">
                  <Tooltip text="Buy books and buildings" position="bottom">
                    <Link className="second-half-nav-button" to="/">
                      Shop
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="View achievements and progress" position="bottom">
                    <Link className="second-half-nav-button" to="/stats">
                      Stats
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Book dependency tree" position="bottom">
                    <Link className="second-half-nav-button" to="/shelf">
                      Shelf
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Submit and vote on custom books" position="bottom">
                    <Link className="second-half-nav-button" to="/community">
                      Community
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Book synergy bonuses" position="bottom">
                    <Link className="second-half-nav-button" to="/combos">
                      Combos
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Enchant books for bonus effects" position="bottom">
                    <Link className="second-half-nav-button" to="/enchant">
                      Enchant
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Timed challenges for bonus rewards" position="bottom">
                    <Link className="second-half-nav-button" to="/challenges">
                      Challenges
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Reset for permanent bonuses" position="bottom">
                    <Link className="second-half-nav-button" to="/prestige">
                      Prestige
                    </Link>
                  </Tooltip>
                </li>
                <li className="second-half-ul-li">
                  <Tooltip text="Save, load, reset, and settings" position="bottom">
                    <Link className="second-half-nav-button" to="/options">
                      Options
                    </Link>
                  </Tooltip>
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
            <Route path="/combos">
              <BookCombos />
            </Route>
            <Route path="/enchant">
              <BookEnchantments />
            </Route>
            <Route path="/challenges">
              <TimedChallenges />
            </Route>
            <Route path="/prestige">
              <Prestige />
            </Route>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdleApp;
