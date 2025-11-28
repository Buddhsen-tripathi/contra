import { Entity } from '../core/Entity';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Projectile } from './Projectile';

export class Boss extends Entity {
  public active: boolean = true;
  public hp: number = 20;
  private maxHp: number = 20;
  private sprite: Sprite;
  
  // Attack logic
  private attackTimer: number = 0;
  private readonly ATTACK_INTERVAL: number = 2.0; // Seconds
  private onShoot: (projectile: Projectile) => void;

  constructor(x: number, y: number, onShoot: (p: Projectile) => void) {
    super(x, y, 96, 96);
    this.onShoot = onShoot;
    this.sprite = new Sprite(SpriteGenerator.generateBossSprite(), 96, 96, 2); // 2 FPS (slow blink)
  }

  update(deltaTime: number): void {
    this.sprite.update(deltaTime);

    // Attack Logic
    this.attackTimer -= deltaTime;
    if (this.attackTimer <= 0) {
      this.shoot();
      this.attackTimer = this.ATTACK_INTERVAL;
      // Switch to "Attack" frame briefly
      this.sprite.setFrame(1); 
    } else {
      if (this.attackTimer < this.ATTACK_INTERVAL - 0.5) {
        this.sprite.setFrame(0); // Return to idle
      }
    }
  }

  private shoot(): void {
    // Shoot 3 bullets in a spread or just one fast one
    // For now, one fast bullet to the left
    const bulletY = this.y + 48 - 4; // Center
    const bulletX = this.x;
    
    // Create enemy projectile (isEnemy = true)
    const p = new Projectile(bulletX, bulletY, -1, true); 
    
    this.onShoot(p);
  }

  takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.active = false;
      // Explosion effect?
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.sprite.render(context, this.x, this.y, this.width, this.height, false);

    // Draw Health Bar
    const barWidth = this.width;
    const barHeight = 6;
    const hpPercent = this.hp / this.maxHp;
    
    context.fillStyle = '#550000';
    context.fillRect(this.x, this.y - 15, barWidth, barHeight);
    
    context.fillStyle = '#ff0000';
    context.fillRect(this.x, this.y - 15, barWidth * hpPercent, barHeight);
  }
}
