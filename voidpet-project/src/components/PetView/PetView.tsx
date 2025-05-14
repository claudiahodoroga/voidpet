// src/components/PetView/PetView.tsx
import React from "react";
import ComputerShell from "../ComputerShell/ComputerShell";
import StatsDisplay from "../StatsDisplay/StatsDisplay";
import Controls from "../Controls/Controls";
import PetDisplay from "../PetDisplay/PetDisplay";
import type { Pet } from "../../models/pet.model"; // Adjust path as needed
import * as petService from "../../services/pet.service"; // Adjust path

interface PetViewProps {
  pet: Pet;
  setPet: (updatedPet: Pet | null) => void; // To update pet state in App.tsx
  isLoadingAction: boolean; // Is an action like feed/play/sleep in progress?
  setIsLoadingAction: (isLoading: boolean) => void;
}

const PetView: React.FC<PetViewProps> = ({
  pet,
  setPet,
  isLoadingAction,
  setIsLoadingAction,
}) => {
  const handleFeed = async () => {
    if (!pet) return;
    setIsLoadingAction(true);
    try {
      const updatedPet = await petService.feedPet(pet);
      setPet(updatedPet);
    } catch (error) {
      console.error("PetView: Failed to feed pet", error);
      // TODO: Show error to user
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handlePlay = async () => {
    if (!pet) return;
    setIsLoadingAction(true);
    try {
      const updatedPet = await petService.playWithPet(pet);
      setPet(updatedPet);
    } catch (error) {
      console.error("PetView: Failed to play with pet", error);
      // TODO: Show error to user
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleSleep = async () => {
    if (!pet) return;
    setIsLoadingAction(true);
    try {
      const updatedPet = await petService.putToSleepPet(pet);
      setPet(updatedPet);
    } catch (error) {
      console.error("PetView: Failed to put pet to sleep", error);
      // TODO: Show error to user
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (!pet) {
    return null; // Should not happen if PetView is rendered only when pet exists
  }

  return (
    <ComputerShell
      petName={pet.name}
      showTopBarTitle={true}
      statsNode={<StatsDisplay stats={pet.stats} />}
      controlsNode={
        <Controls
          onFeed={handleFeed}
          onPlay={handlePlay}
          onSleep={handleSleep}
          isLoading={isLoadingAction}
        />
      }
    >
      <PetDisplay petName={pet.name} />
    </ComputerShell>
  );
};

export default PetView;
