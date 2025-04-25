/* import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import RoomView from "./views/RoomView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<RoomView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// src/App.tsx
import { usePetMood } from "./hooks/usePetMood";
import { PetStats } from "./components/PetStats";
import { MoodButtons } from "./components/MoodButtons";

function App() {
  const { mood, feed, play, sleep } = usePetMood("pet001");

  return (
    <div className="container">
      <h1>Void Pet</h1>
      <img src="/placeholder-pet.png" className="pet" alt="pet" />
      <PetStats mood={mood} />
      <MoodButtons onFeed={feed} onPlay={play} onSleep={sleep} />
    </div>
  );
}

export default App;
 */
