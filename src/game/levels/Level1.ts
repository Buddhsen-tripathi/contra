export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EnemySpawn {
  x: number;
  y: number;
  type: 'walker' | 'drone';
}

export interface TurretSpawn {
  x: number;
  y: number;
}

export interface BossSpawn {
  x: number;
  y: number;
  type: 'wall' | 'heart';
}

export interface LevelTheme {
  background: string;
  ground: string;
  platform: string;
  accent: string;
}

export interface LevelData {
  width: number;
  height: number;
  groundY: number;
  platforms: Platform[];
  enemies: EnemySpawn[];
  turrets: TurretSpawn[];
  boss?: BossSpawn;
  theme: LevelTheme;
}

export const Level1: LevelData = {
  width: 3000, // Long level
  height: 600,
  groundY: 500,
  theme: {
    background: '#000000',
    ground: '#333333',
    platform: '#555555',
    accent: '#00ff00'
  },
  platforms: [
    // Some floating platforms
    { x: 400, y: 400, width: 200, height: 20 },
    { x: 700, y: 300, width: 200, height: 20 },
    { x: 1000, y: 400, width: 200, height: 20 },
    { x: 1400, y: 350, width: 100, height: 20 },
    { x: 1600, y: 250, width: 100, height: 20 },
  ],
  enemies: [
    { x: 700, y: 436, type: 'walker' },
    { x: 1200, y: 436, type: 'walker' },
    { x: 1800, y: 436, type: 'walker' },
    { x: 2500, y: 436, type: 'walker' }
  ],
  turrets: [
    { x: 450, y: 368 },
    { x: 1050, y: 368 },
    { x: 2200, y: 468 }
  ],
  boss: { x: 2800, y: 404, type: 'wall' }
};
