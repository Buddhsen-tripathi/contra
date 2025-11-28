import { Entity } from '../core/Entity';
import { InputHandler } from '../engine/InputHandler';
import { Projectile } from './Projectile';

export class Player extends Entity {
  private speed: number = 200; // pixels per second
  private input: InputHandler;
  
  // Physics constants
  private readonly GRAVITY: number = 1000;
  private readonly JUMP_FORCE: number = -600;
  private readonly GROUND_Y: number = 500; // Temporary floor level
  private isGrounded: boolean = false;

  // Shooting
  private facingDirection: number = 1; // 1 = right, -1 = left
  private fireCooldown: number = 0;
  private readonly FIRE_RATE: number = 0.15; // Seconds between shots
  private onShoot: (projectile: Projectile) => void;

  constructor(x: number, y: number, input: InputHandler, onShoot: (p: Projectile) => void) {
    super(x, y, 32, 64); // Placeholder size: 32x64 (tall rectangle like a soldier)
    this.input = input;
    this.onShoot = onShoot;
  }

  update(deltaTime: number): void {
    // Horizontal Movement
    const moveX = this.input.getAxisX();
    this.vx = moveX * this.speed;
    this.x += this.vx * deltaTime;

    // Update facing direction
    if (moveX !== 0) {
      this.facingDirection = moveX;
    }

    // Apply Gravity
    this.vy += this.GRAVITY * deltaTime;
    this.y += this.vy * deltaTime;

    // Ground Collision Check
    if (this.y + this.height >= this.GROUND_Y) {
      this.y = this.GROUND_Y - this.height;
      this.vy = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Jumping
    if (this.isGrounded && this.input.isJumpDown()) {
      this.vy = this.JUMP_FORCE;
      this.isGrounded = false;
    }

    // Shooting
    if (this.fireCooldown > 0) {
      this.fireCooldown -= deltaTime;
    }

    if (this.input.isFirePressed() && this.fireCooldown <= 0) {
      this.shoot();
    }

    // Basic boundary check (assuming 800 width for now, will be dynamic later)
    // We'll handle proper collision/bounds in a system later
    if (this.x < 0) this.x = 0;
    if (this.x > 800 - this.width) this.x = 800 - this.width;
  }

  private shoot(): void {
    const bulletX = this.facingDirection === 1 ? this.x + this.width : this.x - 8;
    const bulletY = this.y + 16; // Roughly chest height
    const projectile = new Projectile(bulletX, bulletY, this.facingDirection);
    this.onShoot(projectile);
    this.fireCooldown = this.FIRE_RATE;
  }

  render(context: CanvasRenderingContext2D): void {
    // Draw Player Placeholder (Blue Rectangle)
    context.fillStyle = '#0000ff';
    context.fillRect(this.x, this.y, this.width, this.height);

    // Draw "Head" to indicate direction/orientation
    context.fillStyle = '#88ccff';
    // Adjust head position based on facing direction
    const headX = this.facingDirection === 1 ? this.x + 8 : this.x;
    context.fillRect(headX, this.y + 4, 24, 20);
    
    // Debug: Draw Ground Line
    context.beginPath();
    context.moveTo(0, this.GROUND_Y);
    context.lineTo(800, this.GROUND_Y);
    context.strokeStyle = '#00ff00';
    context.stroke();
  }
}
