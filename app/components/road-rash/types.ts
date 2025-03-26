export interface GameConfig {
  racerName: string;
  selectedVehicle: string | null;
  selectedDifficulty: number | null;
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  stats: {
    speed: number;
    acceleration: number;
    handling: number;
  };
  image: string;
  color: string;
}

export interface Difficulty {
  id: number;
  name: string;
  description: string;
  multiplier: number;
}

// Sample vehicle data
export const VEHICLES: Vehicle[] = [
  {
    id: 'sport',
    name: 'Sport Bike',
    description: 'Fast and agile, but less sturdy in collisions.',
    stats: {
      speed: 90,
      acceleration: 85,
      handling: 80,
    },
    image: '/images/sport-bike.png',
    color: '#ff4d4d',
  },
  {
    id: 'cruiser',
    name: 'Cruiser',
    description: 'Balanced performance with good collision resistance.',
    stats: {
      speed: 75,
      acceleration: 70,
      handling: 65,
    },
    image: '/images/cruiser.png',
    color: '#3377ff',
  },
  {
    id: 'chopper',
    name: 'Chopper',
    description: 'Slow but sturdy, great for ramming opponents.',
    stats: {
      speed: 60,
      acceleration: 55,
      handling: 50,
    },
    image: '/images/chopper.png',
    color: '#333333',
  },
  {
    id: 'default',
    name: 'Default Bike',
    description: 'Standard bike with balanced stats.',
    stats: {
      speed: 70,
      acceleration: 70,
      handling: 70,
    },
    image: '/images/default-bike.png',
    color: '#00cc44',
  },
];

// Sample difficulty data
export const DIFFICULTIES: Difficulty[] = [
  {
    id: 0,
    name: 'Easy',
    description: 'Relaxed pace, fewer opponents',
    multiplier: 0.8,
  },
  {
    id: 1,
    name: 'Normal',
    description: 'Balanced challenge',
    multiplier: 1.0,
  },
  {
    id: 2,
    name: 'Hard',
    description: 'Fast-paced, aggressive opponents',
    multiplier: 1.2,
  },
];
