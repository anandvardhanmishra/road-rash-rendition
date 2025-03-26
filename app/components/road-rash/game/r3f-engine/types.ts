import * as THREE from 'three';

export interface GameState {
  playerSpeed: number;
  playerDistance: number;
  playerHealth: number;
  position: number; // Race position (1st, 2nd, etc.)
  time: number; // Remaining time in seconds
  score: number;
  gameOver: boolean;
  raceFinished: boolean;
}

export interface BikeController {
  handleInput: (forward: boolean, backward: boolean, left: boolean, right: boolean, attack: boolean) => void;
  update: (deltaTime: number) => void;
  getSpeed: () => number;
  getHealth: () => number;
  getDistanceTraveled: () => number;
  applyCollisionEffect: (force: number) => void;
}

export interface RoadController {
  update: (deltaTime: number, playerSpeed: number) => void;
}

export interface OpponentController {
  update: (deltaTime: number, playerPosition: THREE.Vector3, playerSpeed: number) => void;
  getSpeed: () => number;
  applyCollisionEffect: (force: number) => void;
}

export interface BikeStats {
  speed: number;
  acceleration: number;
  handling: number;
  durability: number;
}

export enum BikeState {
  NORMAL,
  ATTACKING,
  CRASHED,
  RECOVERING,
}

export enum RoadType {
  BEACH,
  CITY,
  MOUNTAIN,
}
