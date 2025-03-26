'use client';

import React from 'react';
import { GameStats } from '@/app/game-engine/core/GameEngine';

interface GameOverProps {
  stats: GameStats;
  playerName: string;
  onRetry: () => void;
  onExit: () => void;
}

export default function GameOver({ stats, playerName, onRetry, onExit }: GameOverProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#2A2F4E] border-4 border-[#FFD56C]/80 p-6 rounded-2xl text-white font-retro">
        <h2 className="text-4xl text-center text-[#FF5E87] mb-6">GAME OVER</h2>

        <div className="text-xl text-center mb-6">
          Nice ride, <span className="text-[#FFD56C]">{playerName}</span>!
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-y-4 text-lg">
            <div className="text-gray-300">Final Score:</div>
            <div className="text-right text-[#FFD56C]">{stats.score.toLocaleString()}</div>

            <div className="text-gray-300">Time:</div>
            <div className="text-right">{formatTime(stats.time)}</div>

            <div className="text-gray-300">Distance:</div>
            <div className="text-right">{Math.floor(stats.position.z)} m</div>

            <div className="text-gray-300">Health Remaining:</div>
            <div className="text-right text-red-400">{Math.floor(stats.health)}%</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 py-3 bg-[#5E67FF] hover:bg-[#4A52CC] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD56C]"
          >
            RETRY
          </button>

          <button
            onClick={onExit}
            className="flex-1 py-3 bg-[#FF5E87] hover:bg-[#CC4B6D] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD56C]"
          >
            EXIT
          </button>
        </div>

        {/* CRT effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(42,47,78,0.3)_0%,rgba(42,47,78,0.8)_80%)]"></div>

          {/* Scan lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 1px, transparent 1px, transparent 2px)',
              backgroundSize: '100% 2px',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
