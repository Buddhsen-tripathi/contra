import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';

export class Explosion extends Entity {
  public active: boolean = true;
  private sprite: Sprite;

  constructor(x: number, y: number) {
    super(x, y, 32, 32);
    // 32x32, 12fps, no loop
    this.sprite = new Sprite(SpriteGenerator.generateExplosionSprite(), 32, 32, 12, false);
  }

  update(deltaTime: number): void {
    this.sprite.update(deltaTime);
    if (this.sprite.isFinished) {
      this.active = false;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.sprite.render(context, this.x, this.y, this.width, this.height);
  }
}
