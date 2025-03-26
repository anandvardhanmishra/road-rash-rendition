'use client';

import React from 'react';
import { GameStats } from '@/app/game-engine/core/GameEngine';

interface GameHUDProps {
  stats: GameStats;
  playerName: string;
}

export default function GameHUD({ stats, playerName }: GameHUDProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format speed with rounding and km/h
  const formatSpeed = (speed: number): string => {
    return `${Math.round(speed)} km/h`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none font-retro">
      <div className="flex justify-between items-start text-white">
        {/* Left side - Player info */}
        <div className="bg-black/70 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_8px_rgba(255,213,108,0.3)]">
          <div className="text-xl text-[#FFD56C] uppercase tracking-wider">{playerName}</div>
          <div className="flex gap-6 mt-2">
            <div>
              <div className="text-sm opacity-80 uppercase tracking-wide">HEALTH</div>
              <div className="relative w-32 h-4 mt-1 bg-black/40 rounded overflow-hidden border border-[#FFD56C]/30">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${stats.playerHealth}%` }} />
              </div>
            </div>

            <div>
              <div className="text-sm opacity-80 uppercase tracking-wide">POSITION</div>
              <div className="text-2xl">{stats.position.toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* Center - Speed */}
        <div className="bg-black/70 px-4 py-2 rounded-lg backdrop-blur-sm shadow-[0_0_8px_rgba(94,103,255,0.3)]">
          <div className="text-3xl text-[#5E67FF]">{formatSpeed(stats.playerSpeed)}</div>
        </div>

        {/* Right side - Score and time */}
        <div className="bg-black/70 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_8px_rgba(255,213,108,0.3)]">
          <div>
            <div className="text-sm opacity-80 uppercase tracking-wide">SCORE</div>
            <div className="text-2xl text-[#FFD56C]">{stats.score.toLocaleString()}</div>
          </div>
          <div className="mt-2">
            <div className="text-sm opacity-80 uppercase tracking-wide">TIME</div>
            <div className="text-xl">{formatTime(stats.time)}</div>
          </div>
        </div>
      </div>

      {/* Mobile controls instructions
      <div className="mt-4 bg-black/70 p-2 rounded-lg backdrop-blur-sm text-white text-sm text-center md:hidden shadow-[0_0_8px_rgba(255,94,135,0.3)]">
        <p>Top: Accelerate • Bottom: Brake • Left/Right: Turn • Center: Attack</p>
      </div>

      {/* Desktop controls instructions */}
      {/* <div className="mt-4 bg-black/70 p-2 rounded-lg backdrop-blur-sm text-white text-sm text-center hidden md:block shadow-[0_0_8px_rgba(255,94,135,0.3)]">
        <p>Arrow Keys: Move • Spacebar: Attack</p>
      </div> */}
    </div>
  );
}
