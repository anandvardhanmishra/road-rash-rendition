# RoadRash

A modern reimagining of the classic Road Rash game built with React, Three.js, and React Three Fiber.

## Features

### Graphics & Environment

- Beautiful sunset environment with a visible sun on the horizon
- Snow-capped mountains in the background using custom shaders
- Ghibli-styled trees with soft, rounded shapes and layered foliage
- Textured road with normal and roughness mapping
- Dynamic lighting system with warm sunset colors
- Atmospheric effects including stars and clouds
- Distance fog for depth perception

### Gameplay

- Smooth player movement with acceleration and deceleration
- Dynamic camera that follows the player
- Road boundary collision detection
- AI opponents with varying speeds
- Health and scoring system
- Race position tracking
- Time-based gameplay (3-minute races)

### Controls

- Arrow Keys / WASD: Movement controls
  - Up/W: Accelerate
  - Down/S: Brake
  - Left/A: Turn left
  - Right/D: Turn right
- Spacebar: Attack (in development)

### Technical Features

- Built with React Three Fiber and Three.js
- Custom shader implementations for mountain snow effects
- Efficient object pooling for environment objects
- Smooth camera interpolation
- Physics-based movement system
- Collision detection system
- Performance optimized with proper scaling and culling

## Project Structure

```
RoadRash/
├── app/
│   └── components/
│       └── road-rash/
│           └── game/
│               ├── r3f-engine/     # Main game engine components
│               ├── GameHUD.tsx     # Heads-up display
│               ├── GameOver.tsx    # Game over screen
│               └── Game.tsx        # Main game wrapper
```

## Current State

- Basic gameplay mechanics implemented
- Visual environment established with sunset, mountains, and trees
- Player movement and collision detection working
- AI opponents present with basic behavior
- HUD showing speed, health, position, and score

## In Development

- Enhanced opponent AI behavior
- Combat system implementation
- More detailed bike models
- Additional environmental hazards
- Sound effects and music
- Power-ups and collectibles
- Multiple bike types
- Track variations

## Technical Requirements

- Node.js
- React 18+
- Three.js
- React Three Fiber
- TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Performance Considerations

- Optimized geometry for mountains and trees
- Efficient texture loading and management
- Proper use of React Three Fiber's Suspense for asset loading
- Distance-based object culling
- Optimized collision detection

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

MIT License
