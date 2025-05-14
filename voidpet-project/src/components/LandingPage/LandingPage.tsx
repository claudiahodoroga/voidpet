// src/components/LandingPage/LandingPage.tsx
import React from "react";
import ComputerShell from "../ComputerShell/ComputerShell"; // Adjust path if necessary
import PetNameForm from "../PetForm/PetForm"; // Adjust path if necessary

interface LandingPageProps {
  onCreatePet: (name: string) => void;
  isLoading?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onCreatePet,
  isLoading,
}) => {
  return (
    // The LandingPage itself doesn't need much structure,
    // it just places the ComputerShell which contains the form.
    // The outer div in App.tsx will handle centering the ComputerShell.
    <ComputerShell
      showTopBarTitle={false} /* Hide "Voidpet - PetName" on initial landing */
      // We won't pass petName here as no pet exists yet
    >
      <PetNameForm onCreatePet={onCreatePet} isLoading={isLoading} />
    </ComputerShell>
  );
};

export default LandingPage;
