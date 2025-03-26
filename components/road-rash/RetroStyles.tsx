'use client';

const RetroStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .font-retro {
      font-family: 'Press Start 2P', cursive;
    }

    .clip-path-polygon {
      clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
    }

    .clip-path-vehicle {
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    }

    @keyframes glitch {
      0% {
        transform: translate(0);
      }
      20% {
        transform: translate(-3px, 3px);
      }
      40% {
        transform: translate(-3px, -3px);
      }
      60% {
        transform: translate(3px, 3px);
      }
      80% {
        transform: translate(3px, -3px);
      }
      100% {
        transform: translate(0);
      }
    }
  `}</style>
);

export default RetroStyles;
