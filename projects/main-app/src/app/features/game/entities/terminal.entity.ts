import Phaser from 'phaser';

/**
 * Configuration du terminal
 */
interface TerminalConfig {
  size?: number;
  color?: number;
  proximityRadius?: number;
}

/**
 * Classe représentant un terminal d'accès dans le jeu
 */
export class Terminal extends Phaser.GameObjects.Rectangle {
  private readonly proximityRadius: number;
  private isPlayerNearby: boolean = false;
  private glowEffect?: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, config: TerminalConfig = {}) {
    const size = config.size ?? 32;
    const color = config.color ?? 0x9400d3; // Purple color

    super(scene, x, y, size, size, color);

    // Configuration
    this.proximityRadius = config.proximityRadius ?? 80;

    // Configuration du sprite
    this.setOrigin(0.5, 0.5);

    // Ajouter à la scène
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Créer l'effet de glow
    this.createGlowEffect();
  }

  /**
   * Crée un effet de lueur autour du terminal
   */
  private createGlowEffect(): void {
    this.glowEffect = this.scene.add.rectangle(
      this.x,
      this.y,
      this.width + 8,
      this.height + 8,
      0x9400d3,
      0.3
    );
    this.glowEffect.setOrigin(0.5, 0.5);

    // Animation de la lueur
    this.scene.tweens.add({
      targets: this.glowEffect,
      alpha: { from: 0.3, to: 0.1 },
      scaleX: { from: 1, to: 1.2 },
      scaleY: { from: 1, to: 1.2 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Vérifie si le joueur est à proximité du terminal
   * @param playerX Position X du joueur
   * @param playerY Position Y du joueur
   * @returns true si le joueur est à proximité
   */
  checkProximity(playerX: number, playerY: number): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      playerX,
      playerY
    );

    const wasNearby = this.isPlayerNearby;
    this.isPlayerNearby = distance <= this.proximityRadius;

    // Changer la couleur du terminal si le joueur est proche
    if (this.isPlayerNearby && !wasNearby) {
      this.setFillStyle(0xba55d3); // Lighter purple when nearby
    } else if (!this.isPlayerNearby && wasNearby) {
      this.setFillStyle(0x9400d3); // Original purple when far
    }

    return this.isPlayerNearby;
  }

  /**
   * Retourne l'état de proximité actuel
   */
  getIsPlayerNearby(): boolean {
    return this.isPlayerNearby;
  }

  /**
   * Nettoie les ressources utilisées par le terminal
   */
  override destroy(fromScene?: boolean): void {
    this.glowEffect?.destroy();
    super.destroy(fromScene);
  }
}
