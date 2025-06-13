import type { Pet } from '../models/pet.model'; 
import * as apiService from './api.service';
import * as storageService from './storage.service'; 

// Constantes para la decaída de estados por hora
const STAT_DECAY_RATE_PER_HOUR = {
    entertainment: 5, 
    hunger: 10,       
    tiredness: 3,     
};
const MAX_STAT_VALUE = 100;
const MIN_STAT_VALUE = 0;

// Obtener id del local storage si existe, si no devuelve null
export async function getCurrentPet(): Promise<Pet | null> {
    console.log("pet.service: Attempting to get current pet.");
    const petId = storageService.getPetId();

    if (petId) {
        try {
            console.log(`pet.service: Found pet ID "${petId}" in storage. Fetching from API.`);
            const pet = await apiService.getPet(petId);
            if (pet) {
                console.log("pet.service: Successfully fetched pet:", pet);
                // Actualizar estados según última sesión
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

// Crear nueva mascota con el nombre introducido, guarda la id y devuelve la mascota
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

// Actualiza los datos de una mascota existente
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

// Calcula y aplica cambios en los estados basados en el tiempo pasado desde la última interacción con la mascota
export function updateStatsBasedOnTime(pet: Pet): Pet {
    console.log(`pet.service: Updating stats for pet ID "${pet.id}" based on time.`);
    const now = new Date();
    const lastInteractionTime = new Date(pet.lastInteraction);
    
    const diffMilliseconds = now.getTime() - lastInteractionTime.getTime();
    const diffHours = diffMilliseconds / (1000 * 60 * 60);

    if (diffHours <= (1/60) ) { // Solo actualiza si ha pasado más de un minuto
        console.log("pet.service: Less than a minute passed or last interaction is in the future. No time-based stat decay applied.");
        return pet; 
    }

    let newHunger = pet.stats.hunger - (STAT_DECAY_RATE_PER_HOUR.hunger * diffHours);

    let newEntertainment = pet.stats.entertainment - (STAT_DECAY_RATE_PER_HOUR.entertainment * diffHours);
    
    let newTiredness = pet.stats.tiredness - (STAT_DECAY_RATE_PER_HOUR.tiredness * diffHours);

    // Clamp a min y max
    pet.stats.hunger = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, Math.round(newHunger)));
    pet.stats.entertainment = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, Math.round(newEntertainment)));
    pet.stats.tiredness = Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, Math.round(newTiredness)));
    
    console.log(`pet.service: Stats updated for pet ID "${pet.id}" due to time:`, pet.stats);
    return pet;
}


// Disminuye el hambre al alimentar
export async function feedPet(pet: Pet): Promise<Pet> {
    console.log(`pet.service: Feeding pet ID "${pet.id}".`);
    const updatedPetState: Pet = {
        ...pet,
        stats: {
            ...pet.stats,
            hunger: Math.min(MAX_STAT_VALUE, pet.stats.hunger + 30), 
        },
    };
    return updatePet(updatedPetState);
}

/**
 * Simulates playing with the pet. Increases entertainment, increases fatigue (tiredness).
 * @param pet The current pet object.
 * @returns A Promise resolving to the updated Pet object from the server.
 */
// Aumenta el entretenimiento, aumenta el hambre y la fatiga
export async function playWithPet(pet: Pet): Promise<Pet> {
    console.log(`pet.service: Playing with pet ID "${pet.id}".`);
    const updatedPetState: Pet = {
        ...pet,
        stats: {
            ...pet.stats,
            entertainment: Math.min(MAX_STAT_VALUE, pet.stats.entertainment + 25),
            hunger: Math.max(MIN_STAT_VALUE, pet.stats.hunger - 5), 
            tiredness: Math.min(MAX_STAT_VALUE, pet.stats.tiredness + 20), 
        },
    };
    return updatePet(updatedPetState);
}


// Disminuye la fatiga
export async function putToSleepPet(pet: Pet): Promise<Pet> {
    console.log(`pet.service: Putting pet ID "${pet.id}" to sleep.`);
    const updatedPetState: Pet = {
        ...pet,
        stats: {
            ...pet.stats,
            tiredness: Math.max(MIN_STAT_VALUE, pet.stats.tiredness - 50), 
        },
    };
    return updatePet(updatedPetState);
}
