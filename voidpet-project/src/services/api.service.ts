import type { Pet } from '../models/pet.model'; // Assuming your Pet model is in src/models/
 // Assuming your Pet model is in src/models/

// Define the base URL for your Azure Functions API
// For local development with `func start`, this is typically http://localhost:7071/api
// If using Vite proxy or SWA CLI later, this might just be '/api'
const API_BASE_URL = 'http://localhost:7071/api';

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        // Try to parse error message from backend if available
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorMessage;
        } catch (e) {
            // Ignore if error body is not JSON or empty
        }
        console.error("API call failed:", errorMessage);
        throw new Error(errorMessage);
    }
    // Check if response is JSON before trying to parse
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json() as Promise<T>;
    } else {
        // If not JSON, return null or handle as text, depending on expectations
        // For this app, we mostly expect JSON or no content for success
        return null as unknown as T; 
    }
}

/**
 * Creates a new pet.
 * @param name The name of the pet to create.
 * @returns A Promise resolving to the created Pet object.
 */
export async function createPet(name: string): Promise<Pet> {
    console.log(`api.service: Creating pet with name "${name}"`);
    const response = await fetch(`${API_BASE_URL}/CreatePet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    return handleResponse<Pet>(response);
}

/**
 * Gets a pet by its ID.
 * @param petId The ID of the pet to retrieve.
 * @returns A Promise resolving to the Pet object, or null if not found.
 */
export async function getPet(petId: string): Promise<Pet | null> {
    console.log(`api.service: Getting pet with ID "${petId}"`);
    const response = await fetch(`${API_BASE_URL}/GetPet?id=${encodeURIComponent(petId)}`, {
        method: 'GET',
    });
    // GetPet returns 404 if not found, handleResponse will throw for non-ok.
    // We need to catch 404 specifically if we want to return null instead of throwing.
    if (response.status === 404) {
        console.log(`api.service: Pet with ID "${petId}" not found (404).`);
        return null;
    }
    return handleResponse<Pet>(response);
}

/**
 * Saves (updates) a pet's data.
 * The request body should be the full Pet object.
 * @param pet The Pet object with updated data.
 * @returns A Promise resolving to the updated Pet object.
 */
export async function savePet(pet: Pet): Promise<Pet> {
    console.log(`api.service: Saving pet with ID "${pet.id}"`);
    const response = await fetch(`${API_BASE_URL}/SavePet`, {
        method: 'PUT', // Matches our Azure Function definition
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pet),
    });
    return handleResponse<Pet>(response);
}
