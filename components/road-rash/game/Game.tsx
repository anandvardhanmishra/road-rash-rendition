'use client';

import React, { useState, useCallback } from 'react';
import { R3fGameCanvas } from '@/app/components/road-rash/game/R3fGameCanvas';
import GameHUD from './GameHUD';
import GameOver from './GameOver';
import { GameStats } from '@/app/game-engine/core/GameEngine';
import { GameConfig } from '@/components/road-rash/types';
import { RetroStyles } from '@/components/road-rash';

interface GameProps {
  gameConfig: GameConfig;
  onExitGame: () => void;
}

export default function Game({ gameConfig, onExitGame }: GameProps) {
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    playerSpeed: 0,
    playerHealth: 100,
    time: 0,
    position: 0,
    playerDistance: 0,
    gameOver: false,
    maxSpeed: 0,
    raceFinished: false,
  });

  const [isGameOver, setIsGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState<GameStats | null>(null);

  // Use useCallback to create a stable function reference that won't trigger re-renders
  const handleGameStats = useCallback((stats: GameStats) => {
    setGameStats(stats);
  }, []);

  const handleGameOver = useCallback((stats: GameStats) => {
    setFinalStats(stats);
    setIsGameOver(true);
  }, []);

  const handleRetry = () => {
    // Reset the game
    setGameStats({
      score: 0,
      playerSpeed: 0,
      playerHealth: 100,
      time: 0,
      position: 0,
      playerDistance: 0,
      gameOver: false,
      maxSpeed: 0,
      raceFinished: false,
    });
    setIsGameOver(false);
    setFinalStats(null);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black font-retro">
      {/* Game Canvas */}
      <R3fGameCanvas gameConfig={gameConfig} onGameStateUpdate={handleGameStats} isPaused={isGameOver} />

      {/* Game HUD (only shown when game is active) */}
      {!isGameOver && <GameHUD stats={gameStats} playerName={gameConfig.racerName || 'Player'} />}

      {/* Game Over screen */}
      {isGameOver && finalStats && <GameOver stats={finalStats} playerName={gameConfig.racerName || 'Player'} onRetry={handleRetry} onExit={onExitGame} />}

      {/* Import RetroStyles for custom font and effects */}
      <RetroStyles />

      {/* Debugging Info (remove in production) */}
      {/* 
      <div className="absolute bottom-4 left-4 bg-black/70 p-2 text-white text-xs">
        Debug: Position x: {gameStats.position.x.toFixed(2)}, y: {gameStats.position.y.toFixed(2)}, z: {gameStats.position.z.toFixed(2)}
      </div>
      */}
    </div>
  );
}
