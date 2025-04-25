import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
//import "../styles/Home.css";

const Home: React.FC = () => {
  const [isHatching, setIsHatching] = useState(false);
  const navigate = useNavigate();

  const handleCreatePet = () => {
    setIsHatching(true);

    // Generate a unique ID for the pet
    const petId = uuidv4();

    // Simulate hatching animation
    setTimeout(() => {
      // Navigate to the pet room with the new ID
      navigate(`/room/${petId}`);
    }, 3000); // 3 second animation
  };

  return (
    <div className="home-container">
      <h1 className="title">Void Pet</h1>
      <p className="subtitle">Create your digital companion in the void</p>

      <div className={`egg-container ${isHatching ? "hatching" : ""}`}>
        <div className="egg">
          {isHatching ? (
            <div className="egg-crack"></div>
          ) : (
            <div className="egg-shine"></div>
          )}
        </div>
      </div>

      {!isHatching ? (
        <button className="create-button" onClick={handleCreatePet}>
          Create Your Void Pet
        </button>
      ) : (
        <p className="hatching-text">Hatching...</p>
      )}
    </div>
  );
};

export default Home;
