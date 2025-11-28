import { Entity } from '../core/Entity';
import { LevelData } from '../levels/Level1';

export class PhysicsSystem {
  private readonly GRAVITY: number = 1000;

  public update(entity: Entity, level: LevelData, deltaTime: number): void {
    // Apply Gravity
    entity.vy += this.GRAVITY * deltaTime;
    entity.y += entity.vy * deltaTime;

    // Reset grounded state temporarily (will be re-confirmed by collision)
    // We don't set it to false immediately here because we want to check collisions first?
    // Actually, we assume false until proven true by collision.
    entity.isGrounded = false;

    this.checkCollisions(entity, level);
  }

  private checkCollisions(entity: Entity, level: LevelData): void {
    // 1. Check Ground (Bottom of level)
    if (entity.y + entity.height >= level.groundY) {
      entity.y = level.groundY - entity.height;
      entity.vy = 0;
      entity.isGrounded = true;
      return; // Priority to ground
    }

    // 2. Check Platforms (One-way / Jump-through)
    // Only collide if falling (vy >= 0)
    if (entity.vy >= 0) {
      for (const platform of level.platforms) {
        // Horizontal overlap check
        if (
          entity.x + entity.width > platform.x &&
          entity.x < platform.x + platform.width
        ) {
          // Vertical check: Did we fall *into* the platform from above?
          // We check if the entity's feet are currently within the platform's vertical range.
          // Since we already moved Y by velocity, we are checking the "current" position.
          // To be robust, we should check if we were above it previous frame, but for simple physics:
          // Check if feet are near the top of the platform.
          
          const feetY = entity.y + entity.height;
          // Tolerance: The entity must be close to the top edge.
          // If they are deep inside, they probably jumped up into it.
          // Since we move in small steps, checking if feet are just below the top edge works well.
          const tolerance = 10; // pixels

          if (feetY >= platform.y && feetY <= platform.y + tolerance + platform.height) {
             // Snap to top
             entity.y = platform.y - entity.height;
             entity.vy = 0;
             entity.isGrounded = true;
             return; // Landed
          }
        }
      }
    }
  }
}
