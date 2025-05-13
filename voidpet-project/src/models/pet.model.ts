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