import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import RoomView from "./views/RoomView";
//import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:petId" element={<RoomView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
