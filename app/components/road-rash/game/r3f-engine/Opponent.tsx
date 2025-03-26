'use client';

import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import * as THREE from 'three';
import { BikeState, OpponentController } from './types';

interface OpponentProps {
  difficulty: number;
  initialPosition: [number, number, number];
}

export const Opponent = forwardRef<THREE.Group, OpponentProps>(({ difficulty = 1, initialPosition = [0, 0, 20] }, ref) => {
  // Local refs
  const opponentRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const frontWheelRef = useRef<THREE.Mesh>(null);
  const rearWheelRef = useRef<THREE.Mesh>(null);

  // Generate a random color for this opponent
  const [bikeColor] = useState(() => {
    const colors = ['#ff0000', '#0000ff', '#00ff00', '#800080', '#ffa500', '#ff00ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  // Opponent state
  const state = useRef({
    speed: 100 + Math.random() * 50, // Random starting speed
    maxSpeed: 180 + difficulty * 10, // 180-200 based on difficulty
    acceleration: 40 + difficulty * 5, // 40-50 based on difficulty
    turnSpeed: 1.0 + difficulty * 0.2, // 1.0-1.6 based on difficulty
    health: 100,
    bikeState: BikeState.NORMAL,
    intelligence: 0.3 + difficulty * 0.2, // 0.3-0.7 based on difficulty
    aggressiveness: 0.2 + difficulty * 0.25, // 0.2-0.7 based on difficulty
    attackCooldown: 0,
    attackRange: 1.5, // Distance at which opponent can attack
    recoveryTimer: 0,
  });

  // Expose the opponent controller to parent components
  useImperativeHandle(
    ref,
    () => {
      const group = opponentRef.current!;

      // Attach controller to userData for access in the game system
      group.userData.controller = createOpponentController();

      return group;
    },
    []
  );

  // Create a controller for the opponent
  const createOpponentController = (): OpponentController => {
    return {
      update: (deltaTime, playerPosition, playerSpeed) => {
        // Update attack cooldown
        if (state.current.attackCooldown > 0) {
          state.current.attackCooldown -= deltaTime;
        }

        // Update recovery timer if crashed
        if (state.current.bikeState === BikeState.CRASHED) {
          state.current.recoveryTimer -= deltaTime;
          if (state.current.recoveryTimer <= 0) {
            state.current.bikeState = BikeState.NORMAL;
            state.current.speed = playerSpeed * 0.8; // Recover with some speed
          }

          // Apply visual effect for crashed state
          if (bodyRef.current) {
            bodyRef.current.rotation.z = Math.sin(Date.now() * 0.005) * 0.3;
          }

          return; // Don't update position when crashed
        }

        // AI behavior
        updateAI(deltaTime, playerPosition, playerSpeed);

        // Animate wheels
        if (frontWheelRef.current && rearWheelRef.current) {
          const wheelRotationSpeed = state.current.speed / 20;
          frontWheelRef.current.rotation.x += wheelRotationSpeed * deltaTime * 10;
          rearWheelRef.current.rotation.x += wheelRotationSpeed * deltaTime * 10;
        }
      },

      getSpeed: () => state.current.speed,

      applyCollisionEffect: (force) => {
        // Reduce health based on collision force
        state.current.health -= force * 0.2;
        state.current.health = Math.max(0, state.current.health);

        // Reduce speed
        state.current.speed -= force * 0.5;
        state.current.speed = Math.max(0, state.current.speed);

        // Enter crashed state if strong impact
        if (force > 40 || state.current.health <= 20) {
          state.current.bikeState = BikeState.CRASHED;
          state.current.recoveryTimer = 3 + Math.random() * 2; // 3-5 seconds to recover

          // Visual indicator for crash
          if (bodyRef.current) {
            bodyRef.current.rotation.z = Math.random() > 0.5 ? 0.5 : -0.5; // Tilt the bike
          }
        }
      },
    };
  };

  // AI decision making
  const updateAI = (deltaTime: number, playerPosition: THREE.Vector3, playerSpeed: number) => {
    if (!opponentRef.current) return;

    // Calculate distance to player
    const distanceToPlayer = opponentRef.current.position.distanceTo(playerPosition);

    // Calculate lateral distance (x-axis)
    const lateralDistance = Math.abs(opponentRef.current.position.x - playerPosition.x);

    // Determine if player is ahead or behind
    const playerIsAhead = playerPosition.z > opponentRef.current.position.z;

    // Speed adjustment
    if (playerIsAhead) {
      // Try to catch up if player is ahead
      state.current.speed = Math.min(state.current.speed + state.current.acceleration * deltaTime, state.current.maxSpeed);
    } else if (distanceToPlayer < 5 && Math.random() < state.current.intelligence) {
      // Maintain competitive speed when close to player
      state.current.speed = playerSpeed * (1 + (Math.random() * 0.2 - 0.1)); // Speed ±10% of player
    } else {
      // Normal racing speed
      state.current.speed = state.current.maxSpeed * (0.7 + Math.random() * 0.3); // 70-100% of max speed
    }

    // Lane positioning and path finding
    // Randomly change lanes, with higher probability when intelligence is higher
    if (Math.random() < 0.01 * state.current.intelligence) {
      const targetX = (Math.random() * 2 - 1) * 4; // Random lane between -4 and 4
      const currentX = opponentRef.current.position.x;

      // Calculate angle to target lane
      const angle = Math.atan2(targetX - currentX, 10);
      opponentRef.current.rotation.y = THREE.MathUtils.lerp(opponentRef.current.rotation.y, angle, deltaTime * 2);
    }

    // Calculate direction and velocity
    const moveDirection = new THREE.Vector3(0, 0, 1).applyEuler(opponentRef.current.rotation);
    const velocity = moveDirection.multiplyScalar((state.current.speed * deltaTime) / 3.6); // Convert km/h to m/s

    // Update position
    opponentRef.current.position.add(velocity);

    // Keep opponent on the road
    opponentRef.current.position.x = THREE.MathUtils.clamp(opponentRef.current.position.x, -5, 5);

    // Apply lean effect when turning
    if (bodyRef.current) {
      const turnDirection = Math.sign(opponentRef.current.rotation.y);
      bodyRef.current.rotation.z = THREE.MathUtils.lerp(
        bodyRef.current.rotation.z,
        -turnDirection * 0.2, // Max lean angle
        2 * deltaTime
      );
    }

    // Attacking behavior
    if (
      state.current.attackCooldown <= 0 &&
      distanceToPlayer < state.current.attackRange &&
      lateralDistance < 1 &&
      Math.random() < state.current.aggressiveness * 0.1
    ) {
      // Set attack cooldown
      state.current.attackCooldown = 3 + Math.random() * 2; // 3-5 seconds cooldown

      // Set attacking state briefly
      state.current.bikeState = BikeState.ATTACKING;

      // Reset attack state after a short duration
      setTimeout(() => {
        if (state.current.bikeState === BikeState.ATTACKING) {
          state.current.bikeState = BikeState.NORMAL;
        }
      }, 500);
    }
  };

  return (
    <group ref={opponentRef} position={initialPosition} rotation={[0, 0, 0]}>
      {/* Main body */}
      <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 1.2]} />
        <meshStandardMaterial color={bikeColor} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Front wheel */}
      <mesh ref={frontWheelRef} position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 24]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rear wheel */}
      <mesh ref={rearWheelRef} position={[0, 0, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 24]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rider body */}
      <mesh position={[0, 0.8, -0.1]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Rider head */}
      <mesh position={[0, 1.2, -0.1]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f5d0a9" />
      </mesh>
    </group>
  );
});
