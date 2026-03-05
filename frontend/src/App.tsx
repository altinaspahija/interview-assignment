import "./App.css";
import { UsersStatsWidget } from "./components/UsersStatsWidget";

const API_URL = "/stats";

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: "auto", padding: 24 }}>
        <h2>Users Widget</h2>
        <UsersStatsWidget endpointUrl={API_URL} />
      </header>
    </div>
  );
}

export default App;
