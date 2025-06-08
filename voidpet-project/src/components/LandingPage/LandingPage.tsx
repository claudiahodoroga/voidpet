// src/components/LandingPage/LandingPage.tsx
import React from "react";
import ComputerShell from "../ComputerShell/ComputerShell";
import PetNameForm from "../PetForm/PetForm";

interface LandingPageProps {
  onCreatePet: (name: string) => void;
  isLoading?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onCreatePet,
  isLoading,
}) => {
  return (
    // ComputerShell con formulario
    <ComputerShell showTopBarTitle={false}>
      <PetNameForm onCreatePet={onCreatePet} isLoading={isLoading} />
    </ComputerShell>
  );
};

export default LandingPage;
