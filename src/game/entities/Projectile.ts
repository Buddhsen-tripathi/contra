import { Entity } from '../core/Entity';

export class Projectile extends Entity {
  private speed: number = 600;
  public active: boolean = true;
  private direction: number;

  constructor(x: number, y: number, direction: number) {
    super(x, y, 8, 8); // Small square
    this.direction = direction;
  }

  update(deltaTime: number): void {
    this.x += this.speed * this.direction * deltaTime;
    
    // Simple bounds check (hardcoded for now, should be dynamic)
    // Assuming visible area is roughly 0-800, giving some buffer
    if (this.x < -50 || this.x > 1000) {
      this.active = false;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = '#ffff00'; // Yellow
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
