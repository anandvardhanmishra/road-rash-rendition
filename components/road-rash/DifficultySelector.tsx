"use client";

interface DifficultySelectorProps {
  difficulties: string[];
  selectedDifficulty: number | null;
  onSelect: (index: number) => void;
}

const DifficultySelector = ({
  difficulties,
  selectedDifficulty,
  onSelect,
}: DifficultySelectorProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "border-emerald-400 bg-emerald-400/40 hover:bg-emerald-400/60";
      case "normal":
        return "border-amber-400 bg-amber-400/40 hover:bg-amber-400/60";
      case "hard":
        return "border-rose-500 bg-rose-500/40 hover:bg-rose-500/60";
      default:
        return "border-[#FF9E5E] bg-[#FF5E87]/30";
    }
  };

  return (
    <div className="rounded-xl border-4 border-[#FF9E5E] bg-[#FF9E5E]/30 p-4 shadow-[0_0_10px_rgba(255,158,94,0.3)] backdrop-blur-sm">
      <h2 className="text-[#FFD56C] text-lg mb-6 uppercase">Difficulty</h2>
      <div className="flex gap-4">
        {difficulties.map((difficulty, index) => (
          <button
            key={index}
            className={`w-24 aspect-[3/2] rounded-xl border-4 ${getDifficultyColor(
              difficulty
            )} transition-all duration-200 relative backdrop-blur-sm hover:-translate-y-1 hover:shadow-lg ${
              selectedDifficulty === index
                ? "ring-4 ring-[#FFD56C] shadow-[0_0_15px_rgba(255,213,108,0.5)]"
                : ""
            }`}
            onClick={() => onSelect(index)}
            aria-label={difficulty}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-bold text-center">
                {difficulty}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
