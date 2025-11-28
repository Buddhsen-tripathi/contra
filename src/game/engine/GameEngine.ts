import { GameLoop } from '../core/GameLoop';
import { InputHandler } from './InputHandler';
import { Camera } from './Camera';
import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Enemy } from '../entities/Enemy';
import { Turret } from '../entities/Turret';
import { Boss } from '../entities/Boss';
import { PowerUp } from '../entities/PowerUp';
import { Explosion } from '../entities/Explosion';
import { CollisionSystem } from '../systems/CollisionSystem';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { AudioSystem } from './AudioSystem';
import { Level1, LevelData } from '../levels/Level1';
import { Level2 } from '../levels/Level2';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private gameLoop: GameLoop;
  private inputHandler: InputHandler;
  private camera: Camera;
  private physicsSystem: PhysicsSystem;
  private audioSystem: AudioSystem;
  
  private player: Player;
  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];
  private turrets: Turret[] = [];
  private powerUps: PowerUp[] = [];
  private explosions: Explosion[] = [];
  private boss: Boss | null = null;
  private currentLevel: LevelData;
  private levelIndex: number = 0;
  private levels: LevelData[] = [Level1, Level2];
  private gameState: 'playing' | 'gameover' | 'victory' | 'level_transition' = 'playing';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.context = ctx;

    // Load Level
    this.currentLevel = this.levels[this.levelIndex];

    // Initialize Systems
    this.inputHandler = new InputHandler();
    this.physicsSystem = new PhysicsSystem();
    this.audioSystem = new AudioSystem();
    this.camera = new Camera(canvas.width, canvas.height);

    // Initialize Player
    this.player = new Player(50, 450, this.inputHandler, this.audioSystem, this.spawnProjectile);

    // Spawn Test Enemies scattered through the level
    this.spawnEnemies();
    this.spawnTurrets();

    // Spawn Test PowerUp
    this.powerUps.push(new PowerUp(600, 400));

    // Initialize GameLoop
    this.gameLoop = new GameLoop(this.update, this.render);

    // Resume audio context on first user interaction (click on canvas)
    this.canvas.addEventListener('click', () => {
      this.audioSystem.resume();
    });
  }

  private loadNextLevel(): void {
    this.levelIndex++;
    if (this.levelIndex < this.levels.length) {
      this.currentLevel = this.levels[this.levelIndex];
      this.resetLevelState();
      this.gameState = 'playing'; // Or 'level_transition' if we want a screen
    } else {
      this.gameState = 'victory';
    }
  }

  private resetLevelState(): void {
    this.projectiles = [];
    this.enemies = [];
    this.turrets = [];
    this.powerUps = [];
    this.explosions = [];
    this.boss = null;
    
    // Reset Player Position but keep lives/weapon? 
    // For now, full reset of player position
    this.player.x = 50;
    this.player.y = 450;
    
    // Reset Camera
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    
    // Respawn Entities
    this.spawnEnemies();
    this.spawnTurrets();

    // Spawn PowerUp (maybe random?)
    this.powerUps.push(new PowerUp(600, 400));
  }

  private spawnProjectile = (projectile: Projectile): void => {
    this.projectiles.push(projectile);
  };

  private spawnExplosion(x: number, y: number): void {
    this.explosions.push(new Explosion(x, y));
    this.audioSystem.playExplosion();
  }

  private spawnEnemies(): void {
    this.currentLevel.enemies.forEach(e => {
      this.enemies.push(new Enemy(e.x, e.y));
    });
  }

  private spawnTurrets(): void {
    this.currentLevel.turrets.forEach(t => {
      this.turrets.push(new Turret(t.x, t.y, this.player, this.audioSystem, this.spawnProjectile));
    });
  }

  public start(): void {
    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
    this.inputHandler.cleanup();
  }

  private reset(): void {
    this.gameState = 'playing';
    this.levelIndex = 0;
    this.currentLevel = this.levels[0];
    
    // Reset Player (Full reset including lives)
    this.player = new Player(50, 450, this.inputHandler, this.audioSystem, this.spawnProjectile);
    
    this.resetLevelState();
  }

  private update = (deltaTime: number): void => {
    // Global Restart Check
    if (this.inputHandler.isJustPressed('KeyR')) {
      this.reset();
      return;
    }

    if (this.gameState === 'gameover' || this.gameState === 'victory' || this.gameState === 'level_transition') {
      this.inputHandler.update();
      // Continue updating explosions for visual flair
      this.explosions.forEach(ex => ex.update(deltaTime));
      return;
    }

    // Update Player Input/State
    this.player.update(deltaTime);

    // Apply Physics to Player
    this.physicsSystem.update(this.player, this.currentLevel, deltaTime);

    // Clamp player to level bounds
    if (this.player.x > this.currentLevel.width - this.player.width) {
      this.player.x = this.currentLevel.width - this.player.width;
    }

    // Update Camera
    this.camera.follow(this.player, this.currentLevel.width, this.currentLevel.height);

    // Spawn Boss if near end
    if (!this.boss && this.currentLevel.boss && this.player.x > this.currentLevel.width - 400) {
      this.boss = new Boss(this.currentLevel.boss.x, this.currentLevel.boss.y, this.spawnProjectile);
    }

    // Update Boss
    if (this.boss && this.boss.active) {
      this.boss.update(deltaTime);
    }

    // Update Turrets
    this.turrets.forEach(t => t.update(deltaTime));

    // Update PowerUps
    this.powerUps.forEach(p => p.update(deltaTime));

    // Update Explosions
    this.explosions.forEach(ex => ex.update(deltaTime));

    // Update projectiles
    this.projectiles.forEach(p => p.update(deltaTime));
    
    // Update enemies
    this.enemies.forEach(e => {
      e.update(deltaTime);
      // Apply physics to enemies too (so they fall if they walk off edges)
      this.physicsSystem.update(e, this.currentLevel, deltaTime);
    });

    // Collision Detection: Projectiles
    this.projectiles.forEach(projectile => {
      if (!projectile.active) return;

      // Player Projectiles vs Enemies/Boss
      if (!projectile.isEnemy) {
        // Vs Enemies
        this.enemies.forEach(enemy => {
          if (!enemy.active) return;
          if (CollisionSystem.checkAABB(projectile, enemy)) {
            projectile.active = false;
            enemy.takeDamage(1);
            this.audioSystem.playEnemyHit();
            if (!enemy.active) {
              this.spawnExplosion(enemy.x, enemy.y);
            }
          }
        });

        // Vs Turrets
        this.turrets.forEach(turret => {
          if (!turret.active) return;
          if (CollisionSystem.checkAABB(projectile, turret)) {
            projectile.active = false;
            turret.takeDamage(1);
            this.audioSystem.playEnemyHit();
            if (!turret.active) {
              this.spawnExplosion(turret.x, turret.y);
            }
          }
        });

        // Vs Boss
        if (this.boss && this.boss.active && CollisionSystem.checkAABB(projectile, this.boss)) {
          projectile.active = false;
          this.boss.takeDamage(1);
          this.audioSystem.playEnemyHit();
          if (!this.boss.active) {
            this.spawnExplosion(this.boss.x + this.boss.width / 2 - 16, this.boss.y + this.boss.height / 2 - 16);
            this.gameState = 'level_transition';
            
            setTimeout(() => {
               this.loadNextLevel();
            }, 3000);
          }
        }
      } 
      // Enemy Projectiles vs Player
      else {
        if (CollisionSystem.checkAABB(projectile, this.player)) {
          projectile.active = false;
          if (this.player.takeDamage()) {
            if (this.player.lives <= 0) {
              this.gameState = 'gameover';
            }
            this.audioSystem.playEnemyHit();
          }
        }
      }
    });

    // Collision Detection: Player vs Enemies
    this.enemies.forEach(enemy => {
      if (!enemy.active) return;
      if (CollisionSystem.checkAABB(this.player, enemy)) {
        if (this.player.takeDamage()) {
          if (this.player.lives <= 0) {
            this.gameState = 'gameover';
          }
          this.audioSystem.playEnemyHit();
        }
      }
    });

    // Collision Detection: Player vs Turrets
    this.turrets.forEach(turret => {
      if (!turret.active) return;
      if (CollisionSystem.checkAABB(this.player, turret)) {
        if (this.player.takeDamage()) {
          if (this.player.lives <= 0) {
            this.gameState = 'gameover';
          }
          this.audioSystem.playEnemyHit();
        }
      }
    });

    // Collision Detection: Player vs Boss Body
    if (this.boss && this.boss.active && CollisionSystem.checkAABB(this.player, this.boss)) {
       if (this.player.takeDamage()) {
          if (this.player.lives <= 0) {
            this.gameState = 'gameover';
          }
          this.audioSystem.playEnemyHit();
       }
    }

    // Collision Detection: Player vs PowerUps
    this.powerUps.forEach(p => {
      if (!p.active) return;
      if (CollisionSystem.checkAABB(this.player, p)) {
        p.active = false;
        this.player.equipWeapon(p.type);
      }
    });

    // Cleanup inactive entities
    this.projectiles = this.projectiles.filter(p => p.active);
    this.enemies = this.enemies.filter(e => e.active);
    this.turrets = this.turrets.filter(t => t.active);
    this.powerUps = this.powerUps.filter(p => p.active);
    this.explosions = this.explosions.filter(e => e.active);

    // Clear frame inputs
    this.inputHandler.update();
  };

  private render = (): void => {
    // Clear screen
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    // Apply Camera Transform
    this.context.translate(-this.camera.x, -this.camera.y);

    // Render Level Background/Floor
    this.renderLevel();

    // Render Player
    if (this.gameState === 'playing') {
      this.player.render(this.context);
    }

    // Render Enemies
    this.enemies.forEach(e => e.render(this.context));

    // Render Turrets
    this.turrets.forEach(t => t.render(this.context));

    // Render PowerUps
    this.powerUps.forEach(p => p.render(this.context));

    // Render Boss
    if (this.boss && this.boss.active) {
      this.boss.render(this.context);
    }

    // Render Projectiles
    this.projectiles.forEach(p => p.render(this.context));

    // Render Explosions
    this.explosions.forEach(ex => ex.render(this.context));

    this.context.restore();

    // UI Overlay
    if (this.gameState === 'gameover') {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.context.fillStyle = '#ff0000';
      this.context.font = '48px monospace';
      this.context.textAlign = 'center';
      this.context.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
      
      this.context.fillStyle = '#ffffff';
      this.context.font = '24px monospace';
      this.context.fillText('Press R to Restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
      this.context.textAlign = 'left'; // Reset alignment
    } else if (this.gameState === 'level_transition') {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.context.fillStyle = '#ffff00';
      this.context.font = '48px monospace';
      this.context.textAlign = 'center';
      this.context.fillText('LEVEL COMPLETE', this.canvas.width / 2, this.canvas.height / 2);
      this.context.textAlign = 'left'; // Reset alignment
    } else if (this.gameState === 'victory') {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.context.fillStyle = '#00ff00';
      this.context.font = '48px monospace';
      this.context.textAlign = 'center';
      this.context.fillText('MISSION ACCOMPLISHED', this.canvas.width / 2, this.canvas.height / 2);
      
      this.context.fillStyle = '#ffffff';
      this.context.font = '24px monospace';
      this.context.fillText('Press R to Play Again', this.canvas.width / 2, this.canvas.height / 2 + 50);
      this.context.textAlign = 'left'; // Reset alignment
    } else {
      // Draw HUD / Instructions
      this.context.fillStyle = '#ffffff';
      this.context.font = '14px monospace';
      this.context.textAlign = 'left';
      this.context.fillText('CONTROLS:', 10, 20);
      this.context.fillText('Move: WASD / Arrows', 10, 40);
      this.context.fillText('Jump: Space / W', 10, 60);
      this.context.fillText('Shoot: J / Z', 10, 80);
      
      // Score / Status (Top Right)
      this.context.textAlign = 'right';
      this.context.fillText(`LEVEL: ${this.levelIndex + 1}`, this.canvas.width - 10, 20);
      this.context.fillText(`LIVES: ${this.player.lives}`, this.canvas.width - 10, 40);
      this.context.fillText(`ENEMIES: ${this.enemies.length}`, this.canvas.width - 10, 60);
      this.context.textAlign = 'left'; // Reset
    }
  };

  private renderLevel(): void {
    // Draw Ground
    this.context.fillStyle = '#333333';
    this.context.fillRect(0, this.currentLevel.groundY, this.currentLevel.width, this.currentLevel.height - this.currentLevel.groundY);
    
    // Draw Green Line on top of ground
    this.context.beginPath();
    this.context.moveTo(0, this.currentLevel.groundY);
    this.context.lineTo(this.currentLevel.width, this.currentLevel.groundY);
    this.context.strokeStyle = '#00ff00';
    this.context.lineWidth = 2;
    this.context.stroke();

    // Draw Platforms
    this.context.fillStyle = '#555555';
    this.currentLevel.platforms.forEach(platform => {
      this.context.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
  }
}
