/* // src/hooks/usePetMood.ts
import { useEffect, useState } from "react";
import { getPetState, updatePetState } from "../services/api";

export type PetMood = {
  hunger: number;
  tiredness: number;
  entertainment: number;
  lastUpdated: string;
};

const defaultMood: PetMood = {
  hunger: 100,
  tiredness: 100,
  entertainment: 100,
  lastUpdated: new Date().toISOString(),
};

export function usePetMood(petId: string) {
  const [mood, setMood] = useState<PetMood>(defaultMood);

  // Load initial state
  useEffect(() => {
    getPetState(petId).then((data) => {
      if (data) setMood(applyDecay(data));
    });
  }, [petId]);

  // Apply time-based decay
  function applyDecay(prev: PetMood): PetMood {
    const minutesPassed = (Date.now() - Date.parse(prev.lastUpdated)) / 60000;
    const decayRate = 1.5; // percent per minute

    return {
      hunger: Math.max(0, prev.hunger - minutesPassed * decayRate),
      tiredness: Math.max(0, prev.tiredness - minutesPassed * decayRate),
      entertainment: Math.max(0, prev.entertainment - minutesPassed * decayRate),
      lastUpdated: new Date().toISOString(),
    };
  }

  function updateStat(stat: keyof PetMood, amount: number) {
    const newMood = {
      ...mood,
      [stat]: Math.min(100, mood[stat] + amount),
      lastUpdated: new Date().toISOString(),
    };
    setMood(newMood);
    updatePetState(petId, newMood);
  }

  return {
    mood,
    feed: () => updateStat("hunger", 20),
    sleep: () => updateStat("tiredness", 20),
    play: () => updateStat("entertainment", 20),
  };
}
 */