import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { CounterProvider } from "./context/CounterContext";
import IdleApp from "./components/IdleApp/IdleApp";
import { StatsProvider } from "./context/StatsContext";
import { MiscProvider } from "./context/MiscContext";
import { BookSubmissionsProvider } from "./context/BookSubmissionsContext";

function App() {
  return (
    <Router>
      <Switch>
        <CounterProvider>
          <StatsProvider>
            <MiscProvider>
              <BookSubmissionsProvider>
                <div className="App">
                  <IdleApp />
                </div>
              </BookSubmissionsProvider>
            </MiscProvider>
          </StatsProvider>
        </CounterProvider>
      </Switch>
    </Router>
  );
}

export default App;
