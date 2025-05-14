import type { Pet } from '../models/pet.model'; // Assuming Pet model is in src/models/
 // Assuming Pet model is in src/models/
import * as apiService from './api.service'; // Import all functions from api.service
import * as storageService from './storage.service'; // Import all functions from storage.service

// Constants for stat decay (example values, adjust as needed)
const STAT_DECAY_RATE_PER_HOUR = { // How much each stat decreases/changes per hour
    entertainment: 5, // Entertainment decreases
    hunger: 10,       // Hunger decreases (pet gets hungrier)
    tiredness: 3,     // Tiredness (fatigue) decreases if idle (pet rests)
};
const MAX_STAT_VALUE = 100;
const MIN_STAT_VALUE = 0;

/**
 * Attempts to retrieve an existing pet ID from local storage and fetch the pet.
 * If no pet ID is found or the pet cannot be fetched, it returns null.
 * @returns A Promise resolving to the Pet object if found and fetched (with stats updated for time passed), otherwise null.
 */
export async function getCurrentPet(): Promise<Pet | null> {
    console.log("pet.service: Attempting to get current pet.");
    const petId = storageService.getPetId();

    if (petId) {
        try {
            console.log(`pet.service: Found pet ID "${petId}" in storage. Fetching from API.`);
            const pet = await apiService.getPet(petId);
            if (pet) {
                console.log("pet.service: Successfully fetched pet:", pet);
                // Update stats based on time since last interaction right after fetching
                return updateStatsBasedOnTime(pet);
            } else {
                console.log(`pet.service: Pet with ID "${petId}" not found on server. Clearing local ID.`);
                storageService.clearPetId();
                return null;
            }
        } catch (error) {
            console.error("pet.service: Error fetching pet by ID:", error);
            return null;
        }
    } else {
        console.log("pet.service: No pet ID found in local storage.");
        return null;
    }
}

/**
 * Creates a new pet with the given name, saves its ID, and returns the pet.
 * @param name The name for the new pet.
 * @returns A Promise resolving to the newly created Pet object.
 */
export async function createNewPet(name: string): Promise<Pet> {
    console.log(`pet.service: Creating new pet with name "${name}".`);
    try {
        const newPet = await apiService.createPet(name);
        storageService.savePetId(newPet.id);
        console.log("pet.service: New pet created and ID saved:", newPet);
        return newPet;
    } catch (error) {
        console.error("pet.service: Error creating new pet:", error);
        throw error; 
    }
}

/**
 * Updates an existing pet's data on the server.
 * Sets `lastInteraction` to current time before saving.
 * @param pet The Pet object with updated data.
 * @returns A Promise resolving to the updated Pet object from the server.
 */
export async function updatePet(pet: Pet): Promise<Pet> {
    console.log(`pet.service: Updating pet with ID "${pet.id}".`);
    try {
        const petToSave: Pet = {
            ...pet,
            lastInteraction: new Date().toISOString(), // Server also does this, but good for client state
        };
        const updatedPetFromServer = await apiService.savePet(petToSave);
        console.log("pet.service: Pet updated successfully on server:", updatedPetFromServer);
        return updatedPetFromServer; 
    } catch (error) {
        console.error(`pet.service: Error updating pet with ID "${pet.id}":`, error);
        throw error; 
    }
}

/**
 * Calculates and applies stat changes based on the time elapsed since the pet's last interaction.
 * This function MODIFIES the passed-in pet object directly.
 * @param pet The Pet object to update.
 * @returns The modified Pet object with updated stats.
 */
export function updateStatsBasedOnTime(pet: Pet): Pet {
    console.log(`pet.service: Updating stats for pet ID "${pet.id}" based on time.`);
    const now = new Date();
    const lastInteractionTime = new Date(pet.lastInteraction);
    
    const diffMilliseconds = now.getTime() - lastInteractionTime.getTime();
    const diffHours = diffMilliseconds / (1000 * 60 * 60);

    if (diffHours <= (1/60) ) { // Only update if more than a minute has passed to avoid tiny changes
        console.log("pet.service: Less than a minute passed or last interaction is in the future. No time-based stat decay applied.");
        return pet; 
    }

    // Calculate new stats
    // Hunger: increases over time (pet gets hungrier, so stat value decreases if 100 is full)
    // For clarity, let's assume 100 = full, 0 = starving. So hunger stat should decrease.
    let newHunger = pet.stats.hunger - (STAT_DECAY_RATE_PER_HOUR.hunger * diffHours);

    // Entertainment: decreases over time (pet gets bored)
    let newEntertainment = pet.stats.entertainment - (STAT_DECAY_RATE_PER_HOUR.entertainment * diffHours);
    
    // Tiredness (Fatigue): decreases if idle (pet rests)
    let newTiredness = pet.stats.tiredness - (STAT_DECAY_RATE_PER_HOUR.tiredness * diffHours);

    // Clamp stats to min/max values
    pet.stats.hunger = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, Math.round(newHunger)));
    pet.stats.entertainment = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, Math.round(newEntertainment)));
    pet.stats.tiredness = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, Math.round(newTiredness)));
    
    console.log(`pet.service: Stats updated for pet ID "${pet.id}" due to time:`, pet.stats);
    return pet;
}

/**
 * Simulates feeding the pet. Increases hunger stat (reduces actual hunger).
 * @param pet The current pet object.
 * @returns A Promise resolving to the updated Pet object from the server.
 */
export async function feedPet(pet: Pet): Promise<Pet> {
    console.log(`pet.service: Feeding pet ID "${pet.id}".`);
    const updatedPetState: Pet = {
        ...pet,
        stats: {
            ...pet.stats,
            hunger: Math.min(MAX_STAT_VALUE, pet.stats.hunger + 30), // Increase hunger stat (less hungry)
            // entertainment: Math.max(MIN_STAT_VALUE, pet.stats.entertainment - 2), // Optional: slight entertainment decrease
        },
    };
    return updatePet(updatedPetState);
}

/**
 * Simulates playing with the pet. Increases entertainment, increases fatigue (tiredness).
 * @param pet The current pet object.
 * @returns A Promise resolving to the updated Pet object from the server.
 */
export async function playWithPet(pet: Pet): Promise<Pet> {
    console.log(`pet.service: Playing with pet ID "${pet.id}".`);
    const updatedPetState: Pet = {
        ...pet,
        stats: {
            ...pet.stats,
            entertainment: Math.min(MAX_STAT_VALUE, pet.stats.entertainment + 25),
            hunger: Math.max(MIN_STAT_VALUE, pet.stats.hunger - 5), // Playing makes pet a bit hungrier
            tiredness: Math.min(MAX_STAT_VALUE, pet.stats.tiredness + 20), // Playing increases fatigue
        },
    };
    return updatePet(updatedPetState);
}

/**
 * Simulates putting the pet to sleep. Significantly decreases fatigue (tiredness).
 * @param pet The current pet object.
 * @returns A Promise resolving to the updated Pet object from the server.
 */
export async function putToSleepPet(pet: Pet): Promise<Pet> {
    console.log(`pet.service: Putting pet ID "${pet.id}" to sleep.`);
    const updatedPetState: Pet = {
        ...pet,
        stats: {
            ...pet.stats,
            tiredness: Math.max(MIN_STAT_VALUE, pet.stats.tiredness - 50), // Significantly reduce fatigue
            // hunger: Math.max(MIN_STAT_VALUE, pet.stats.hunger - 2), // Optional: sleeping might slightly reduce hunger gain rate
        },
    };
    return updatePet(updatedPetState);
}
