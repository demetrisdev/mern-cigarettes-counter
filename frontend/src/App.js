import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Auth } from "./pages/auth";
import { Home } from "./pages/home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;