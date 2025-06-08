// src/components/PetDisplay/PetDisplay.tsx
import React from "react";
import type { Pet } from "../../models/pet.model";
import ThreeJSPetModel from "../ThreeJSPet/ThreeJSPetModel";

interface PetDisplayProps {
  pet: Pet;
}

// El componente principal para mostrar el nombre
const PetDisplayComponent: React.FC<PetDisplayProps> = ({ pet }) => {
  console.log("Rendering display for:", pet.name);

  const displayContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "var(--color-text-light, #E0F2FE)",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  };

  const modelViewerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    maxWidth: "500px",
    maxHeight: "500px",
    marginBottom: "1rem",
    position: "relative",
  };

  return (
    <div style={displayContainerStyle}>
      <div style={modelViewerStyle}>
        <ThreeJSPetModel modelPath="/assets/models/VirtualPet2.glb" />
      </div>
    </div>
  );
};

// Función de comparación personalizada para React.memo
function petPropsAreEqual(
  prevProps: PetDisplayProps,
  nextProps: PetDisplayProps
) {
  return (
    prevProps.pet.id === nextProps.pet.id &&
    prevProps.pet.name === nextProps.pet.name
  );
}

export const PetDisplay = React.memo(PetDisplayComponent, petPropsAreEqual);

export default PetDisplay;
