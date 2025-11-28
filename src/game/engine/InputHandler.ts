export class InputHandler {
  private keys: Set<string> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  public cleanup(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    this.keys.add(event.code);
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };

  public isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  // Helper for common movement keys
  public getAxisX(): number {
    let x = 0;
    if (this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD')) x += 1;
    if (this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA')) x -= 1;
    return x;
  }

  public getAxisY(): number {
    let y = 0;
    if (this.isKeyDown('ArrowDown') || this.isKeyDown('KeyS')) y += 1;
    if (this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW')) y -= 1;
    return y;
  }

  public isJumpDown(): boolean {
    return this.isKeyDown('Space') || this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW');
  }

  public isFirePressed(): boolean {
    return this.isKeyDown('KeyJ') || this.isKeyDown('KeyZ');
  }
}
