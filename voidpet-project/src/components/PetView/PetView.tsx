// src/components/PetView/PetView.tsx
import React from "react";
import ComputerShell from "../ComputerShell/ComputerShell";
import StatsDisplay from "../StatsDisplay/StatsDisplay";
import Controls from "../Controls/Controls";
import { PetDisplay } from "../PetDisplay/PetDisplay"; // Importa la versión memoizada
import type { Pet } from "../../models/pet.model";
import * as petService from "../../services/pet.service";

interface PetViewProps {
  pet: Pet;
  setPet: (updatedPet: Pet | null) => void;
  isLoadingAction: boolean;
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
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (!pet) {
    return null;
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
      {/* CORREGIDO: Pasamos el objeto 'pet' completo como prop */}
      <PetDisplay pet={pet} />
    </ComputerShell>
  );
};

export default PetView;
