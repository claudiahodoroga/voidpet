import { useState, useEffect } from "react";
import { getPetState, updatePetState } from "../services/api";

interface PetMood{
  hunger: number;
  tiredness: number;
  entertainment: number;
  lastUpdated: string;
}

interface UsePetMoodReturn{
  mood: PetMood | null;
  isLoading: boolean;
  error: Error | null;
  feedPet: () => Promise<void>;
  restPet: () => Promise<void>;
  playWithPet: () => Promise<void>;
  refreshPetState: () => Promise<void>;
}

export const usePetMood = (petID: string): UsePetMoodReturn =>{
  const [mood, setMood] = useState<PetMood | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshPetState = async () => {
    try{

      setIsLoading(true);
      const petState = await getPetState(petID);
      setMood({
        hunger: petState.hunger,
        tiredness: petState.tiredness,
        entertainment: petState.entertainment,
        lastUpdated: petState.lastUpdated
      });

      setError(null);

    } catch (err){
      setError(err instanceof Error ? err : new Error('Unkown error ocurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPetState();

    // decay interval (1-2 minutes)
    const decayInterval = setInterval(() => {
      if(mood?.lastUpdated){
        const now = new Date();
        const lastUpdate = new Date(mood.lastUpdated);
        const minutesPassed = (now.getTime() - lastUpdate.getTime()) / 60000;

        // decay rate
        const decayAmount = Math.min(5 * minutesPassed, 15); // max 15% decay

        if(decayAmount>0){
          updatePetState(petID, {
            hunger: Math.max(0, mood.hunger - decayAmount),
            tiredness: Math.max(0, mood.tiredness - decayAmount),
            entertainment: Math.max(0, mood.entertainment - decayAmount),
          }).then(refreshPetState);
        }
      }
    }, 60000); // check every minute
    return () => clearInterval(decayInterval);
  }, [petID]);

  const feedPet = async () => {
    try{
      await updatePetState(petID, {hunger: 100});
      await refreshPetState();
    } catch (err){
      setError(err instanceof Error ? err : new Error('Failed to feed pet'));
    }
  };

  const restPet = async () => {
    try{
      await updatePetState(petID, {tiredness: 100});
      await refreshPetState();
    } catch (err){
      setError(err instanceof Error ? err : new Error('Failed to rest pet'));
    }
  };

  const playWithPet = async () => {
    try{
      await updatePetState(petID, {entertainment: 100});
      await refreshPetState();
    } catch (err){
      setError(err instanceof Error ? err : new Error('Failed to play with pet'));
    }
  };

  return{
    mood,
    isLoading,
    error,
    feedPet,
    restPet,
    playWithPet,
    refreshPetState
  };
};