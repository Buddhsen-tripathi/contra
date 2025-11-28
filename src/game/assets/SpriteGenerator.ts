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

  public static generatePowerUpSprite(): HTMLImageElement {
    // 24x24 sprite, 1 frame (floating icon)
    const width = 24;
    const height = 24;
    const canvas = this.createBuffer(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    // Background (Winged capsule shape)
    ctx.fillStyle = '#ff0000'; // Red background
    ctx.beginPath();
    ctx.ellipse(12, 12, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Letter 'S'
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', 12, 13);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public static generateTurretSprite(): HTMLImageElement {
    // 32x32 sprite, 1 frame (base + rotating gun)
    // Actually, let's just draw it facing left for now
    const width = 32;
    const height = 32;
    const canvas = this.createBuffer(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    // Base
    ctx.fillStyle = '#444444';
    ctx.beginPath();
    ctx.arc(16, 24, 12, Math.PI, 0); // Semi-circle base
    ctx.fill();

    // Gun Mount
    ctx.fillStyle = '#888888';
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.fill();

    // Barrel (pointing left default)
    ctx.fillStyle = '#222222';
    ctx.fillRect(4, 12, 12, 8);

    // Red light/sensor
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(14, 14, 4, 4);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public static generateExplosionSprite(): HTMLImageElement {
    // 32x32 sprite, 4 frames
    const width = 32;
    const height = 32;
    const canvas = this.createBuffer(width * 4, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    for (let i = 0; i < 4; i++) {
      const offsetX = i * width;
      const centerX = offsetX + 16;
      const centerY = 16;
      
      // Colors
      const inner = '#ffff00'; // Yellow
      const mid = '#ff8800'; // Orange
      const outer = '#ff0000'; // Red
      const smoke = '#888888'; // Grey

      if (i === 0) {
        // Small spark
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (i === 1) {
        // Expanding fireball
        ctx.fillStyle = mid;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (i === 2) {
        // Large fireball
        ctx.fillStyle = outer;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = mid;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Dissipating smoke
        ctx.fillStyle = smoke;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = outer; // Fading core
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public static generateDroneSprite(): HTMLImageElement {
    // 32x32 sprite, 2 frames (hover)
    const width = 32;
    const height = 32;
    const canvas = this.createBuffer(width * 2, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    for (let i = 0; i < 2; i++) {
      const offsetX = i * width;
      const yOffset = i === 0 ? 0 : 2; // Bobbing effect

      // Body (Sphere)
      ctx.fillStyle = '#8888aa'; // Blue-ish metal
      ctx.beginPath();
      ctx.arc(offsetX + 16, 16 + yOffset, 10, 0, Math.PI * 2);
      ctx.fill();

      // Eye (Red)
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(offsetX + 16, 16 + yOffset, 4, 0, Math.PI * 2);
      ctx.fill();

      // Propellers/Wings
      ctx.fillStyle = '#444444';
      ctx.fillRect(offsetX + 2, 14 + yOffset, 8, 4); // Left
      ctx.fillRect(offsetX + 22, 14 + yOffset, 8, 4); // Right
      
      // Antenna
      ctx.strokeStyle = '#aaaaaa';
      ctx.beginPath();
      ctx.moveTo(offsetX + 16, 6 + yOffset);
      ctx.lineTo(offsetX + 16, 2 + yOffset);
      ctx.stroke();
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public static generateAlienHeartSprite(): HTMLImageElement {
    // 128x128 sprite, 2 frames (Pulsating)
    const width = 128;
    const height = 128;
    const canvas = this.createBuffer(width * 2, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    for (let i = 0; i < 2; i++) {
      const offsetX = i * width;
      const scale = i === 0 ? 1 : 1.1; // Pulse scale
      
      const centerX = offsetX + 64;
      const centerY = 64;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);

      // Heart Shape
      ctx.fillStyle = '#aa0000'; // Dark Red
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 40);
      ctx.bezierCurveTo(centerX + 50, centerY, centerX + 60, centerY - 40, centerX, centerY - 20);
      ctx.bezierCurveTo(centerX - 60, centerY - 40, centerX - 50, centerY, centerX, centerY + 40);
      ctx.fill();

      // Veins
      ctx.strokeStyle = '#ff0000'; // Bright Red
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 30);
      ctx.lineTo(centerX, centerY - 10);
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + 20, centerY - 10);
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX - 20, centerY - 10);
      ctx.stroke();

      // Eyes (Alien features)
      ctx.fillStyle = '#ffff00'; // Yellow eyes
      ctx.beginPath();
      ctx.ellipse(centerX - 20, centerY - 20, 8, 12, -0.2, 0, Math.PI * 2);
      ctx.ellipse(centerX + 20, centerY - 20, 8, 12, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  public static generateHeartSprite(): HTMLImageElement {
    // 16x16 sprite, 1 frame
    const width = 16;
    const height = 16;
    const canvas = this.createBuffer(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get context');

    // Heart Shape
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(8, 14);
    ctx.bezierCurveTo(16, 8, 16, 2, 8, 4);
    ctx.bezierCurveTo(0, 2, 0, 8, 8, 14);
    ctx.fill();

    // Shine
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 4, 2, 2);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }
}
