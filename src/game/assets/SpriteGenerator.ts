export class SpriteGenerator {
  private static createBuffer(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  public static generatePlayerSprite(): HTMLImageElement {
    // 32x64 sprite, 4 frames: Idle, Run1, Run2, Jump
    // Total width: 128
    const width = 32;
    const height = 64;
    const canvas = this.createBuffer(width * 4, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    // Common colors
    const skin = '#ffccaa';
    const pants = '#0000aa'; // Blue pants
    const vest = '#aa0000'; // Red vest (classic Contra)
    const hair = '#553300';

    for (let i = 0; i < 4; i++) {
      const offsetX = i * width;
      
      // Draw Body (Vest)
      ctx.fillStyle = vest;
      ctx.fillRect(offsetX + 8, 20, 16, 20);

      // Draw Head
      ctx.fillStyle = skin;
      ctx.fillRect(offsetX + 10, 4, 12, 14);
      
      // Draw Hair (Bandana?)
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(offsetX + 10, 4, 12, 4); // Bandana
      ctx.fillRect(offsetX + 22, 6, 4, 4); // Knot

      // Draw Legs (Pants)
      ctx.fillStyle = pants;
      
      if (i === 0) { // Idle
        ctx.fillRect(offsetX + 8, 40, 6, 24); // Left leg
        ctx.fillRect(offsetX + 18, 40, 6, 24); // Right leg
      } else if (i === 1) { // Run 1
        ctx.fillRect(offsetX + 6, 40, 6, 20); // Left leg back
        ctx.fillRect(offsetX + 20, 40, 6, 24); // Right leg forward
      } else if (i === 2) { // Run 2
        ctx.fillRect(offsetX + 10, 40, 6, 24); // Left leg forward
        ctx.fillRect(offsetX + 16, 40, 6, 20); // Right leg back
      } else { // Jump
        ctx.fillRect(offsetX + 6, 40, 8, 16); // Legs tucked
        ctx.fillRect(offsetX + 18, 44, 8, 12);
      }

      // Arms (Skin)
      ctx.fillStyle = skin;
      ctx.fillRect(offsetX + 6, 22, 4, 14); // Left arm
      ctx.fillRect(offsetX + 22, 22, 10, 6); // Right arm holding gun
      
      // Gun (Black)
      ctx.fillStyle = '#333333';
      ctx.fillRect(offsetX + 28, 20, 12, 6); // Barrel
      ctx.fillRect(offsetX + 24, 22, 6, 8); // Stock
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public static generateEnemySprite(): HTMLImageElement {
    // 32x64 sprite, 2 frames: Run1, Run2
    const width = 32;
    const height = 64;
    const canvas = this.createBuffer(width * 2, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    const skin = '#ccaa88';
    const uniform = '#00aa00'; // Green uniform

    for (let i = 0; i < 2; i++) {
      const offsetX = i * width;

      // Body
      ctx.fillStyle = uniform;
      ctx.fillRect(offsetX + 8, 20, 16, 20);
      
      // Head
      ctx.fillStyle = skin;
      ctx.fillRect(offsetX + 10, 4, 12, 14);
      
      // Helmet
      ctx.fillStyle = '#005500';
      ctx.fillRect(offsetX + 8, 2, 16, 6);

      // Legs
      ctx.fillStyle = uniform;
      if (i === 0) {
        ctx.fillRect(offsetX + 8, 40, 6, 24);
        ctx.fillRect(offsetX + 18, 40, 6, 24);
      } else {
        ctx.fillRect(offsetX + 6, 40, 6, 20);
        ctx.fillRect(offsetX + 20, 40, 6, 24);
      }

      // Gun
      ctx.fillStyle = '#555555';
      ctx.fillRect(offsetX + 4, 28, 20, 6);
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public static generateBossSprite(): HTMLImageElement {
    // 96x96 sprite, 2 frames: Idle, Attack
    const width = 96;
    const height = 96;
    const canvas = this.createBuffer(width * 2, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    const metal = '#888888';
    const darkMetal = '#444444';
    const core = '#ff0000'; // Red core

    for (let i = 0; i < 2; i++) {
      const offsetX = i * width;

      // Main Body (Box)
      ctx.fillStyle = metal;
      ctx.fillRect(offsetX + 10, 10, 76, 76);
      
      // Border/Rivets
      ctx.fillStyle = darkMetal;
      ctx.fillRect(offsetX + 10, 10, 76, 10); // Top
      ctx.fillRect(offsetX + 10, 76, 76, 10); // Bottom
      ctx.fillRect(offsetX + 10, 10, 10, 76); // Left
      ctx.fillRect(offsetX + 76, 10, 10, 76); // Right

      // Core (The eye/weak point)
      if (i === 1) { // Attack Frame (Open)
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(offsetX + 48, 48, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 4;
        ctx.stroke();
      } else { // Idle Frame (Closed/Blinking)
        ctx.fillStyle = '#220000'; // Dark red
        ctx.beginPath();
        ctx.arc(offsetX + 48, 48, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Guns (Side turrets)
      ctx.fillStyle = '#222222';
      ctx.fillRect(offsetX + 0, 30, 10, 36); // Left gun
      ctx.fillRect(offsetX + 86, 30, 10, 36); // Right gun
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }
}
