import { LevelData } from './Level1';

export const Level2: LevelData = {
  width: 3000,
  height: 600,
  groundY: 500,
  platforms: [
    // Staircase up
    { x: 300, y: 400, width: 100, height: 20 },
    { x: 450, y: 300, width: 100, height: 20 },
    { x: 600, y: 200, width: 100, height: 20 },
    
    // Long high platform
    { x: 800, y: 200, width: 400, height: 20 },
    
    // Gap jump
    { x: 1300, y: 200, width: 100, height: 20 },
    
    // Lower section with cover
    { x: 1600, y: 400, width: 200, height: 20 },
    { x: 1900, y: 300, width: 100, height: 20 },
    
    // Final stretch
    { x: 2200, y: 400, width: 100, height: 20 },
    { x: 2400, y: 300, width: 100, height: 20 },
  ],
  enemies: [
    { x: 500, y: 436, type: 'walker' },
    { x: 900, y: 136, type: 'walker' }, // On high platform
    { x: 1400, y: 436, type: 'walker' },
    { x: 1700, y: 336, type: 'walker' }, // On platform
    { x: 2000, y: 436, type: 'walker' },
    { x: 2300, y: 436, type: 'walker' },
    { x: 2600, y: 436, type: 'walker' }
  ],
  turrets: [
    { x: 650, y: 168 }, // Top of stairs
    { x: 1100, y: 168 }, // Middle of high platform
    { x: 1650, y: 368 }, // Lower platform
    { x: 2450, y: 268 }  // Final platform
  ],
  boss: { x: 2800, y: 404 }
};
