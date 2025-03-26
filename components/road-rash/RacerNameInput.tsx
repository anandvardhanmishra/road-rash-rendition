"use client";

import { Input } from "@/components/ui/input";

interface RacerNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RacerNameInput = ({ value, onChange }: RacerNameInputProps) => (
  <div className="rounded-xl border-4 border-[#FF9E5E] bg-[#FFB86C]/30 p-4 transform rotate-0 hover:rotate-0 transition-transform duration-300 shadow-[0_0_10px_rgba(255,158,94,0.3)] backdrop-blur-sm">
    <label className="block text-[#FFD56C] text-lg mb-3 uppercase">
      Racer Name
    </label>
    <Input
      placeholder="Enter Your Name"
      className="bg-[#FF5E87]/30 border-4 border-[#FF9E5E] rounded-xl text-[#FFD56C] p-4 h-14 w-full placeholder:text-[#ffffff]/70 font-retro backdrop-blur-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default RacerNameInput;
