// src/components/PetDisplay/PetDisplay.tsx
import React from "react";
// Asegúrate de que la importación sea correcta para tu estructura de proyecto
import ThreeJSPetModel from "../ThreeJSPet/ThreeJSPetModel";

interface PetDisplayProps {
  petName: string;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ petName }) => {
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
    // Aumentamos el tamaño para que ocupe más espacio disponible
    width: "100%",
    height: "100%",
    maxWidth: "500px", // Aumentado el máximo
    maxHeight: "500px",
    marginBottom: "1rem",
    position: "relative",
    // Borde de depuración eliminado
    // border: '1px solid red',
  };

  const petNameTextStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    fontWeight: 500,
    marginTop: "0.5rem",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
  };

  const handleModelLoad = () => {
    console.log(`PetDisplay: Modelo 3D para ${petName} cargado.`);
  };

  const handleModelError = (error: ErrorEvent) => {
    console.error(
      `PetDisplay: Error al cargar modelo 3D para ${petName}:`,
      error
    );
  };

  return (
    <div style={displayContainerStyle}>
      <div style={modelViewerStyle}>
        <ThreeJSPetModel
          modelPath="/assets/models/VirtualPet2.glb" // Asegúrate de que esta ruta sea correcta
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      </div>
      <p style={petNameTextStyle}>¡Este es {petName}!</p>
    </div>
  );
};

export default PetDisplay;
