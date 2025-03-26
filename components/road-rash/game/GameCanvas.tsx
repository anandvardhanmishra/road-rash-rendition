'use client';

import React, { useRef, useEffect, useState } from 'react';
import { GameEngine, Controls, GameState, PlayerInput, GameStats } from '@/app/game-engine/core/GameEngine';

interface GameCanvasProps {
  gameConfig: GameEngineConfig;
  onGameStats?: (stats: GameStats) => void;
  onGameOver?: (finalStats: GameStats) => void;
}

// Keeping the original config type for backward compatibility
export interface GameEngineConfig {
  difficulty: number; // 0: Easy, 1: Medium, 2: Hard
  vehicleId: string;
  playerName: string;
}

export default function GameCanvas({ gameConfig, onGameStats, onGameOver }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize the game engine when the component mounts
  useEffect(() => {
    // Only create a new engine if there isn't one already
    if (!containerRef.current || engineRef.current) return;

    console.log('Initializing game engine with config:', gameConfig);

    // Set up full screen container
    if (containerRef.current) {
      containerRef.current.style.width = '100vw';
      containerRef.current.style.height = '100vh';
      containerRef.current.style.position = 'fixed';
      containerRef.current.style.top = '0';
      containerRef.current.style.left = '0';
      containerRef.current.style.zIndex = '50';
    }

    // Create the game engine with appropriate config
    const internalConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
      playerName: gameConfig.playerName,
      difficulty: gameConfig.difficulty,
      vehicleId: gameConfig.vehicleId,
    };

    const gameEngine = new GameEngine(internalConfig, containerRef.current);
    engineRef.current = gameEngine;

    // Start the game
    gameEngine.start();
    setIsInitialized(true);

    // Set up game loop to provide updates to UI
    const updateUI = () => {
      if (gameEngine && isInitialized) {
        const gameState = gameEngine.getGameState();

        // Send game state to parent component
        if (onGameStats) {
          onGameStats(gameState);
        }

        // Check if game is over
        if (gameState.gameOver) {
          if (onGameOver) {
            onGameOver(gameState);
          }
          setIsInitialized(false);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }

        // Continue the UI update loop
        animationFrameRef.current = requestAnimationFrame(updateUI);
      }
    };

    // Start UI update loop
    animationFrameRef.current = requestAnimationFrame(updateUI);

    // Cleanup function
    return () => {
      console.log('Disposing game engine');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current.dispose();
        engineRef.current = null;
      }
      setIsInitialized(false);
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    if (!isInitialized || !engineRef.current) return;

    const controls: Controls = {
      left: false,
      right: false,
      up: false,
      down: false,
      punch: false,
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser behavior for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
          controls.left = true;
          break;
        case 'ArrowRight':
          controls.right = true;
          break;
        case 'ArrowUp':
          controls.up = true;
          break;
        case 'ArrowDown':
          controls.down = true;
          break;
        case ' ': // Spacebar
          controls.punch = true;
          break;
        case 'Escape': // Allow exiting fullscreen
          if (containerRef.current && document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }

      if (engineRef.current) {
        engineRef.current.setControls(controls);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          controls.left = false;
          break;
        case 'ArrowRight':
          controls.right = false;
          break;
        case 'ArrowUp':
          controls.up = false;
          break;
        case 'ArrowDown':
          controls.down = false;
          break;
        case ' ': // Spacebar
          controls.punch = false;
          break;
      }

      if (engineRef.current) {
        engineRef.current.setControls(controls);
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isInitialized]);

  // Handle window resize for full screen
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.width = '100vw';
        containerRef.current.style.height = '100vh';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Enable full screen on click
  useEffect(() => {
    if (!containerRef.current) return;

    const enableFullScreen = () => {
      const container = containerRef.current;
      if (!container) return;

      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    };

    containerRef.current.addEventListener('click', enableFullScreen);
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', enableFullScreen);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-screen h-screen bg-black overflow-hidden z-50" style={{ touchAction: 'none' }}>
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p>Click to start full screen game</p>
        </div>
      )}
    </div>
  );
}
