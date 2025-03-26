'use client';

import { Vehicle } from './types';
import VehicleButton from './VehicleButton';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  onSelect: (vehicleId: string) => void;
}

const VehicleSelector = ({ vehicles, selectedVehicle, onSelect }: VehicleSelectorProps) => (
  <div className="rounded-xl border-4 border-[#5E67FF] bg-[#5E67FF]/30 p-4 shadow-[0_0_10px_rgba(94,103,255,0.3)] backdrop-blur-sm">
    <h2 className="text-[#FFD56C] text-lg mb-6 uppercase">Choose your Ride</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {vehicles.map((vehicle) => (
        <VehicleButton key={vehicle.id} vehicle={vehicle} isSelected={selectedVehicle === vehicle.id} onClick={() => onSelect(vehicle.id)} />
      ))}
    </div>
  </div>
);

export default VehicleSelector;
