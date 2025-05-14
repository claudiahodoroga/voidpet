// src/components/PetDisplay/PetDisplay.tsx
import React from "react";
// import styles from './PetDisplay.module.css'; // Create this if more complex styling is needed

interface PetDisplayProps {
  petName: string;
  // Later, you might pass the 3D model reference or animation state here
}

const PetDisplay: React.FC<PetDisplayProps> = ({ petName }) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "var(--color-text-light, #E0F2FE)", // Use CSS variable
    width: "100%",
    height: "100%", // Take up available space in the screen content area
  };

  const petPlaceholderStyle: React.CSSProperties = {
    width: "12rem", // approx w-48
    height: "12rem", // approx h-48
    backgroundColor: "rgba(1, 165, 211, 0.2)", // var(--color-void-blue-medium) with alpha
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem", // approx mb-6
    boxShadow: "0 0 20px rgba(1, 165, 211, 0.3)",
    border: "2px solid rgba(1, 165, 211, 0.4)",
  };

  const petTextStyle: React.CSSProperties = {
    fontSize: "1.25rem", // approx text-xl
    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
  };

  return (
    <div style={containerStyle}>
      <div style={petPlaceholderStyle}>
        <span style={{ fontSize: "1.5rem", opacity: 0.7 }}>PET</span>
      </div>
      <p style={petTextStyle}>This is {petName}!</p>
      {/* You can add more status text or animations here later */}
    </div>
  );
};

export default PetDisplay;
