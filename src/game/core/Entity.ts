export interface IEntity {
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
}

export abstract class Entity implements IEntity {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public vx: number = 0;
  public vy: number = 0;
  public isGrounded: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  abstract update(deltaTime: number): void;
  abstract render(context: CanvasRenderingContext2D): void;
}
