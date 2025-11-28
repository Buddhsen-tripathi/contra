import { Entity } from '../core/Entity';
import { InputHandler } from '../engine/InputHandler';
import { Projectile } from './Projectile';
import { Sprite } from '../engine/Sprite';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { AudioSystem } from '../engine/AudioSystem';

export class Player extends Entity {
  private speed: number = 200; // pixels per second
  private input: InputHandler;
  private sprite: Sprite;
  private audio: AudioSystem;
  
  // Physics constants
  private readonly JUMP_FORCE: number = -600;

  // Shooting
  private facingDirection: number = 1; // 1 = right, -1 = left
  private fireCooldown: number = 0;
  private readonly FIRE_RATE: number = 0.15; // Seconds between shots
  private onShoot: (projectile: Projectile) => void;

  // Health & Lives
  public lives: number = 3;
  private isInvulnerable: boolean = false;
  private invulnerabilityTimer: number = 0;
  private readonly INVULNERABILITY_DURATION: number = 2.0; // Seconds

  constructor(x: number, y: number, input: InputHandler, audio: AudioSystem, onShoot: (p: Projectile) => void) {
    super(x, y, 32, 64); // Placeholder size: 32x64 (tall rectangle like a soldier)
    this.input = input;
    this.audio = audio;
    this.onShoot = onShoot;

    // Initialize Sprite
    // Note: In a real app, we might want to preload this in the engine
    this.sprite = new Sprite(SpriteGenerator.generatePlayerSprite(), 32, 64, 10);
  }

  update(deltaTime: number): void {
    // Handle Invulnerability
    if (this.isInvulnerable) {
      this.invulnerabilityTimer -= deltaTime;
      if (this.invulnerabilityTimer <= 0) {
        this.isInvulnerable = false;
      }
    }

    // Horizontal Movement
    const moveX = this.input.getAxisX();
    this.vx = moveX * this.speed;
    this.x += this.vx * deltaTime;

    // Update facing direction
    if (moveX !== 0) {
      this.facingDirection = moveX;
    }

    // Note: Gravity and Collision are now handled by PhysicsSystem

    // Jumping
    if (this.isGrounded && this.input.isJumpDown()) {
      this.vy = this.JUMP_FORCE;
      this.isGrounded = false;
      this.audio.playJump();
    }

    // Shooting
    if (this.fireCooldown > 0) {
      this.fireCooldown -= deltaTime;
    }

    if (this.input.isFirePressed() && this.fireCooldown <= 0) {
      this.shoot();
    }

    // Basic boundary check
    if (this.x < 0) this.x = 0;
    // Max width will be handled by the engine/level context

    // Update Sprite Animation
    this.sprite.update(deltaTime);
  }

  public takeDamage(): boolean {
    if (this.isInvulnerable) return false;

    this.lives--;
    this.isInvulnerable = true;
    this.invulnerabilityTimer = this.INVULNERABILITY_DURATION;
    
    // Knockback (optional, simple jump)
    this.vy = -300;
    
    return true; // Damage taken
  }

  private shoot(): void {
    const bulletX = this.facingDirection === 1 ? this.x + this.width : this.x - 8;
    const bulletY = this.y + 22; // Adjusted for sprite gun position
    const projectile = new Projectile(bulletX, bulletY, this.facingDirection);
    this.onShoot(projectile);
    this.audio.playShoot();
    this.fireCooldown = this.FIRE_RATE;
  }

  render(context: CanvasRenderingContext2D): void {
    // Flicker if invulnerable
    if (this.isInvulnerable) {
      // Simple flicker: skip rendering every other frame (or based on timer)
      if (Math.floor(this.invulnerabilityTimer * 10) % 2 === 0) {
        return;
      }
    }

    // Render Sprite
    // Flip if facing left
    const flip = this.facingDirection === -1;
    this.sprite.render(context, this.x, this.y, this.width, this.height, flip);
    
    // Debug: Draw Ground Line (Optional, maybe remove later)
    // context.beginPath();
    // context.moveTo(0, 500);
    // context.lineTo(800, 500);
    // context.strokeStyle = '#00ff00';
    // context.stroke();
  }
}
