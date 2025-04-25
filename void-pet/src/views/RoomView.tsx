import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePetMood } from "../hooks/usePetMood";
import Room from "../components/Room";
import Pet from "../components/Pet";
import MoodIndicator from "../components/MoodIndicator";
import UIOverlay from "../components/UIOverlay";
//import '../styles/RoomView.css';

const RoomView: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(true);

  // Redirect to home if no petId
  useEffect(() => {
    if (!petId) {
      navigate("/");
    }
  }, [petId, navigate]);

  const { mood, isLoading, error, feedPet, restPet, playWithPet } = usePetMood(
    petId || ""
  );

  // Handle loading and error states
  if (!petId) return null;

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => navigate("/")}>Return Home</button>
      </div>
    );
  }

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div className="room-view">
      <Room>
        {mood && (
          <Pet
            hunger={mood.hunger}
            tiredness={mood.tiredness}
            entertainment={mood.entertainment}
          />
        )}
      </Room>

      <div className={`controls-container ${showControls ? "show" : "hide"}`}>
        {mood && (
          <MoodIndicator
            hunger={mood.hunger}
            tiredness={mood.tiredness}
            entertainment={mood.entertainment}
          />
        )}

        <UIOverlay
          onFeed={feedPet}
          onRest={restPet}
          onPlay={playWithPet}
          isLoading={isLoading}
        />
      </div>

      <button className="toggle-controls" onClick={toggleControls}>
        {showControls ? "▼" : "▲"}
      </button>
    </div>
  );
};

export default RoomView;
