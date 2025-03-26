'use client';

import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { VEHICLES } from '../../types';
import { BikeController, BikeState, BikeStats } from './types';

interface PlayerBikeProps {
  vehicleId: string;
  position?: [number, number, number];
}

export const PlayerBike = forwardRef<THREE.Group, PlayerBikeProps>(({ vehicleId = 'default', position = [0, 0, 0] }, ref) => {
  // Local refs
  const bikeRef = useRef<THREE.Group>(null);
  const bikeBodyRef = useRef<THREE.Mesh>(null);
  const frontWheelRef = useRef<THREE.Mesh>(null);
  const rearWheelRef = useRef<THREE.Mesh>(null);

  // Find bike data from vehicleId
  const bikeData = VEHICLES.find((v) => v.id === vehicleId) || VEHICLES[0];

  // Bike state
  const state = useRef({
    speed: 0,
    maxSpeed: 200, // km/h
    acceleration: 50, // km/h per second
    deceleration: 20, // Natural deceleration when not accelerating
    brakingForce: 100, // Braking deceleration
    turnSpeed: 2.0, // Turning rate
    health: 100,
    distanceTraveled: 0,
    bikeState: BikeState.NORMAL,
    isAccelerating: false,
    isBraking: false,
    isTurningLeft: false,
    isTurningRight: false,
    isAttacking: false,
    attackCooldown: 0,
    recoveryTimer: 0,
  });

  // Configure bike stats based on selected vehicle
  useEffect(() => {
    // Get bike stats based on vehicleId
    const stats: BikeStats = {
      speed: bikeData.stats.speed,
      acceleration: bikeData.stats.acceleration,
      handling: bikeData.stats.handling,
      durability: bikeData.stats.durability,
    };

    // Apply stats to bike
    state.current.maxSpeed = 150 + stats.speed * 10; // 150-200 km/h
    state.current.acceleration = 30 + stats.acceleration * 5; // 30-50 km/h per second
    state.current.turnSpeed = 1.5 + stats.handling * 0.1; // 1.5-2.0 turning rate
    state.current.brakingForce = 80 + stats.handling * 5; // 80-100 braking force
  }, [vehicleId, bikeData]);

  // Expose the bike controller to parent components
  useImperativeHandle(
    ref,
    () => {
      const group = bikeRef.current!;

      // Attach controller to userData for access in the game system
      group.userData.controller = createBikeController();

      return group;
    },
    []
  );

  // Create a controller for the bike
  const createBikeController = (): BikeController => {
    return {
      handleInput: (forward, backward, left, right, attack) => {
        state.current.isAccelerating = forward;
        state.current.isBraking = backward;
        state.current.isTurningLeft = left;
        state.current.isTurningRight = right;

        // Handle attack with cooldown
        if (attack && state.current.attackCooldown <= 0) {
          state.current.isAttacking = true;
          state.current.attackCooldown = 1.0; // 1 second cooldown
          state.current.bikeState = BikeState.ATTACKING;
        }
      },

      update: (deltaTime) => {
        // Update attack cooldown
        if (state.current.attackCooldown > 0) {
          state.current.attackCooldown -= deltaTime;

          // Reset attack state after a short duration
          if (state.current.isAttacking && state.current.attackCooldown < 0.8) {
            state.current.isAttacking = false;

            if (state.current.bikeState === BikeState.ATTACKING) {
              state.current.bikeState = BikeState.NORMAL;
            }
          }
        }

        // Handle crashed state recovery
        if (state.current.bikeState === BikeState.CRASHED) {
          state.current.recoveryTimer -= deltaTime;

          if (state.current.recoveryTimer <= 0) {
            state.current.bikeState = BikeState.NORMAL;
            state.current.speed = Math.min(state.current.speed, 20); // Limit speed after recovery
          }

          // Limit input while crashed
          return;
        }

        // Apply physics
        updatePhysics(deltaTime);

        // Update distance traveled
        state.current.distanceTraveled += (state.current.speed * deltaTime) / 3.6; // Convert km/h to m/s

        // Update wheels rotation based on speed
        if (frontWheelRef.current && rearWheelRef.current) {
          const wheelRotationSpeed = state.current.speed / 20;
          frontWheelRef.current.rotation.x += wheelRotationSpeed * deltaTime * 10;
          rearWheelRef.current.rotation.x += wheelRotationSpeed * deltaTime * 10;
        }

        // Apply lean effect when turning
        if (bikeBodyRef.current) {
          if (state.current.isTurningLeft) {
            bikeBodyRef.current.rotation.z = THREE.MathUtils.lerp(
              bikeBodyRef.current.rotation.z,
              0.2, // Max lean angle
              5 * deltaTime
            );
          } else if (state.current.isTurningRight) {
            bikeBodyRef.current.rotation.z = THREE.MathUtils.lerp(
              bikeBodyRef.current.rotation.z,
              -0.2, // Max lean angle
              5 * deltaTime
            );
          } else {
            bikeBodyRef.current.rotation.z = THREE.MathUtils.lerp(bikeBodyRef.current.rotation.z, 0, 3 * deltaTime);
          }
        }
      },

      getSpeed: () => state.current.speed,
      getHealth: () => state.current.health,
      getDistanceTraveled: () => state.current.distanceTraveled,

      applyCollisionEffect: (force) => {
        // Reduce health based on collision force and bike durability
        const damageMultiplier = 1 - bikeData.stats.durability * 0.1; // 0.6-1.0
        state.current.health -= force * 0.2 * damageMultiplier;
        state.current.health = Math.max(0, state.current.health);

        // Reduce speed
        state.current.speed -= force * 0.5;
        state.current.speed = Math.max(0, state.current.speed);

        // Enter crashed state if strong impact
        if (force > 50 || state.current.health <= 0) {
          state.current.bikeState = BikeState.CRASHED;
          state.current.recoveryTimer = 3; // 3 seconds to recover

          // Visual indicator for crash
          if (bikeBodyRef.current) {
            bikeBodyRef.current.rotation.z = Math.random() > 0.5 ? 0.5 : -0.5; // Tilt the bike
          }
        }
      },
    };
  };

  // Update bike physics
  const updatePhysics = (deltaTime: number) => {
    // Skip physics if crashed
    if (state.current.bikeState === BikeState.CRASHED) return;

    // Handle acceleration
    if (state.current.isAccelerating) {
      state.current.speed += state.current.acceleration * deltaTime;
      state.current.speed = Math.min(state.current.speed, state.current.maxSpeed);
    } else if (state.current.isBraking) {
      state.current.speed -= state.current.brakingForce * deltaTime;
      state.current.speed = Math.max(state.current.speed, 0);
    } else {
      // Natural deceleration
      state.current.speed -= state.current.deceleration * deltaTime;
      state.current.speed = Math.max(state.current.speed, 0);
    }

    // Apply turning based on speed (harder to turn at high speeds)
    const turnFactor = Math.max(0.3, 1 - (state.current.speed / state.current.maxSpeed) * 0.7);

    if (state.current.isTurningLeft) {
      bikeRef.current.rotation.y += state.current.turnSpeed * turnFactor * deltaTime;
    } else if (state.current.isTurningRight) {
      bikeRef.current.rotation.y -= state.current.turnSpeed * turnFactor * deltaTime;
    }

    // Calculate movement direction and velocity
    const moveDirection = new THREE.Vector3(0, 0, 1).applyEuler(bikeRef.current.rotation);
    const velocity = moveDirection.multiplyScalar((state.current.speed * deltaTime) / 3.6); // Convert km/h to m/s

    // Update position
    bikeRef.current.position.add(velocity);

    // Keep bike on the road (limit X position)
    bikeRef.current.position.x = THREE.MathUtils.clamp(bikeRef.current.position.x, -5, 5);
  };

  // Create bike mesh
  const createBikeMesh = () => {
    return (
      <group ref={bikeRef} position={position} rotation={[0, 0, 0]}>
        {/* Main body */}
        <mesh ref={bikeBodyRef} position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.4, 0.5, 1.2]} />
          <meshStandardMaterial color={bikeData.color} metalness={0.6} roughness={0.4} />
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

        {/* Handlebars */}
        <mesh position={[0, 0.5, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
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

        {/* Rider arms */}
        <mesh position={[0.25, 0.7, 0.2]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        <mesh position={[-0.25, 0.7, 0.2]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    );
  };

  return createBikeMesh();
});
