import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Projectile } from './Projectile';
import { Player } from './Player';

export class Turret extends Entity {
  public active: boolean = true;
  public hp: number = 5;
  private sprite: Sprite;
  private player: Player;
  private onShoot: (projectile: Projectile) => void;
  
  private fireTimer: number = 0;
  private readonly FIRE_RATE: number = 2.0; // Seconds
  private readonly RANGE: number = 600;

  constructor(x: number, y: number, player: Player, onShoot: (p: Projectile) => void) {
    super(x, y, 32, 32);
    this.player = player;
    this.onShoot = onShoot;
    this.sprite = new Sprite(SpriteGenerator.generateTurretSprite(), 32, 32, 1);
  }

  update(deltaTime: number): void {
    this.fireTimer -= deltaTime;

    // Check distance to player
    const dx = (this.player.x + this.player.width / 2) - (this.x + this.width / 2);
    const dy = (this.player.y + this.player.height / 2) - (this.y + this.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.RANGE && this.fireTimer <= 0) {
      this.shoot(dx, dy, dist);
      this.fireTimer = this.FIRE_RATE;
    }

    this.sprite.update(deltaTime);
  }

  private shoot(dx: number, dy: number, dist: number): void {
    // Normalize vector
    const dirX = dx / dist;
    const dirY = dy / dist;
    
    const speed = 300; // Slower than player bullets
    const bulletX = this.x + 16;
    const bulletY = this.y + 16;

    const p = new Projectile(bulletX, bulletY, dirX * speed, dirY * speed, true);
    this.onShoot(p);
  }

  takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.active = false;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    // Simple rotation logic could go here, but for now just static sprite
    this.sprite.render(context, this.x, this.y, this.width, this.height, false);
  }
}
