'use client';

import { useState, useEffect } from 'react';
import {
  RetroBackground,
  GameTitle,
  RacerNameInput,
  VehicleSelector,
  DifficultySelector,
  StartRaceButton,
  DecorationIcons,
  RetroStyles,
  GameConfig,
  VEHICLES,
  DIFFICULTIES,
} from '@/components/road-rash';
import { Game } from '@/components/road-rash/game';

// Main Component
export default function RacingGameSetup() {
  // State
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    racerName: '',
    selectedVehicle: null,
    selectedDifficulty: null,
  });
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Glitch effect handler
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Event handlers
  const updateRacerName = (name: string) => {
    setGameConfig((prev) => ({ ...prev, racerName: name }));
  };

  const selectVehicle = (vehicleId: string) => {
    setGameConfig((prev) => ({ ...prev, selectedVehicle: vehicleId }));
  };

  const selectDifficulty = (difficultyIndex: number) => {
    setGameConfig((prev) => ({ ...prev, selectedDifficulty: difficultyIndex }));
  };

  const handleStartRace = () => {
    console.log('Race started!', gameConfig);
    setGameStarted(true);
  };

  const handleExitGame = () => {
    setGameStarted(false);
  };

  // Determine if start button should be enabled
  const canStartRace = Boolean(gameConfig.racerName && gameConfig.selectedVehicle !== null && gameConfig.selectedDifficulty !== null);

  // If game has started, render the Game component
  if (gameStarted) {
    return <Game gameConfig={gameConfig} onExitGame={handleExitGame} />;
  }

  // Otherwise render the game setup screen
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#FF9E5E] via-[#FF5E87] to-[#5E67FF] p-4 overflow-hidden font-retro">
      <RetroBackground />

      <div
        className={`w-full max-w-3xl rounded-3xl border-4 border-[#FFD56C]/80 bg-[#2A2F4E]/90 p-6 space-y-6 relative shadow-[0_0_25px_rgba(255,213,108,0.5)] ${
          glitchEffect ? 'translate-x-[3px]' : ''
        } transition-transform duration-75`}
      >
        {/* CRT screen effect */}
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(42,47,78,0.3)_0%,rgba(42,47,78,0.8)_80%)] pointer-events-none"></div>

        <GameTitle glitchEffect={glitchEffect} />

        <RacerNameInput value={gameConfig.racerName} onChange={updateRacerName} />

        <VehicleSelector vehicles={VEHICLES} selectedVehicle={gameConfig.selectedVehicle} onSelect={selectVehicle} />

        <DifficultySelector difficulties={DIFFICULTIES} selectedDifficulty={gameConfig.selectedDifficulty} onSelect={selectDifficulty} />

        <StartRaceButton onStart={handleStartRace} disabled={!canStartRace} />

        <DecorationIcons />
      </div>

      <RetroStyles />
    </div>
  );
}
