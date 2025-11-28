import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Player } from './Player';

export class Drone extends Entity {
  public active: boolean = true;
  public hp: number = 2;
  private sprite: Sprite;
  private player: Player;
  
  private startY: number;
  private time: number = 0;
  private speed: number = 80;
  private amplitude: number = 50;
  private frequency: number = 2;

  constructor(x: number, y: number, player: Player) {
    super(x, y, 32, 32);
    this.player = player;
    this.startY = y;
    this.sprite = new Sprite(SpriteGenerator.generateDroneSprite(), 32, 32, 8);
  }

  update(deltaTime: number): void {
    this.time += deltaTime;

    // Move left
    this.x -= this.speed * deltaTime;

    // Sine wave movement on Y axis
    this.y = this.startY + Math.sin(this.time * this.frequency) * this.amplitude;

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
    this.sprite.render(context, this.x, this.y, this.width, this.height);
  }
}
