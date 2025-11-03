import Phaser from 'phaser';

/**
 * Configuration for the terminal entity
 */
interface TerminalConfig {
  size?: number;
  color?: number;
  interactionRadius?: number;
}

/**
 * Terminal entity that players can interact with
 * Represented by a purple square
 */
export class Terminal extends Phaser.GameObjects.Rectangle {
  private readonly interactionRadius: number;
  private interactionZone?: Phaser.GameObjects.Zone;
  private glowEffect?: Phaser.GameObjects.Rectangle;
  
  constructor(scene: Phaser.Scene, x: number, y: number, config: TerminalConfig = {}) {
    const size = config.size ?? 32;
    const color = config.color ?? 0x9932CC; // Purple color
    
    super(scene, x, y, size, size, color);
    
    this.interactionRadius = config.interactionRadius ?? 60;
    
    // Setup the terminal sprite
    this.setOrigin(0, 0);
    this.setStrokeStyle(2, 0xFFFFFF, 0.8);
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static physics body
    
    // Create interaction zone
    this.createInteractionZone();
    
    // Create glow effect
    this.createGlowEffect();
    
    // Add pulsing animation
    this.addPulseAnimation();
  }
  
  /**
   * Creates an invisible interaction zone around the terminal
   */
  private createInteractionZone(): void {
    this.interactionZone = this.scene.add.zone(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.interactionRadius * 2,
      this.interactionRadius * 2
    );
    
    this.scene.physics.add.existing(this.interactionZone);
    
    // Enable debug visualization if needed
    if (this.scene.physics.world.drawDebug) {
      const debugGraphics = this.scene.add.graphics();
      debugGraphics.lineStyle(2, 0xFF00FF, 0.3);
      debugGraphics.strokeCircle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.interactionRadius
      );
    }
  }
  
  /**
   * Creates a glowing effect around the terminal
   */
  private createGlowEffect(): void {
    const size = this.width;
    this.glowEffect = this.scene.add.rectangle(
      this.x,
      this.y,
      size + 8,
      size + 8,
      0x9932CC,
      0.3
    );
    this.glowEffect.setOrigin(0, 0);
    this.glowEffect.setVisible(false);
  }
  
  /**
   * Adds a subtle pulsing animation to the terminal
   */
  private addPulseAnimation(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  /**
   * Shows the glow effect (when player is nearby)
   */
  showGlow(): void {
    if (this.glowEffect) {
      this.glowEffect.setVisible(true);
      
      // Animate glow
      this.scene.tweens.add({
        targets: this.glowEffect,
        alpha: 0.6,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
  
  /**
   * Hides the glow effect
   */
  hideGlow(): void {
    if (this.glowEffect) {
      this.scene.tweens.killTweensOf(this.glowEffect);
      this.glowEffect.setVisible(false);
    }
  }
  
  /**
   * Gets the interaction zone for collision detection
   */
  getInteractionZone(): Phaser.GameObjects.Zone | undefined {
    return this.interactionZone;
  }
  
  /**
   * Checks if a point is within interaction range
   */
  isInRange(x: number, y: number): boolean {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const distance = Phaser.Math.Distance.Between(centerX, centerY, x, y);
    return distance <= this.interactionRadius;
  }
  
  /**
   * Cleanup when destroying the terminal
   */
  override destroy(fromScene?: boolean): void {
    this.scene.tweens.killTweensOf(this);
    if (this.glowEffect) {
      this.scene.tweens.killTweensOf(this.glowEffect);
      this.glowEffect.destroy();
    }
    if (this.interactionZone) {
      this.interactionZone.destroy();
    }
    super.destroy(fromScene);
  }
}
