'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { RoadMesh } from './RoadMesh';
import { PlayerBike } from './PlayerBike';
import { Opponent } from './Opponent';
import { CollisionSystem } from './CollisionSystem';
import { GameState } from './types';

interface RoadRashGameProps {
  difficulty: number;
  vehicleId: string;
  playerName: string;
  onGameStateUpdate: (state: GameState) => void;
  isPaused?: boolean;
}

export function RoadRashGame({ difficulty = 1, vehicleId = 'default', playerName = 'Player', onGameStateUpdate, isPaused = false }: RoadRashGameProps) {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    playerSpeed: 0,
    playerDistance: 0,
    playerHealth: 100,
    position: 1,
    time: 180, // 3 minutes
    score: 0,
    gameOver: false,
    raceFinished: false,
  });

  // Game objects
  const roadRef = useRef<THREE.Group>(null);
  const playerRef = useRef<THREE.Group>(null);
  const opponentsRef = useRef<THREE.Group[]>([]);
  const collisionSystemRef = useRef<CollisionSystem>(null);

  // Time tracking
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const startTimeRef = useRef<number>(Date.now());
  const deltaTimeRef = useRef<number>(0);

  // Keyboard controls setup
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Scene setup
  const { camera } = useThree();

  // Initialize opponents
  useEffect(() => {
    // Create opponents based on difficulty
    const opponentCount = 3 + difficulty * 2; // 3-7 opponents based on difficulty
    opponentsRef.current = Array(opponentCount).fill(null);

    // Initialize collision system
    collisionSystemRef.current = new CollisionSystem();

    // Start clock
    clockRef.current.start();
    startTimeRef.current = Date.now();

    return () => {
      clockRef.current.stop();
    };
  }, [difficulty]);

  // Update game logic on each frame
  useFrame((state, delta) => {
    if (isPaused) return;

    deltaTimeRef.current = delta;

    // Get current controls state
    const { forward, backward, left, right, attack } = getKeys();

    // Update player
    if (playerRef.current) {
      // Apply input controls
      const playerController = playerRef.current.userData.controller;
      playerController.handleInput(forward, backward, left, right, attack);

      // Update player physics
      playerController.update(delta);

      // Update camera to follow player
      updateCamera(playerRef.current.position);

      // Update remaining time
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
      const remainingTime = Math.max(0, 180 - elapsedTime);

      // Check for victory condition (distance > 2000 meters)
      const isRaceFinished = playerController.getDistanceTraveled() >= 2000;

      // Update game state
      const newGameState: GameState = {
        playerSpeed: playerController.getSpeed(),
        playerDistance: playerController.getDistanceTraveled(),
        playerHealth: playerController.getHealth(),
        position: calculatePlayerPosition(),
        time: remainingTime,
        score: calculateScore(playerController.getDistanceTraveled(), calculatePlayerPosition()),
        gameOver: playerController.getHealth() <= 0 || remainingTime <= 0 || isRaceFinished,
        raceFinished: isRaceFinished,
      };

      setGameState(newGameState);
      onGameStateUpdate(newGameState);
    }

    // Update opponents
    if (opponentsRef.current && playerRef.current) {
      const playerPosition = playerRef.current.position.clone();
      const playerSpeed = playerRef.current.userData.controller.getSpeed();

      opponentsRef.current.forEach((opponent, index) => {
        if (opponent && opponent.userData.controller) {
          opponent.userData.controller.update(delta, playerPosition, playerSpeed);
        }
      });
    }

    // Check collisions
    if (playerRef.current && opponentsRef.current && collisionSystemRef.current) {
      checkAndResolveCollisions();
    }

    // Update road
    if (roadRef.current && playerRef.current) {
      const playerSpeed = playerRef.current.userData.controller.getSpeed();
      roadRef.current.userData.controller.update(delta, playerSpeed);
    }
  });

  // Update camera position to follow player
  const updateCamera = (playerPosition: THREE.Vector3) => {
    if (!camera) return;

    // Position camera behind and above player
    camera.position.set(playerPosition.x, playerPosition.y + 5, playerPosition.z - 10);

    // Look at a point ahead of the player
    camera.lookAt(playerPosition.x, playerPosition.y, playerPosition.z + 10);
  };

  // Check and resolve collisions between player and opponents
  const checkAndResolveCollisions = () => {
    if (!playerRef.current || !collisionSystemRef.current) return;

    const playerBike = playerRef.current;

    opponentsRef.current.forEach((opponent) => {
      if (!opponent) return;

      // Check for collision
      const isColliding = collisionSystemRef.current.checkCollision(playerBike, opponent);

      if (isColliding) {
        // Get collision force based on relative speed
        const playerSpeed = playerBike.userData.controller.getSpeed();
        const opponentSpeed = opponent.userData.controller.getSpeed();
        const relativeSpeed = Math.abs(playerSpeed - opponentSpeed);
        const collisionForce = relativeSpeed * 0.5;

        // Apply collision effects to both objects
        playerBike.userData.controller.applyCollisionEffect(collisionForce);
        opponent.userData.controller.applyCollisionEffect(collisionForce);
      }
    });
  };

  // Calculate player's position in the race (1st, 2nd, etc.)
  const calculatePlayerPosition = (): number => {
    if (!playerRef.current) return 1;

    let position = 1;
    const playerZ = playerRef.current.position.z;

    opponentsRef.current.forEach((opponent) => {
      if (opponent && opponent.position.z > playerZ) {
        position++;
      }
    });

    return position;
  };

  // Calculate score based on distance and position
  const calculateScore = (distance: number, position: number): number => {
    return Math.floor(distance / 10 + (6 - position) * 30);
  };

  return (
    <group>
      {/* Road environment */}
      <RoadMesh ref={roadRef} difficulty={difficulty} />

      {/* Player bike */}
      <PlayerBike ref={playerRef} vehicleId={vehicleId} position={[0, 0, 0]} />

      {/* Opponents */}
      {Array.from({ length: 3 + difficulty * 2 }).map((_, index) => (
        <Opponent
          key={`opponent-${index}`}
          ref={(el) => {
            if (el) opponentsRef.current[index] = el;
          }}
          difficulty={difficulty}
          initialPosition={[
            (Math.random() - 0.5) * 6, // Random x position
            0,
            20 + index * 15, // Spread out along the z-axis
          ]}
        />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />

      {/* Directional light (sun) */}
      <directionalLight
        position={[100, 100, 50]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={500}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
    </group>
  );
}
