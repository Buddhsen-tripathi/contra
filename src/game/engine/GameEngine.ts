import { GameLoop } from '../core/GameLoop';
import { InputHandler } from './InputHandler';
import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private gameLoop: GameLoop;
  private inputHandler: InputHandler;
  private player: Player;
  private projectiles: Projectile[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.context = ctx;

    // Initialize Input
    this.inputHandler = new InputHandler();

    // Initialize Player
    // Start near bottom-left
    this.player = new Player(50, 450, this.inputHandler, this.spawnProjectile);

    // Initialize GameLoop
    this.gameLoop = new GameLoop(this.update, this.render);
  }

  private spawnProjectile = (projectile: Projectile): void => {
    this.projectiles.push(projectile);
  };

  public start(): void {
    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
    this.inputHandler.cleanup();
  }

  private update = (deltaTime: number): void => {
    this.player.update(deltaTime);

    // Update projectiles
    this.projectiles.forEach(p => p.update(deltaTime));
    // Remove inactive projectiles
    this.projectiles = this.projectiles.filter(p => p.active);
  };

  private render = (): void => {
    // Clear screen
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render Player
    this.player.render(this.context);

    // Render Projectiles
    this.projectiles.forEach(p => p.render(this.context));

    // Draw debug text
    this.context.fillStyle = '#ffffff';
    this.context.font = '16px monospace';
    this.context.fillText('CONTRA ENGINE: SHOOTING', 10, 20);
    this.context.fillText(`Player X: ${Math.round(this.player.x)}`, 10, 40);
    this.context.fillText(`Bullets: ${this.projectiles.length}`, 10, 60);
  };
}
