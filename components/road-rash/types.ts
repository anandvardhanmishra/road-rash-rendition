// Road Rash Racing Types

export type Vehicle = {
  id: string;
  name: string;
  color: string;
  textColor: string;
};

export interface GameConfig {
  selectedDifficulty: number | null;
  selectedVehicle: string | null;
  racerName: string | null;
}

// Static game data
export const VEHICLES: Vehicle[] = [
  { id: 'red', name: 'Speed Demon', color: '#ff0000', textColor: '#ffffff' },
  { id: 'blue', name: 'Thunder Bolt', color: '#0000ff', textColor: '#ffffff' },
  { id: 'green', name: 'Jungle Rider', color: '#00ff00', textColor: '#000000' },
  { id: 'purple', name: 'Night Stalker', color: '#800080', textColor: '#ffffff' },
  { id: 'orange', name: 'Fire Streak', color: '#ffa500', textColor: '#000000' },
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
