"use client";

interface GameTitleProps {
  glitchEffect: boolean;
}

const GameTitle = ({ glitchEffect }: GameTitleProps) => (
  <div className="text-center mb-4 relative">
    <h1
      className={`text-[#FFD56C] text-4xl md:text-5xl font-normal tracking-wider uppercase ${
        glitchEffect ? "text-[#FF5E87]" : ""
      } transition-colors duration-75 leading-tight`}
    >
      Motor Bash Racing
    </h1>
    <div className="h-2 w-3/4 bg-gradient-to-r from-[#FF5E87]/30 via-[#FF5E87] to-[#FF5E87]/30 mx-auto mt-2 clip-path-polygon"></div>
  </div>
);

export default GameTitle;
