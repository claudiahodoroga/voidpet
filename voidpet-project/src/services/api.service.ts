import type { Pet } from '../models/pet.model'; 

// URL base para la API de Azure Functions
const API_BASE_URL = 'https://voidpet-api-manual.azurewebsites.net/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorMessage;
        } catch (e) {
        // Ignorar si cuerpo del error no es JSON o está vacío
        }
        console.error("API call failed:", errorMessage);
        throw new Error(errorMessage);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json() as Promise<T>;
    } else {
        // Si no es JSON, devolver null o tratar como texto
        return null as unknown as T; 
    }
}

// Crear mascota nueva
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

// Obtener mascota con su ID
export async function getPet(petId: string): Promise<Pet | null> {
    console.log(`api.service: Getting pet with ID "${petId}"`);
    const response = await fetch(`${API_BASE_URL}/GetPet?id=${encodeURIComponent(petId)}`, {
        method: 'GET',
    });
    if (response.status === 404) {
        console.log(`api.service: Pet with ID "${petId}" not found (404).`);
        return null;
    }
    return handleResponse<Pet>(response);
}

// Guarda o actualiza la información de la mascota
export async function savePet(pet: Pet): Promise<Pet> {
    console.log(`api.service: Saving pet with ID "${pet.id}"`);
    const response = await fetch(`${API_BASE_URL}/SavePet`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pet),
    });
    return handleResponse<Pet>(response);
}
