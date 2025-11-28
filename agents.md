# Project Context: Contra-Style Game in Next.js

## Project Goal
Build a browser-playable, Contra-style side-scrolling shooter with safe, original pixel-art assets and basic sound effects using Next.js and Canvas API.

## Architecture
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Rendering**: Canvas API
- **State Management**: Custom Game Loop

## Directory Structure Plan
- `/src/components`: React components (GameCanvas, UI)
- `/src/game/core`: Core game logic (GameLoop, State)
- `/src/game/engine`: Rendering, Input
- `/src/game/entities`: Player, Enemies, Projectiles
- `/src/game/systems`: Physics, Collision
- `/src/game/assets`: Sprites, Sounds
- `/src/game/levels`: Level data

## Current Status
- **Milestone 1 Completed**: Game Canvas and Game Loop implemented.
- **Milestone 2 Completed**: Player Entity and Basic Movement (Left/Right) implemented.
- **Milestone 3 Completed**: Physics System (Gravity & Jumping) implemented.
- **Milestone 4 Completed**: Shooting Mechanics (Projectiles) implemented.
- **Next Step**: Milestone 5 - Basic Enemy & Collision.
- Project initialized.
