import { Entity } from '../core/Entity';

export class Projectile extends Entity {
  public active: boolean = true;
  public isEnemy: boolean = false; // Default to player projectile

  constructor(x: number, y: number, vx: number, vy: number, isEnemy: boolean = false) {
    super(x, y, 8, 8); // Small square
    this.vx = vx;
    this.vy = vy;
    this.isEnemy = isEnemy;
  }

  update(deltaTime: number): void {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Simple bounds check (expanded for full level width)
    if (this.x < -100 || this.x > 5000 || this.y < -100 || this.y > 1000) {
      this.active = false;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.isEnemy ? '#ff0000' : '#ffff00'; // Red for enemy, Yellow for player
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
