// src/components/PetDisplay/PetDisplay.tsx
import React from "react";
import { ThreeJSPetModel } from "../ThreeJSPet/ThreeJSPetModel"; // Ajusta la ruta si es necesario

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
    width: "90%",
    height: "80%",
    maxWidth: "450px",
    maxHeight: "450px",
    marginBottom: "1rem",
    position: "relative",
    // AÑADIDO PARA DEPURACIÓN: Un borde para ver el tamaño real del contenedor del canvas
    border: "1px solid red",
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
          modelPath="/assets/models/VirtualPetAnimado.glb" // Asegúrate de que esta ruta sea correcta
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      </div>
      <p style={petNameTextStyle}>¡Este es {petName}!</p>
    </div>
  );
};

export default PetDisplay;
