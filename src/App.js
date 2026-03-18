import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { CounterProvider } from "./context/CounterContext";
import IdleApp from "./components/IdleApp/IdleApp";
import { StatsProvider } from "./context/StatsContext";
import { MiscProvider } from "./context/MiscContext";
import { BookSubmissionsProvider } from "./context/BookSubmissionsContext";
import { PrestigeProvider } from "./context/PrestigeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationStack } from "./components/Notification/Notification";

function App() {
  return (
    <Router>
      <Switch>
        <NotificationProvider>
          <CounterProvider>
            <StatsProvider>
              <MiscProvider>
                <PrestigeProvider>
                  <BookSubmissionsProvider>
                    <div className="App">
                      <NotificationStack />
                      <IdleApp />
                    </div>
                  </BookSubmissionsProvider>
                </PrestigeProvider>
              </MiscProvider>
            </StatsProvider>
          </CounterProvider>
        </NotificationProvider>
      </Switch>
    </Router>
  );
}

export default App;
