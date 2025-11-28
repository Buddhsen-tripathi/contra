import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Projectile } from './Projectile';
import { Player } from './Player';

export class AlienHeart extends Entity {
  public active: boolean = true;
  public hp: number = 30; // Tougher than Level 1 boss
  private sprite: Sprite;
  private player: Player;
  private onShoot: (projectile: Projectile) => void;
  
  private attackTimer: number = 0;
  private readonly ATTACK_INTERVAL: number = 2.0;

  constructor(x: number, y: number, player: Player, onShoot: (p: Projectile) => void) {
    super(x, y, 128, 128);
    this.player = player;
    this.onShoot = onShoot;
    this.sprite = new Sprite(SpriteGenerator.generateAlienHeartSprite(), 128, 128, 2); // Slow pulse
  }

  update(deltaTime: number): void {
    this.attackTimer -= deltaTime;

    if (this.attackTimer <= 0) {
      this.attack();
      this.attackTimer = this.ATTACK_INTERVAL;
    }

    this.sprite.update(deltaTime);
  }

  private attack(): void {
    // Spread shot (3 bullets)
    const centerX = this.x + 64;
    const centerY = this.y + 64;
    
    // Target player
    const dx = (this.player.x + this.player.width / 2) - centerX;
    const dy = (this.player.y + this.player.height / 2) - centerY;
    const angle = Math.atan2(dy, dx);

    const speed = 215;
    const angles = [angle - 0.3, angle, angle + 0.3];

    angles.forEach(a => {
      const dirX = Math.cos(a);
      const dirY = Math.sin(a);
      this.onShoot(new Projectile(centerX, centerY, dirX * speed, dirY * speed, true));
    });
  }

  takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.active = false;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.sprite.render(context, this.x, this.y, this.width, this.height);
    
    // Health bar
    context.fillStyle = '#ff0000';
    context.fillRect(this.x, this.y - 20, this.width, 10);
    context.fillStyle = '#00ff00';
    context.fillRect(this.x, this.y - 20, this.width * (this.hp / 30), 10);
  }
}
