export interface Pet {
  id: string;
  name: string;
  dateCreated: string;
  lastInteraction: string;
  stats: {
    entertainment: number;
    hunger: number;
    tiredness: number;
  };
}

export function createNewPet(name: string): Pet {
  const now = new Date().toISOString();
  return {
    id: Math.random().toString(36).substring(2, 15),
    name,
    dateCreated: now,
    lastInteraction: now,
    stats: {
      entertainment: 100,
      hunger: 100,
      tiredness: 100
    }
  };
}