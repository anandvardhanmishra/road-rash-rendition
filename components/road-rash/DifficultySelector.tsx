'use client';

interface DifficultySelectorProps {
  difficulties: string[];
  selectedDifficulty: number | null;
  onSelect: (index: number) => void;
}

const DifficultySelector = ({ difficulties, selectedDifficulty, onSelect }: DifficultySelectorProps) => (
  <div className="rounded-xl border-4 border-[#FF9E5E] bg-[#FF9E5E]/30 p-4 shadow-[0_0_10px_rgba(255,158,94,0.3)] backdrop-blur-sm">
    <h2 className="text-[#FFD56C] text-lg mb-6 uppercase">Difficulty</h2>
    <div className="flex justify-between gap-4">
      {difficulties.map((difficulty, index) => (
        <button
          key={index}
          className={`flex-1 aspect-[3/2] rounded-xl border-4 border-[#FF9E5E] bg-[#FF5E87]/30 hover:bg-[#FF5E87]/50 transition-colors transform hover:scale-105 transition-transform duration-200 relative backdrop-blur-sm ${
            selectedDifficulty === index ? 'ring-4 ring-[#FFD56C] shadow-[0_0_15px_rgba(255,213,108,0.5)]' : ''
          }`}
          onClick={() => onSelect(index)}
          aria-label={difficulty}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#FFD56C] text-sm md:text-base">{difficulty}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default DifficultySelector; 