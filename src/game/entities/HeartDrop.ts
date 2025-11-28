import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';

export class HeartDrop extends Entity {
  public active: boolean = true;
  private sprite: Sprite;
  private startY: number;
  private time: number = 0;
  public lifetime: number = 3.0; // 3 seconds to collect

  constructor(x: number, y: number) {
    super(x, y, 16, 16);
    this.startY = y;
    this.sprite = new Sprite(SpriteGenerator.generateHeartSprite(), 16, 16, 1);
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
    this.lifetime -= deltaTime;

    if (this.lifetime <= 0) {
      this.active = false;
    }

    // Float up and down slightly
    this.y = this.startY + Math.sin(this.time * 5) * 5;
    
    // Blink when near expiration
    if (this.lifetime < 1.0) {
        // Blink every 0.1s
        this.sprite.visible = Math.floor(this.lifetime * 10) % 2 === 0;
    } else {
        this.sprite.visible = true;
    }

    this.sprite.update(deltaTime);
  }

  render(context: CanvasRenderingContext2D): void {
    if (this.sprite.visible) {
        this.sprite.render(context, this.x, this.y, this.width, this.height, false);
    }
  }
}
