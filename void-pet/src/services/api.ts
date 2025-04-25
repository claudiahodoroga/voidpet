interface PetState{
  id: string;
  hunger: number;
  tiredness: number;
  entertainment: number;
  lastUpdated: string;
  createdAt?: string;
}

interface PetStateUpdate{
  hunger?: number;
  tiredness?: number;
  entertainment?: number;
}

const API_URL = import.meta.env.VITE_API_URL ||'/api';

export const getPetState = async (petID: string): Promise<PetState> => {
  try{
    const response = await fetch(`${API_URL}/getPetState?petID=${petID}`);
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error){
    console.error('Failed to fetch pet state: ', error);
    throw error;
  }
};

export const updatePetState = async (
  petID: string,
  update: PetStateUpdate
): Promise<PetState> => {
  try{
    const response = await fetch(`${API_URL}/updatePetState`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        petID,
        ...update,
      }),
    });
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
    
  } catch (error){
    console.error('Failed to update pet state: ', error);
    throw error;
  }
};