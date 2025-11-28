export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LevelData {
  width: number;
  height: number;
  groundY: number;
  platforms: Platform[];
}

export const Level1: LevelData = {
  width: 3000, // Long level
  height: 600,
  groundY: 500,
  platforms: [
    // Some floating platforms
    { x: 400, y: 400, width: 200, height: 20 },
    { x: 700, y: 300, width: 200, height: 20 },
    { x: 1000, y: 400, width: 200, height: 20 },
    { x: 1400, y: 350, width: 100, height: 20 },
    { x: 1600, y: 250, width: 100, height: 20 },
  ]
};
