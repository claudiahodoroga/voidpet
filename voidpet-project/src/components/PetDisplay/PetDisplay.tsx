// src/components/PetDisplay/PetDisplay.tsx
import React from "react";
import type { Pet } from "../../models/pet.model"; // Importa el tipo Pet
// Asegúrate de que la ruta y el tipo de importación sean correctos para tu proyecto.
import ThreeJSPetModel from "../ThreeJSPet/ThreeJSPetModel";

interface PetDisplayProps {
  // Ahora el componente recibe el objeto 'pet' completo.
  pet: Pet;
}

// El componente principal ahora usa pet.name para mostrar el nombre.
const PetDisplayComponent: React.FC<PetDisplayProps> = ({ pet }) => {
  console.log("Renderizando PetDisplay para:", pet.name);

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

// SOLUCIÓN: Función de comparación personalizada para React.memo.
// Le dice a React que solo vuelva a renderizar este componente si el ID o el nombre de la mascota cambian.
// Ignorará cualquier cambio en las estadísticas o en `lastInteraction`.
function petPropsAreEqual(
  prevProps: PetDisplayProps,
  nextProps: PetDisplayProps
) {
  return (
    prevProps.pet.id === nextProps.pet.id &&
    prevProps.pet.name === nextProps.pet.name
  );
}

// Envolvemos el componente con React.memo y le pasamos nuestra función de comparación.
export const PetDisplay = React.memo(PetDisplayComponent, petPropsAreEqual);

// Exportamos por defecto para mantener la consistencia.
export default PetDisplay;
