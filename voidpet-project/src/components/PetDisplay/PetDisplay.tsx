// src/components/PetDisplay/PetDisplay.tsx
import React from "react";
import ThreeJSPetModel from "../ThreeJSPet/ThreeJSPetModel"; // Ajusta la ruta si es necesario

interface PetDisplayProps {
  petName: string;
  // En el futuro, podrías pasar aquí otras propiedades del pet
  // si influyen en la apariencia o animación del modelo.
}

const PetDisplay: React.FC<PetDisplayProps> = ({ petName }) => {
  // Estilo para el contenedor principal del área de visualización de la mascota
  const displayContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Centra el contenido verticalmente
    textAlign: "center",
    color: "var(--color-text-light, #E0F2FE)", // Usa la variable CSS global para el color del texto
    width: "100%",
    height: "100%", // Asegura que este contenedor ocupe todo el espacio disponible
    overflow: "hidden", // Evita que el lienzo 3D se desborde
  };

  // Estilo para el contenedor específico del visor del modelo 3D
  const modelViewerStyle: React.CSSProperties = {
    width: "90%", // Ocupa la mayor parte del espacio
    height: "80%",
    maxWidth: "450px",
    maxHeight: "450px",
    marginBottom: "1rem", // Espacio entre el modelo y el texto de abajo
    position: "relative", // Necesario para los mensajes de carga/error
  };

  // Estilo para el texto con el nombre de la mascota
  const petNameTextStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    fontWeight: 500,
    marginTop: "0.5rem",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
  };

  // Funciones callback para manejar la carga y errores del modelo
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
          modelPath="/assets/models/VirtualPetAnimado.glb" // ¡IMPORTANTE! Asegúrate de que esta ruta sea correcta
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      </div>
      <p style={petNameTextStyle}>¡Este es {petName}!</p>
    </div>
  );
};

export default PetDisplay;
