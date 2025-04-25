import React, { useEffect, useRef } from "react";
//import "../styles/Pet.css";

interface PetProps {
  hunger: number;
  tiredness: number;
  entertainment: number;
}

const Pet: React.FC<PetProps> = ({ hunger, tiredness, entertainment }) => {
  const petRef = useRef<HTMLDivElement>(null);

  // Calculate overall mood (0-100)
  const overallMood = Math.floor((hunger + tiredness + entertainment) / 3);

  // Determine pet expression based on mood
  const getMoodExpression = () => {
    if (overallMood > 80) return "(◕‿◕)";
    if (overallMood > 60) return "(•‿•)";
    if (overallMood > 40) return "(•_•)";
    if (overallMood > 20) return "(⊙︿⊙)";
    return "(╥﹏╥)";
  };

  return (
    <div ref={petRef} className={`pet ${overallMood < 30 ? "pet-sad" : ""}`}>
      <div className="pet-body">
        <div className="pet-face">{getMoodExpression()}</div>
      </div>
    </div>
  );
};

export default Pet;
