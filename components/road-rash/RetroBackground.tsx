'use client';

const RetroBackground = () => (
  <>
    {/* Retro scanlines overlay */}
    <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-10 opacity-20"></div>

    {/* Beach/Sunset background elements */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#FFB86C] to-[#FF5E87] opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#5E67FF] to-transparent opacity-40"></div>
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-[#5E67FF]/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-[#FFD56C]/30 rounded-full blur-2xl"></div>
    </div>
  </>
);

export default RetroBackground;
