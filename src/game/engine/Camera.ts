import { Entity } from '../core/Entity';

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public follow(target: Entity, mapWidth: number, mapHeight: number): void {
    // Center the camera on the target
    this.x = target.x - this.width / 2 + target.width / 2;
    
    // Optional: Vertical following (usually locked or limited in Contra)
    // For now, let's keep Y fixed or simple
    // this.y = target.y - this.height / 2;

    // Clamp to map bounds
    this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, mapHeight - this.height));
  }
}
