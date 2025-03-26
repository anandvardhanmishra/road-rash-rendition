'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, KeyboardControls } from '@react-three/drei';
import { RoadRashGame } from './r3f-engine';
import { GameConfig } from '../types';
import styles from './GameCanvas.module.css';

interface R3fGameCanvasProps {
  gameConfig: GameConfig;
  onGameStateUpdate: (state: any) => void;
  isPaused?: boolean;
}

export const R3fGameCanvas: React.FC<R3fGameCanvasProps> = ({ gameConfig, onGameStateUpdate, isPaused = false }) => {
  // Set up controls mapping
  const keyMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'attack', keys: ['Space'] },
  ];

  // Time of day state for sky
  const [timeOfDay, setTimeOfDay] = useState(0.7); // 0-1 range, 0.5 = noon

  // Update time of day
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeOfDay((prev) => {
        const next = prev + 0.0001;
        return next >= 1 ? 0 : next;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Calculate sun position based on time of day
  const getSunPosition = () => {
    const angle = timeOfDay * Math.PI * 2 - Math.PI / 2;
    const height = Math.sin(angle) * 0.8 + 0.2; // 0.2-1.0 range
    const x = Math.cos(angle) * 500;
    const y = Math.max(50, height * 500); // Keep sun above horizon
    return [x, y, 0];
  };

  return (
    <div className={styles.gameCanvasContainer}>
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ position: [0, 5, -10], fov: 75, near: 0.1, far: 10000 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: 1, // ACESFilmicToneMapping
            toneMappingExposure: 1.2,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Dynamic sky with sun position based on time of day */}
          <Sky
            distance={450000}
            sunPosition={getSunPosition() as [number, number, number]}
            inclination={Math.max(0.01, timeOfDay)}
            azimuth={0.25}
            rayleigh={1.0 - Math.abs(timeOfDay - 0.5) * 0.8} // More blue at noon
          />

          {/* Ambient light that changes with time of day */}
          <ambientLight intensity={0.3 + timeOfDay * 0.5} />

          {/* Directional light (sun) that follows sun position */}
          <directionalLight
            position={getSunPosition() as [number, number, number]}
            intensity={0.8 + timeOfDay * 0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={500}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />

          {/* Game component */}
          <RoadRashGame
            difficulty={gameConfig.selectedDifficulty !== null ? gameConfig.selectedDifficulty : 1}
            vehicleId={gameConfig.selectedVehicle || 'default'}
            playerName={gameConfig.racerName || 'Player'}
            onGameStateUpdate={onGameStateUpdate}
            isPaused={isPaused}
          />

          {/* Debug controls - commented out for production */}
          {/* <OrbitControls /> */}
        </Canvas>
      </KeyboardControls>
    </div>
  );
};
