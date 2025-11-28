export class Sprite {
  private image: HTMLImageElement;
  private frameWidth: number;
  private frameHeight: number;
  private frameCount: number;
  private currentFrame: number = 0;
  private animationSpeed: number; // frames per second
  private timer: number = 0;
  private isPlaying: boolean = true;

  constructor(image: HTMLImageElement, frameWidth: number, frameHeight: number, animationSpeed: number = 8) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = Math.floor(image.width / frameWidth);
    this.animationSpeed = animationSpeed;
  }

  public update(deltaTime: number): void {
    if (!this.isPlaying) return;

    this.timer += deltaTime;
    if (this.timer >= 1 / this.animationSpeed) {
      this.timer = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  public setAnimation(speed: number): void {
    this.animationSpeed = speed;
  }

  public setFrame(frameIndex: number): void {
    if (frameIndex >= 0 && frameIndex < this.frameCount) {
      this.currentFrame = frameIndex;
    }
  }

  public render(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, flipX: boolean = false): void {
    context.save();
    
    // Disable smoothing for pixel art look
    context.imageSmoothingEnabled = false;

    if (flipX) {
      // Translate to the center of the sprite, scale, then translate back
      // Actually simpler: translate to right edge, scale -1, draw at 0
      context.translate(x + width, y);
      context.scale(-1, 1);
      context.drawImage(
        this.image,
        this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight,
        0, 0, width, height
      );
    } else {
      context.drawImage(
        this.image,
        this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight,
        x, y, width, height
      );
    }
    context.restore();
  }
}
