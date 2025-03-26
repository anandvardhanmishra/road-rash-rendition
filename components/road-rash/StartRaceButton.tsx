"use client";

import { useState, useEffect } from "react";

interface StartRaceButtonProps {
  onStart: () => void;
  disabled?: boolean;
}

const StartRaceButton = ({ onStart, disabled }: StartRaceButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [emojiIndex, setEmojiIndex] = useState(0);

  const emojis = ["🔥", "🏍️"];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && !disabled) {
      interval = setInterval(() => {
        setEmojiIndex((prev) => (prev + 1) % emojis.length);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isHovered, disabled]);

  return (
    <button
      className={`w-full rounded-xl border-4 border-[#FFD56C] bg-gradient-to-r from-emerald-500 to-green-500 hover:from-green-500 hover:to-emerald-500 transition-all p-4 text-white text-xl md:text-2xl uppercase transform hover:scale-110 hover:-translate-y-1 duration-200 shadow-[0_0_15px_rgba(255,213,108,0.3)] hover:shadow-[0_0_25px_rgba(255,213,108,0.5)] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onStart}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center gap-2">
        {isHovered && !disabled && (
          <span className="animate-bounce">{emojis[emojiIndex]}</span>
        )}
        Start Race
        {isHovered && !disabled && (
          <span className="animate-bounce">{emojis[emojiIndex]}</span>
        )}
      </div>
    </button>
  );
};

export default StartRaceButton;
