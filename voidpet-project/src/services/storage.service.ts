// Defines the key used to store the pet ID in localStorage.
const PET_ID_KEY = 'voidpet_id';

/**
 * Saves the pet ID to localStorage.
 * @param petId The ID of the pet to save.
 */
export function savePetId(petId: string): void {
    try {
        localStorage.setItem(PET_ID_KEY, petId);
        console.log(`storage.service: Pet ID "${petId}" saved to localStorage.`);
    } catch (error) {
        console.error("storage.service: Error saving pet ID to localStorage:", error);
        // Optionally, handle the error, e.g., by notifying the user if localStorage is full or disabled.
    }
}

/**
 * Retrieves the pet ID from localStorage.
 * @returns The pet ID if found, otherwise null.
 */
export function getPetId(): string | null {
    try {
        const petId = localStorage.getItem(PET_ID_KEY);
        if (petId) {
            console.log(`storage.service: Pet ID "${petId}" retrieved from localStorage.`);
            return petId;
        }
        console.log("storage.service: No Pet ID found in localStorage.");
        return null;
    } catch (error) {
        console.error("storage.service: Error retrieving pet ID from localStorage:", error);
        return null; // Return null on error to ensure consistent behavior
    }
}

/**
 * Clears the pet ID from localStorage.
 */
export function clearPetId(): void {
    try {
        localStorage.removeItem(PET_ID_KEY);
        console.log("storage.service: Pet ID cleared from localStorage.");
    } catch (error) {
        console.error("storage.service: Error clearing pet ID from localStorage:", error);
    }
}
