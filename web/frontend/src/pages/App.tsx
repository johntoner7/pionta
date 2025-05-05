import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mobile from "../components/Mobile";
import { PubGolf } from "./PubGolf";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mobile />} />
        <Route path="/pub-golf" element={<PubGolf />} />
      </Routes>
    </Router>
  );
}

export default App;
