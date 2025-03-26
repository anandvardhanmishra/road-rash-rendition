# Refactoring Notes: SkyShader to React Three Fiber

## Overview

This document explains the major changes made during the refactoring of the sky rendering system from a custom `SkyShader` implementation to a React Three Fiber (R3F) approach using the `@react-three/drei` library's `Sky` component.

## Key Changes

### Removed Files

- `app/game-engine/core/SkyShader.ts`: The custom SkyShader implementation was removed and replaced with `@react-three/drei`'s `Sky` component.

### Modified Files

- `app/game-engine/core/RoadEnvironment.ts`: Removed SkyShader dependency and implementation, keeping only a fallback sky method for backward compatibility.
- `app/game-engine/core/GameEngine.ts`: Updated to better integrate with React Three Fiber by adding methods to expose scene, camera, and add external objects.

### New Files

- `app/components/SkyComponent.jsx`: React component wrapper for the `@react-three/drei` Sky.
- `app/components/ThreeCanvas.jsx`: Canvas wrapper for the 3D scene.
- `app/components/GameScene.jsx`: Main scene component with environmental elements.
- `app/components/GameEngineBridge.jsx`: Bridge between the existing game engine and React Three Fiber.

## Architectural Decisions

### Why React Three Fiber?

1. **Reliability**: `@react-three/drei`'s Sky component is well-tested and provides more reliable sky rendering than our custom implementation.
2. **Maintainability**: Using React components makes the code more declarative and easier to maintain.
3. **Performance**: The Sky component is optimized for performance with Three.js.
4. **Features**: Includes advanced atmospheric scattering parameters like rayleigh, mieCoefficient, etc.

### Integration Approach

We chose a hybrid approach that allows two modes:

1. **Pure R3F Mode**: All elements are rendered using React Three Fiber components.
2. **Legacy Engine Mode**: The original game engine is used for gameplay, but sky rendering is handled by R3F.

This approach minimizes risk by allowing gradual migration while immediately fixing sky rendering issues.

## Usage Notes

### Time of Day System

The refactored implementation includes a time-of-day system that:

- Dynamically updates the sun position
- Adjusts lighting based on time
- Changes sky appearance (color, haziness) throughout the day cycle

### Parameters

Key parameters for the Sky component:

- `distance`: Distance of sky dome (default: 450000)
- `sunPosition`: [x, y, z] position of the sun in the sky
- `inclination`: Sun inclination (0-1 range)
- `azimuth`: Sun azimuth angle
- `rayleigh`: Controls blue channel atmospheric scattering
- `turbidity`: Controls haziness due to particles
- `mieCoefficient`: Controls general haziness
- `mieDirectionalG`: Controls sun spot sharpness

## Future Improvements

1. Fully migrate all rendering to React Three Fiber
2. Add weather effects using particle systems
3. Implement improved water rendering using `@react-three/drei`'s `Ocean` component
