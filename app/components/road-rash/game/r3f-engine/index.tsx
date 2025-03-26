'use client';

import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import {
  useKeyboardControls,
  useGLTF,
  Box,
  KeyboardControls,
  Environment,
  useTexture,
  Stars,
  Cloud,
  Text3D,
  Billboard,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// Define controls schema
const controls = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'attack', keys: ['Space'] },
] satisfies { name: string; keys: string[] }[];

// Define game state interface
interface GameState {
  playerSpeed: number;
  playerHealth: number;
  time: number;
  position: number;
  score: number;
  gameOver: boolean;
  raceFinished: boolean;
  playerDistance: number;
  maxSpeed: number;
}

// Custom components
const Road: React.FC<{ length?: number }> = ({ length = 1000 }) => {
  const texture = useLoader(THREE.TextureLoader, '/textures/road/asphalt-diffuse.jpg');
  const normalMap = useLoader(THREE.TextureLoader, '/textures/road/asphalt-normal.jpg');
  const roughnessMap = useLoader(THREE.TextureLoader, '/textures/road/asphalt-roughness.jpg');

  // Apply texture repetition
  useMemo(() => {
    [texture, normalMap, roughnessMap].forEach((map) => {
      if (map) {
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(4, length / 10);
      }
    });
  }, [texture, normalMap, roughnessMap, length]);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[20, length]} />
      <meshStandardMaterial map={texture} normalMap={normalMap} roughnessMap={roughnessMap} envMapIntensity={0.5} />
    </mesh>
  );
};

interface MountainProps {
  position: THREE.Vector3 | [number, number, number];
  scale?: number;
}

const Mountain: React.FC<MountainProps> = ({ position, scale = 1 }) => {
  const mountainColor = new THREE.Color(0x6b8e23); // Olive green base
  const snowColor = new THREE.Color(0xffffff); // Snow caps

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Main mountain body */}
      <mesh castShadow receiveShadow>
        <coneGeometry args={[20, 30, 4]} />
        <meshStandardMaterial
          color={mountainColor}
          roughness={0.8}
          vertexColors
          onBeforeCompile={(shader) => {
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
              varying vec3 vPos;`
            );
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
              vPos = position;`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
              varying vec3 vPos;
              
              vec3 mix_color(vec3 col1, vec3 col2, float t) {
                return col1 * (1.0 - t) + col2 * t;
              }`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <color_fragment>',
              `#include <color_fragment>
              float snow = smoothstep(0.6, 0.8, vPos.y / 30.0);
              diffuseColor.rgb = mix_color(diffuseColor.rgb, vec3(1.0), snow);`
            );
          }}
        />
      </mesh>
    </group>
  );
};

interface TreeProps {
  position: THREE.Vector3 | [number, number, number];
}

const Tree: React.FC<TreeProps> = ({ position }) => {
  // Ghibli-style colors
  const leafColor = new THREE.Color(0x90ee90); // Light green
  const darkLeafColor = new THREE.Color(0x228b22); // Forest green
  const trunkColor = new THREE.Color(0x8b4513); // Saddle brown

  return (
    <group position={position} scale={[2, 2, 2]}>
      {/* Trunk with Ghibli style gradient */}
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 4]} />
        <meshStandardMaterial color={trunkColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Ghibli-style foliage - multiple layers of soft, rounded shapes */}
      <group position={[0, 4.5, 0]}>
        {/* Base layer - larger and darker */}
        <mesh castShadow position={[0, -0.5, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial color={darkLeafColor} roughness={0.8} metalness={0.1} flatShading />
        </mesh>

        {/* Middle layer */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <sphereGeometry args={[1.7, 16, 16]} />
          <meshStandardMaterial color={leafColor} roughness={0.7} metalness={0.1} flatShading />
        </mesh>

        {/* Top layer - smallest and brightest */}
        <mesh castShadow position={[0, 1, 0]}>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshStandardMaterial color={leafColor} roughness={0.6} metalness={0.1} flatShading />
        </mesh>
      </group>
    </group>
  );
};

interface BikeProps {
  color?: number;
  isPlayer?: boolean;
  position?: THREE.Vector3 | [number, number, number];
  rotation?: number;
}

const Bike: React.FC<BikeProps> = ({ color = 0x00ff00, isPlayer = false, position = [0, 0, 0], rotation = 0 }) => {
  const bikeRef = useRef<THREE.Group>(null);

  return (
    <group ref={bikeRef} position={position} rotation-y={rotation}>
      {/* Bike body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wheels */}
      <group>
        {[0.7, -0.7].map((zPos, i) => (
          <mesh key={i} castShadow receiveShadow position={[0, -0.25, zPos]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.5} />
          </mesh>
        ))}
      </group>
      {/* Handlebars */}
      <mesh castShadow position={[0, 0.3, 0.7]}>
        <boxGeometry args={[0.8, 0.1, 0.1]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Headlight */}
      {isPlayer && <pointLight position={[0, 0.3, 1]} intensity={1} distance={10} color={0xffffff} castShadow />}
    </group>
  );
};

interface EnvironmentObject {
  position: THREE.Vector3;
  isTree: boolean;
  isMountain: boolean;
  scale?: number;
}

const EnvironmentSetup: React.FC = () => {
  // Create a warm sunset color
  const sunsetColor = new THREE.Color(0xff7f50); // Coral orange color
  const skyColor = new THREE.Color(0x1e90ff); // Dodger blue for sky
  const groundColor = new THREE.Color(0x4a4a4a); // Darker ground color

  return (
    <>
      {/* Custom sky with sun */}
      <mesh position={[0, -50, 1000]} scale={[2000, 1000, 1]}>
        <planeGeometry />
        <meshBasicMaterial color={sunsetColor} />
      </mesh>

      {/* Sun glow */}
      <mesh position={[0, 50, 800]} scale={100}>
        <sphereGeometry />
        <meshBasicMaterial color={sunsetColor} transparent opacity={0.8} />
      </mesh>

      {/* Actual sun */}
      <mesh position={[0, 50, 800]} scale={80}>
        <sphereGeometry />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Atmospheric effects */}
      <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />
      <Cloud position={[20, 30, -100]} speed={0.2} opacity={0.3} color={sunsetColor} />
      <Cloud position={[-20, 25, -80]} speed={0.2} opacity={0.3} color={sunsetColor} />

      {/* Lighting */}
      <hemisphereLight intensity={0.3} color={skyColor} groundColor={groundColor} />
      <directionalLight
        position={[0, 50, 800]}
        intensity={1.5}
        color={sunsetColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={1000}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Ambient fill light */}
      <ambientLight intensity={0.2} color={sunsetColor} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#ff7f50', 100, 1000]} />
    </>
  );
};

interface RoadRashGameProps {
  difficulty: number;
  vehicleId: string;
  playerName: string;
  onGameStateUpdate: (state: GameState) => void;
  isPaused: boolean;
}

interface PlayerState {
  position: THREE.Vector3;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  health: number;
  distance: number;
  rotation: number;
}

interface OpponentState {
  position: THREE.Vector3;
  speed: number;
  health: number;
  model: THREE.Group;
}

const GameScene: React.FC<RoadRashGameProps> = ({ difficulty, vehicleId, playerName, onGameStateUpdate, isPaused }) => {
  const gameRef = useRef<THREE.Group>(null);
  const roadRef = useRef<THREE.Mesh>(null);
  const playerRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Player state
  const [player, setPlayer] = useState<PlayerState>({
    position: new THREE.Vector3(0, 0.5, 0),
    speed: 0,
    acceleration: 20 + difficulty * 5,
    maxSpeed: 200 + difficulty * 30,
    health: 100,
    distance: 0,
    rotation: 0,
  });

  // Opponents state
  const [opponents, setOpponents] = useState<OpponentState[]>(() => {
    const opponentCount = 3 + difficulty;
    return Array.from({ length: opponentCount }, (_, i) => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 16, 0, 20 + i * 20),
      speed: 80 + Math.random() * 40 + difficulty * 20,
      health: 100,
      model: new THREE.Group(),
    }));
  });

  // Environment objects with mountains
  const environmentObjects = useMemo(() => {
    const objects: EnvironmentObject[] = [];
    const objectCount = 50;
    const mountainCount = 20;

    // Add mountains in the background
    for (let i = 0; i < mountainCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const distance = 100 + Math.random() * 400;
      const position = new THREE.Vector3((30 + Math.random() * 20) * side, -5, -200 + i * 50 + Math.random() * 30);
      objects.push({
        position,
        isTree: false,
        isMountain: true,
        scale: 1 + Math.random() * 0.5,
      });
    }

    // Add trees and other objects
    for (let i = 0; i < objectCount; i++) {
      const isTree = Math.random() > 0.3;
      const side = Math.random() > 0.5 ? 1 : -1;
      const position = new THREE.Vector3((15 + Math.random() * 10) * side, 0, Math.random() * 1000 - 500);
      objects.push({ position, isTree, isMountain: false });
    }
    return objects;
  }, []);

  // Game update logic
  useFrame((state, delta) => {
    if (isPaused || !gameRef.current) return;

    const keys = getKeys();

    // Update player position and state based on keyboard input
    if (keys.forward) {
      setPlayer((prev) => ({
        ...prev,
        speed: Math.min(prev.speed + prev.acceleration * delta, prev.maxSpeed),
        position: prev.position.clone().add(new THREE.Vector3(0, 0, prev.speed * delta * 0.1)),
        distance: prev.distance + prev.speed * delta,
      }));
    } else {
      setPlayer((prev) => ({
        ...prev,
        speed: Math.max(prev.speed - prev.acceleration * delta * 0.5, 0),
      }));
    }

    if (keys.backward) {
      setPlayer((prev) => ({
        ...prev,
        speed: Math.max(0, prev.speed - prev.acceleration * delta * 2),
        position: prev.position.clone().add(new THREE.Vector3(0, 0, -prev.speed * delta * 0.1)),
        distance: prev.distance - prev.speed * delta,
      }));
    }

    if (keys.left) {
      setPlayer((prev) => ({
        ...prev,
        rotation: prev.rotation + delta * (2 + prev.speed * 0.02),
        position: prev.position.clone().add(new THREE.Vector3(-prev.speed * delta * 0.05, 0, 0)),
      }));
    }

    if (keys.right) {
      setPlayer((prev) => ({
        ...prev,
        rotation: prev.rotation - delta * (2 + prev.speed * 0.02),
        position: prev.position.clone().add(new THREE.Vector3(prev.speed * delta * 0.05, 0, 0)),
      }));
    }

    // Update camera to follow player
    if (cameraRef.current) {
      const cameraOffset = new THREE.Vector3(0, 3, -8);
      const targetPosition = player.position.clone().add(cameraOffset);
      cameraRef.current.position.lerp(targetPosition, 0.1);
      cameraRef.current.lookAt(player.position.clone().add(new THREE.Vector3(0, 0, 10)));
    }

    // Update opponents
    setOpponents((prev) =>
      prev.map((opponent) => {
        const newPos = opponent.position.clone();
        newPos.z += opponent.speed * delta;
        return { ...opponent, position: newPos };
      })
    );

    // Update game state
    onGameStateUpdate({
      playerSpeed: player.speed,
      playerHealth: player.health,
      time: 180, // 3 minutes
      position: calculatePlayerPosition(),
      score: Math.floor(player.distance / 10),
      gameOver: player.health <= 0,
      raceFinished: false,
      playerDistance: player.distance,
      maxSpeed: player.maxSpeed,
    });
  });

  // Calculate player's position in the race (1st, 2nd, etc.)
  const calculatePlayerPosition = (): number => {
    let position = 1;
    const playerZ = player.position.z;

    opponents.forEach((opponent) => {
      if (opponent.position.z > playerZ) {
        position++;
      }
    });

    return position;
  };

  // Add collision detection
  useEffect(() => {
    if (!playerRef.current) return;

    const checkCollisions = () => {
      const playerPos = player.position;

      // Road boundaries
      const roadWidth = 10; // Half of the total road width
      if (Math.abs(playerPos.x) > roadWidth) {
        setPlayer((prev) => ({
          ...prev,
          position: new THREE.Vector3(Math.sign(playerPos.x) * roadWidth, playerPos.y, playerPos.z),
          speed: prev.speed * 0.5, // Slow down on collision
        }));
      }
    };

    return () => {
      // Cleanup if needed
    };
  }, [player.position]);

  return (
    <group ref={gameRef}>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 3, -8]} fov={75} near={0.1} far={1000} />
      <Suspense fallback={null}>
        <EnvironmentSetup />
        <Road length={1000} />
        {environmentObjects.map((obj, index) => {
          if (obj.isMountain) {
            return <Mountain key={`mountain-${index}`} position={obj.position} scale={obj.scale} />;
          }
          if (obj.isTree) {
            return <Tree key={`tree-${index}`} position={obj.position} />;
          }
          return (
            <mesh key={`object-${index}`} position={obj.position} castShadow receiveShadow>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#8b4513" roughness={0.8} />
            </mesh>
          );
        })}
        <Bike isPlayer color={0x00ff00} position={[player.position.x, player.position.y, player.position.z]} rotation={player.rotation} />
        {opponents.map((opponent, index) => (
          <Bike key={index} color={0xff0000} position={[opponent.position.x, opponent.position.y, opponent.position.z]} />
        ))}
      </Suspense>
    </group>
  );
};

export const RoadRashGame: React.FC<RoadRashGameProps> = (props) => {
  return (
    <KeyboardControls map={controls}>
      <GameScene {...props} />
    </KeyboardControls>
  );
};
