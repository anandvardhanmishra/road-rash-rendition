"use client";

import { Vehicle } from "./types";

interface VehicleButtonProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
}

const VehicleButton = ({
  vehicle,
  isSelected,
  onClick,
}: VehicleButtonProps) => (
  <button
    className={`w-32 aspect-[4/3] rounded-xl border-4 border-[#5E67FF] bg-opacity-70 hover:bg-opacity-90 transition-all duration-200 relative overflow-hidden backdrop-blur-sm hover:-translate-y-1 hover:shadow-lg ${
      isSelected
        ? "ring-4 ring-[#FFD56C] shadow-[0_0_15px_rgba(255,213,108,0.5)]"
        : ""
    }`}
    style={{ backgroundColor: vehicle.color }}
    onClick={onClick}
    aria-label={vehicle.name}
  >
    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
      <div
        className="w-1/2 h-1/2 clip-path-vehicle transform rotate-45 mb-2"
        style={{ backgroundColor: `${vehicle.color}99` }}
      ></div>
      <span
        className="text-center text-sm font-bold w-full px-2"
        style={{ color: vehicle.textColor }}
      >
        {vehicle.name}
      </span>
    </div>
  </button>
);

export default VehicleButton;
