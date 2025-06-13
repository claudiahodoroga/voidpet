// Key del localStorage
const PET_ID_KEY = 'voidpet_id';

// Guarda la id al localStorage
export function savePetId(petId: string): void {
    try {
        localStorage.setItem(PET_ID_KEY, petId);
        console.log(`storage.service: Pet ID "${petId}" saved to localStorage.`);
    } catch (error) {
        console.error("storage.service: Error saving pet ID to localStorage:", error);
    }
}

// Obtiene la id del localStorage
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
        return null; 
    }
}

// Quita una id del localStorage
export function clearPetId(): void {
    try {
        localStorage.removeItem(PET_ID_KEY);
        console.log("storage.service: Pet ID cleared from localStorage.");
    } catch (error) {
        console.error("storage.service: Error clearing pet ID from localStorage:", error);
    }
}
