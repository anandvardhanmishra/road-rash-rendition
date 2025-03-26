import React from 'react';
import { Vehicle, Difficulty } from './types';

// RetroBackground component
export const RetroBackground: React.FC = () => (
  <div className="absolute inset-0 bg-black pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-[url('/images/grid-bg.svg')] opacity-20 bg-repeat"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,213,108,0.1)_0%,rgba(0,0,0,0.8)_70%)]"></div>
  </div>
);

// GameTitle component
export const GameTitle: React.FC<{ glitchEffect: boolean }> = ({ glitchEffect }) => (
  <div className="relative z-10">
    <h1
      className={`text-center text-4xl md:text-5xl font-bold text-[#FFD56C] drop-shadow-[0_0_10px_rgba(255,213,108,0.7)] uppercase tracking-wider ${
        glitchEffect ? 'text-red-500 translate-x-[2px]' : ''
      } transition-all duration-75`}
    >
      Road Rash
    </h1>
    <p className="text-center text-sm text-[#FF5E87] mt-2 italic">The ultimate motorcycle racing game</p>
  </div>
);

// RacerNameInput component
export const RacerNameInput: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <div className="space-y-2 relative z-10">
    <label htmlFor="racer-name" className="block text-[#FFD56C] font-bold text-sm">
      RACER NAME
    </label>
    <input
      id="racer-name"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={15}
      className="w-full bg-[#1A1F3D] border-2 border-[#FF5E87] text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD56C] focus:border-transparent"
      placeholder="Enter your name"
    />
  </div>
);

// VehicleSelector component
export const VehicleSelector: React.FC<{
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  onSelect: (vehicleId: string) => void;
}> = ({ vehicles, selectedVehicle, onSelect }) => (
  <div className="space-y-3 relative z-10">
    <h2 className="text-[#FFD56C] font-bold text-sm">SELECT YOUR BIKE</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-150 ${
            selectedVehicle === vehicle.id ? 'border-[#FFD56C] bg-[#2A2F4E]/80' : 'border-[#FF5E87]/30 hover:border-[#FF5E87] bg-[#1A1F3D]/60'
          }`}
          onClick={() => onSelect(vehicle.id)}
        >
          <div className="w-full aspect-square bg-[#0F1326] rounded-md flex items-center justify-center mb-2">
            <div
              className="w-3/4 h-3/4"
              style={{ backgroundColor: vehicle.color, clipPath: 'polygon(40% 0%, 60% 0%, 100% 30%, 100% 70%, 60% 100%, 40% 100%, 0% 70%, 0% 30%)' }}
            ></div>
          </div>
          <h3 className="text-white text-xs font-bold truncate">{vehicle.name}</h3>
          <div className="flex space-x-1 mt-1">
            <div className="text-[8px] text-[#FF5E87]">SPD</div>
            <div className="flex-1 bg-[#1A1F3D] h-1 mt-1 rounded-full overflow-hidden">
              <div className="bg-[#5E67FF] h-full rounded-full" style={{ width: `${vehicle.stats.speed}%` }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// DifficultySelector component
export const DifficultySelector: React.FC<{
  difficulties: Difficulty[];
  selectedDifficulty: number | null;
  onSelect: (difficultyId: number) => void;
}> = ({ difficulties, selectedDifficulty, onSelect }) => (
  <div className="space-y-3 relative z-10">
    <h2 className="text-[#FFD56C] font-bold text-sm">SELECT DIFFICULTY</h2>
    <div className="flex flex-col sm:flex-row gap-2">
      {difficulties.map((difficulty) => (
        <div
          key={difficulty.id}
          className={`flex-1 cursor-pointer border-2 rounded-lg p-3 transition-all duration-150 ${
            selectedDifficulty === difficulty.id ? 'border-[#FFD56C] bg-[#2A2F4E]/80' : 'border-[#FF5E87]/30 hover:border-[#FF5E87] bg-[#1A1F3D]/60'
          }`}
          onClick={() => onSelect(difficulty.id)}
        >
          <h3 className="text-white text-sm font-bold">{difficulty.name}</h3>
          <p className="text-[#FF5E87] text-xs mt-1">{difficulty.description}</p>
        </div>
      ))}
    </div>
  </div>
);

// StartRaceButton component
export const StartRaceButton: React.FC<{
  onStart: () => void;
  disabled: boolean;
}> = ({ onStart, disabled }) => (
  <div className="flex justify-center pt-4 relative z-10">
    <button
      onClick={onStart}
      disabled={disabled}
      className={`px-8 py-3 text-lg font-bold uppercase rounded-lg shadow-lg transform transition-all duration-200 ${
        disabled
          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
          : 'bg-[#FF5E87] text-white hover:bg-[#FF8AAB] hover:shadow-[0_0_15px_rgba(255,94,135,0.5)] active:scale-95'
      }`}
    >
      Start Race
    </button>
  </div>
);

// DecorationIcons component
export const DecorationIcons: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-[#FF5E87] animate-pulse opacity-70"></div>
    <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[#5E67FF] animate-pulse opacity-70 animation-delay-500"></div>
    <div className="absolute top-4 right-4 w-4 h-4 bg-[#FFD56C] opacity-70 rotate-45"></div>
    <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#FFD56C] opacity-70 rotate-45"></div>
  </div>
);

// RetroStyles component - for global styles
export const RetroStyles: React.FC = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .font-retro {
      font-family: 'Press Start 2P', cursive, sans-serif;
    }

    .animation-delay-500 {
      animation-delay: 500ms;
    }
  `}</style>
);
