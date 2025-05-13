import type { Pet } from '../models/pet.model';
import * as api from './api.service';
import * as storage from './storage.service';

export async function getOrCreatePet(name?: string): Promise<Pet> {
  // Try to get pet from local storage first
  const storedPetId = storage.getPetId();
  
  if (storedPetId) {
    try {
      const pet = await api.getPet(storedPetId);
      if (pet) {
        // Calculate changes in stats since last interaction
        updateStatsBasedOnTime(pet);
        return pet;
      }
    } catch (error) {
      console.error('Error getting pet:', error);
    }
  }
  
  // If no pet exists or couldn't be loaded, create a new one
  if (!name) {
    throw new Error('Pet name is required to create a new pet');
  }
  
  const newPet = await api.createPet(name);
  storage.savePetId(newPet.id);
  return newPet;
}

export async function updatePet(pet: Pet, action: 'feed' | 'play' | 'sleep'): Promise<Pet> {
  // Apply action effects to pet stats
  switch (action) {
    case 'feed':
      pet.stats.hunger = Math.min(100, pet.stats.hunger + 30);
      break;
    case 'play':
      pet.stats.entertainment = Math.min(100, pet.stats.entertainment + 30);
      pet.stats.tiredness = Math.max(0, pet.stats.tiredness - 10);
      pet.stats.hunger = Math.max(0, pet.stats.hunger - 10);
      break;
    case 'sleep':
      pet.stats.tiredness = Math.min(100, pet.stats.tiredness + 50);
      pet.stats.entertainment = Math.max(0, pet.stats.entertainment - 5);
      break;
  }
  
  // Save updated pet
  const updatedPet = await api.savePet(pet);
  return updatedPet;
}

export function updateStatsBasedOnTime(pet: Pet): void {
  const now = new Date();
  const lastInteraction = new Date(pet.lastInteraction);
  const hoursPassed = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);
  
  // Stats decrease over time
  pet.stats.entertainment = Math.max(0, pet.stats.entertainment - hoursPassed * 5);
  pet.stats.hunger = Math.max(0, pet.stats.hunger - hoursPassed * 3);
  pet.stats.tiredness = Math.max(0, pet.stats.tiredness - hoursPassed * 2);
}