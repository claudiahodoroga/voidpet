// src/App.tsx
import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import PetView from "./components/PetView/PetView"; // Import PetView
import type { Pet } from "./models/pet.model";
import * as petService from "./services/pet.service";
import "./index.css"; // Your global CSS file

const App: React.FC = () => {
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // For initial pet load
  const [isLoadingAction, setIsLoadingAction] = useState(false); // For pet actions like feed/play
  const [error, setError] = useState<string | null>(null);

  const loadInitialPet = async () => {
    setIsLoadingInitial(true);
    setError(null);
    try {
      const existingPet = await petService.getCurrentPet();
      if (existingPet) {
        setCurrentPet(existingPet);
      }
    } catch (err) {
      console.error("App: Failed to load current pet", err);
      setError("Could not load your pet. Please try again.");
    } finally {
      setIsLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadInitialPet();
  }, []);

  const handleCreatePet = async (name: string) => {
    setIsLoadingAction(true); // Use isLoadingAction for creation as well
    setError(null);
    try {
      const newPet = await petService.createNewPet(name);
      setCurrentPet(newPet);
    } catch (err) {
      console.error("App: Failed to create pet", err);
      setError(err instanceof Error ? err.message : "Failed to create pet.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const appContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "var(--color-page-background, #F3F4F6)",
    padding: "1rem",
    fontFamily: "var(--font-primary, 'Inter', sans-serif)",
  };

  if (isLoadingInitial) {
    return (
      <div style={appContainerStyle}>
        <p
          style={{
            color: "var(--color-void-dark, #1D1F24)",
            fontSize: "1.2rem",
          }}
        >
          Loading Voidpet...
        </p>
      </div>
    );
  }

  if (error && !currentPet) {
    return (
      <div style={appContainerStyle}>
        <div
          style={{
            color: "#D30101",
            padding: "20px",
            border: "1px solid red",
            borderRadius: "8px",
            backgroundColor: "#ffe0e0",
          }}
        >
          <p>Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              loadInitialPet();
            }}
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              cursor: "pointer",
              background: "var(--color-void-blue-medium)",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={appContainerStyle}>
      {!currentPet ? (
        <LandingPage
          onCreatePet={handleCreatePet}
          isLoading={isLoadingAction}
        />
      ) : (
        <PetView
          pet={currentPet}
          setPet={setCurrentPet}
          isLoadingAction={isLoadingAction}
          setIsLoadingAction={setIsLoadingAction}
        />
      )}
    </div>
  );
};

export default App;
