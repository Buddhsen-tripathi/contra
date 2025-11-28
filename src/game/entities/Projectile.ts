import { Entity } from '../core/Entity';

export class Projectile extends Entity {
  private speed: number = 600;
  public active: boolean = true;
  public isEnemy: boolean = false; // Default to player projectile
  private direction: number;

  constructor(x: number, y: number, direction: number, isEnemy: boolean = false) {
    super(x, y, 8, 8); // Small square
    this.direction = direction;
    this.isEnemy = isEnemy;
  }

  update(deltaTime: number): void {
    this.x += this.speed * this.direction * deltaTime;
    
    // Simple bounds check (expanded for full level width)
    if (this.x < -100 || this.x > 5000) {
      this.active = false;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.isEnemy ? '#ff0000' : '#ffff00'; // Red for enemy, Yellow for player
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
