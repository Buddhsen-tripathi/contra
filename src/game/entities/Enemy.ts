import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';

export class Enemy extends Entity {
  public active: boolean = true;
  public hp: number = 3;
  private speed: number = 50;
  private sprite: Sprite;

  constructor(x: number, y: number) {
    super(x, y, 32, 64); // Same size as player for now
    this.sprite = new Sprite(SpriteGenerator.generateEnemySprite(), 32, 64, 6);
  }

  update(deltaTime: number): void {
    // Simple AI: Move left constantly
    this.x -= this.speed * deltaTime;

    // Deactivate if off-screen to the left
    if (this.x + this.width < 0) {
      this.active = false;
    }

    this.sprite.update(deltaTime);
  }

  takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.active = false;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    // Render Sprite (Always facing left for now as they run left)
    this.sprite.render(context, this.x, this.y, this.width, this.height, true);
  }
}
