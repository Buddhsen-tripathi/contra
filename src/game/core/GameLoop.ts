export type UpdateCallback = (deltaTime: number) => void;
export type RenderCallback = () => void;

export class GameLoop {
  private lastFrameTime: number = 0;
  private accumulatedTime: number = 0;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;

  // Fixed time step for logic updates (e.g., 60 FPS)
  private readonly timeStep: number = 1000 / 60;

  constructor(
    private update: UpdateCallback,
    private render: RenderCallback
  ) {}

  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.accumulatedTime = 0;
    this.loop(this.lastFrameTime);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) return;

    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    this.accumulatedTime += deltaTime;

    // Update logic in fixed time steps to ensure consistency
    while (this.accumulatedTime >= this.timeStep) {
      this.update(this.timeStep / 1000); // Pass delta time in seconds
      this.accumulatedTime -= this.timeStep;
    }

    // Render as fast as possible
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
