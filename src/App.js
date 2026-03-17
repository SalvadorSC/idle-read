import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { CounterProvider } from "./context/CounterContext";
import IdleApp from "./components/IdleApp/IdleApp";
import { StatsProvider } from "./context/StatsContext";
import { MiscProvider } from "./context/MiscContext";
import { BookSubmissionsProvider } from "./context/BookSubmissionsContext";
import { PrestigeProvider } from "./context/PrestigeContext";

function App() {
  return (
    <Router>
      <Switch>
        <CounterProvider>
          <StatsProvider>
            <MiscProvider>
              <PrestigeProvider>
                <BookSubmissionsProvider>
                  <div className="App">
                    <IdleApp />
                  </div>
                </BookSubmissionsProvider>
              </PrestigeProvider>
            </MiscProvider>
          </StatsProvider>
        </CounterProvider>
      </Switch>
    </Router>
  );
}

export default App;
