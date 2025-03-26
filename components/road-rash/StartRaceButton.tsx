'use client';

interface StartRaceButtonProps {
  onStart: () => void;
  disabled?: boolean;
}

const StartRaceButton = ({ onStart, disabled }: StartRaceButtonProps) => (
  <button
    className={`w-full rounded-xl border-4 border-[#FFD56C] bg-gradient-to-r from-[#FF9E5E] to-[#FF5E87] hover:from-[#FF5E87] hover:to-[#FF9E5E] transition-all p-4 text-[#2A2F4E] text-xl md:text-2xl uppercase transform hover:scale-105 transition-transform duration-200 shadow-[0_0_15px_rgba(255,213,108,0.3)] ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    onClick={onStart}
    disabled={disabled}
  >
    Start Race
  </button>
);

export default StartRaceButton;
