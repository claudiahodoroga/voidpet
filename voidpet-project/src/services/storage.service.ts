const PET_ID_KEY = 'voidpet_id';

export function savePetId(petId: string): void {
  localStorage.setItem(PET_ID_KEY, petId);
}

export function getPetId(): string | null {
  return localStorage.getItem(PET_ID_KEY);
}

export function clearPetId(): void {
  localStorage.removeItem(PET_ID_KEY);
}