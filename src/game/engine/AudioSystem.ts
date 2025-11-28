export class AudioSystem {
  private context: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.context = new AudioContextClass();
      }
    }
  }

  public resume(): void {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public playShoot(): void {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // Retro "Pew" sound: Square wave dropping in pitch
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  public playJump(): void {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // Jump sound: Rising pitch
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.context.currentTime);
    osc.frequency.linearRampToValueAtTime(300, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  public playEnemyHit(): void {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // Hit sound: Low noise-like (sawtooth for now)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  public playPowerUp(): void {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // PowerUp sound: High pitched rising sequence
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.context.currentTime);
    osc.frequency.setValueAtTime(554, this.context.currentTime + 0.1); // C#
    osc.frequency.setValueAtTime(659, this.context.currentTime + 0.2); // E
    osc.frequency.setValueAtTime(880, this.context.currentTime + 0.3); // A

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.4);

    osc.start();
    osc.stop(this.context.currentTime + 0.4);
  }

  public playExplosion(): void {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // Explosion: Low frequency sawtooth dropping pitch + noise simulation
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.context.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }

  public playTurretShoot(): void {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // Turret: Lower pitch "Thump"
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);

    osc.start();
    osc.stop(this.context.currentTime + 0.15);
  }

  public playLifeUp(): void {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // Life Up: 1-Up sound (Mario-ish arpeggio)
    osc.type = 'square';
    const now = this.context.currentTime;

    osc.frequency.setValueAtTime(659, now); // E5
    osc.frequency.setValueAtTime(784, now + 0.1); // G5
    osc.frequency.setValueAtTime(1318, now + 0.2); // E6
    osc.frequency.setValueAtTime(1046, now + 0.3); // C6
    osc.frequency.setValueAtTime(1568, now + 0.4); // G6
    osc.frequency.setValueAtTime(2093, now + 0.5); // C7

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
    gain.gain.linearRampToValueAtTime(0, now + 0.6);

    osc.start();
    osc.stop(now + 0.6);
  }
}
