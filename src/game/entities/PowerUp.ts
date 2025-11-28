import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';

export type PowerUpType = 'spread';

export class PowerUp extends Entity {
  public active: boolean = true;
  public type: PowerUpType;
  private sprite: Sprite;
  private startY: number;
  private time: number = 0;

  constructor(x: number, y: number, type: PowerUpType = 'spread') {
    super(x, y, 24, 24);
    this.type = type;
    this.startY = y;
    this.sprite = new Sprite(SpriteGenerator.generatePowerUpSprite(), 24, 24, 1);
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
    // Float up and down
    this.y = this.startY + Math.sin(this.time * 3) * 10;
    
    this.sprite.update(deltaTime);
  }

  render(context: CanvasRenderingContext2D): void {
    this.sprite.render(context, this.x, this.y, this.width, this.height, false);
  }
}
