import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Landing from "./pages/Landing";
import Waiting from "./pages/Waiting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
