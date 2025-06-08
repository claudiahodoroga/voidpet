// src/components/PetDisplay/PetDisplay.tsx
import React from "react";
// Asegúrate de que la ruta y el tipo de importación sean correctos para tu proyecto.
// Si ThreeJSPetModel se exporta con 'export default', esta importación es correcta.
import ThreeJSPetModel from "../ThreeJSPet/ThreeJSPetModel";

interface PetDisplayProps {
  petName: string;
}

// Nota: No es necesario cambiar nada dentro del componente,
// solo cómo lo envolvemos y exportamos al final.
const PetDisplayComponent: React.FC<PetDisplayProps> = ({ petName }) => {
  console.log("Renderizando PetDisplay para:", petName); // Este log ahora solo aparecerá si el nombre cambia.

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
        <ThreeJSPetModel modelPath="/assets/models/VirtualPetAnimado.glb" />
      </div>
    </div>
  );
};

// SOLUCIÓN: Envolvemos el componente con React.memo.
// Esto evitará que se vuelva a renderizar si la prop 'petName' no ha cambiado.
export const PetDisplay = React.memo(PetDisplayComponent);

// Por si acaso, puedes exportarlo por defecto si así lo usas en otros sitios.
export default PetDisplay;
