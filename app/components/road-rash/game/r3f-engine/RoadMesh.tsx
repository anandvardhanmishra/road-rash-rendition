'use client';

import React, { forwardRef, useRef, useImperativeHandle, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { RoadController, RoadType } from './types';

interface RoadMeshProps {
  difficulty?: number;
}

export const RoadMesh = forwardRef<THREE.Group, RoadMeshProps>(({ difficulty = 1 }, ref) => {
  // Local refs
  const groupRef = useRef<THREE.Group>(null);
  const roadRef = useRef<THREE.Mesh>(null);
  const roadMarkingsRef = useRef<THREE.Group>(null);
  const textureOffset = useRef({ value: 0 });

  // Road settings based on difficulty
  const [roadSettings] = useState(() => {
    return {
      width: 10,
      length: 1000 + difficulty * 500, // Longer road for higher difficulty
      type: difficulty > 2 ? RoadType.CITY : RoadType.BEACH, // Beach for easier, city for harder
      obstacles: difficulty * 5, // More obstacles at higher difficulty
      curves: difficulty * 2, // More curves at higher difficulty
    };
  });

  // Load textures
  const roadTexture = useTexture('/textures/road.jpg');
  const sandTexture = useTexture('/textures/sand.jpg');

  // Configure textures
  useMemo(() => {
    if (roadTexture) {
      roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
      roadTexture.repeat.set(1, 50);
    }

    if (sandTexture) {
      sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
      sandTexture.repeat.set(20, 20);
    }
  }, [roadTexture, sandTexture]);

  // Expose the road controller to parent components
  useImperativeHandle(
    ref,
    () => {
      const group = groupRef.current!;

      // Attach controller to userData for access in the game system
      group.userData.controller = createRoadController();

      return group;
    },
    []
  );

  // Create a controller for the road
  const createRoadController = (): RoadController => {
    return {
      update: (deltaTime, playerSpeed) => {
        // Animate road texture based on player speed
        if (roadTexture) {
          const speedFactor = playerSpeed / 100; // Normalize speed
          textureOffset.current.value += speedFactor * deltaTime * 0.5;
          roadTexture.offset.y = textureOffset.current.value;
        }
      },
    };
  };

  // Create trees along the road
  const createTrees = () => {
    const trees = [];
    const treeCount = 100;

    for (let i = 0; i < treeCount; i++) {
      // Decide which side of the road to place the tree
      const side = Math.random() > 0.5 ? 1 : -1;

      // Calculate position
      const distanceFromRoad = roadSettings.width / 2 + 5 + Math.random() * 15;
      const distanceAlongRoad = i * (roadSettings.length / treeCount);
      const position = [side * distanceFromRoad, 0, distanceAlongRoad];

      // Randomize tree size
      const scale = 0.8 + Math.random() * 0.5;

      // Create a random tree color variation (green)
      const treeColor = new THREE.Color(0.2 + Math.random() * 0.1, 0.5 + Math.random() * 0.3, 0.2 + Math.random() * 0.1);

      trees.push(
        <group key={`tree-${i}`} position={position as any} scale={[scale, scale, scale]}>
          {/* Tree trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.8, 4, 8]} />
            <meshStandardMaterial color="#8b4513" roughness={0.9} />
          </mesh>

          {/* Tree top */}
          <mesh position={[0, 5, 0]} castShadow>
            <sphereGeometry args={[3, 8, 8]} />
            <meshStandardMaterial color={treeColor} roughness={1.0} />
          </mesh>

          {/* Add a second sphere for fuller look */}
          <mesh position={[1, 4, 0]} castShadow>
            <sphereGeometry args={[2.5, 8, 8]} />
            <meshStandardMaterial color={treeColor} roughness={1.0} />
          </mesh>

          <mesh position={[-0.5, 4.5, 1]} castShadow>
            <sphereGeometry args={[2.2, 8, 8]} />
            <meshStandardMaterial color={treeColor} roughness={1.0} />
          </mesh>
        </group>
      );
    }

    // Add palm trees for beach environment
    if (roadSettings.type === RoadType.BEACH) {
      const palmCount = 20;

      for (let i = 0; i < palmCount; i++) {
        // Position far away on one side (ocean side)
        const position = [50 + Math.random() * 30, 0, i * (roadSettings.length / palmCount)];

        trees.push(
          <group key={`palm-${i}`} position={position as any}>
            {/* Trunk */}
            <mesh position={[0, 4, 0]} rotation={[0, 0, Math.random() * 0.2 - 0.1]} castShadow>
              <cylinderGeometry args={[0.5, 0.7, 8, 8]} />
              <meshStandardMaterial color="#a0522d" roughness={0.9} />
            </mesh>

            {/* Palm leaves */}
            {Array.from({ length: 7 }).map((_, j) => (
              <mesh key={`leaf-${j}`} position={[0, 8, 0]} rotation={[-Math.PI / 4, j * ((Math.PI * 2) / 7), 0]} castShadow>
                <coneGeometry args={[0.3, 4, 4]} />
                <meshStandardMaterial color="#3a5f0b" side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        );
      }
    }

    return trees;
  };

  // Create road markings
  const createRoadMarkings = () => {
    const markings = [];

    // Add center line
    markings.push(
      <mesh key="center-line" position={[0, 0.01, roadSettings.length / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.2, roadSettings.length]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    );

    // Add dashed side lines
    const dashLength = 3;
    const dashGap = 2;
    const dashesPerSide = Math.floor(roadSettings.length / (dashLength + dashGap));

    for (let i = 0; i < dashesPerSide; i++) {
      const dashZ = i * (dashLength + dashGap);

      // Left side dash
      markings.push(
        <mesh key={`left-dash-${i}`} position={[-roadSettings.width / 2 + 0.5, 0.01, dashZ + dashLength / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.2, dashLength]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      );

      // Right side dash
      markings.push(
        <mesh key={`right-dash-${i}`} position={[roadSettings.width / 2 - 0.5, 0.01, dashZ + dashLength / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.2, dashLength]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      );
    }

    return markings;
  };

  return (
    <group ref={groupRef}>
      {/* Sand/ground plane */}
      <mesh position={[0, -0.1, roadSettings.length / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial map={sandTexture} color="#f5deb3" roughness={1.0} />
      </mesh>

      {/* Road */}
      <mesh ref={roadRef} position={[0, 0, roadSettings.length / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadSettings.width, roadSettings.length]} />
        <meshStandardMaterial map={roadTexture} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Road markings */}
      <group ref={roadMarkingsRef}>{createRoadMarkings()}</group>

      {/* Scenery */}
      <group>{createTrees()}</group>

      {/* Ocean for beach environment */}
      {roadSettings.type === RoadType.BEACH && (
        <mesh position={[500, -0.5, roadSettings.length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2000, 2000, 8, 8]} />
          <meshStandardMaterial color="#0077be" transparent opacity={0.8} metalness={0.2} roughness={0.1} />
        </mesh>
      )}
    </group>
  );
});
