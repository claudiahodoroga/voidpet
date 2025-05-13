import type { Pet } from '../models/pet.model';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:7071/api' 
  : '/api';

export async function createPet(name: string): Promise<Pet> {
  const response = await fetch(`${API_BASE}/CreatePet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to create pet');
  }

  return response.json();
}

export async function getPet(petId: string): Promise<Pet> {
  const response = await fetch(`${API_BASE}/GetPet?id=${petId}`);

  if (!response.ok) {
    throw new Error('Failed to get pet');
  }

  return response.json();
}

export async function savePet(pet: Pet): Promise<Pet> {
  const response = await fetch(`${API_BASE}/SavePet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pet),
  });

  if (!response.ok) {
    throw new Error('Failed to save pet');
  }

  return response.json();
}