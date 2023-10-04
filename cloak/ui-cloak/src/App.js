import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "./intro/Container";
import Wrapper from "./components/Wrapper";
import DisclaimerPopup from "./intro/DisclaimerPopup";

function App() {

  return (
    <div className="App">
      <DisclaimerPopup />
      <Router>
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/cloak" element={<Wrapper />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
