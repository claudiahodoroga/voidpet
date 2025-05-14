// src/App.tsx (Simplified example)
import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import ComputerShell from "./components/ComputerShell/ComputerShell"; // For when pet exists
import { Pet } from "./models/pet.model";
import * as petService from "./services/pet.service";
import "./index.css"; // Or your main global CSS file

const App: React.FC = () => {
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPet = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };
    loadPet();
  }, []);

  const handleCreatePet = async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPet = await petService.createNewPet(name);
      setCurrentPet(newPet);
    } catch (err) {
      console.error("App: Failed to create pet", err);
      setError(err instanceof Error ? err.message : "Failed to create pet.");
    } finally {
      setIsLoading(false);
    }
  };

  // Main container for the app, ensuring it's centered and has a page background
  const appContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#F3F4F6", // A light gray page background
    padding: "1rem", // Some padding around the terminal
    fontFamily: "'Inter', sans-serif", // Apply base font
  };

  if (isLoading && !currentPet && !error) {
    return (
      <div style={appContainerStyle}>
        <p style={{ color: "#1D1F24", fontSize: "1.2rem" }}>
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
              loadPet(); /* Simplified retry */
            }}
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              cursor: "pointer",
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
        <LandingPage onCreatePet={handleCreatePet} isLoading={isLoading} />
      ) : (
        <ComputerShell petName={currentPet.name} showTopBarTitle={true}>
          <div style={{ color: "white", textAlign: "center" }}>
            <h1>Welcome back with {currentPet.name}!</h1>
            <p>ID: {currentPet.id}</p>
            {/* TODO: PetView, StatsDisplay, Controls components will go here */}
          </div>
        </ComputerShell>
      )}
    </div>
  );
};

// Helper function for App useEffect to be callable for retry
async function loadPet() {
  // This is a placeholder for the actual loadPet logic inside App's useEffect
  // In a real scenario, you might lift more state or use context/zustand
  // For now, this function is just for the conceptual retry button
  console.log("Attempting to reload pet data...");
  // Re-triggering the effect or a dedicated load function in App is needed
}

export default App;
