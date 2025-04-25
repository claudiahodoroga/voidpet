/* // src/api/petService.ts
import { PetMood } from "../hooks/usePetMood";

const LOCAL_KEY = "voidpet-state";

export async function getPetState(petId: string): Promise<PetMood | null> {
  const raw = localStorage.getItem(`${LOCAL_KEY}-${petId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function updatePetState(petId: string, mood: PetMood): Promise<void> {
  localStorage.setItem(`${LOCAL_KEY}-${petId}`, JSON.stringify(mood));
}
 */