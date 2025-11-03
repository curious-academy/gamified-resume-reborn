import Phaser from 'phaser';

/**
 * Configuration du joueur
 */
interface PlayerConfig {
  speed?: number;
  runSpeed?: number;
  size?: number;
  scale?: number;
}

/**
 * Classe représentant le joueur dans le jeu
 */
export class Player extends Phaser.GameObjects.Rectangle {
  private keys?: { [key: string]: Phaser.Input.Keyboard.Key };
  private readonly speed: number;
  private readonly runSpeed: number;
  private isMoving: boolean = false;
  private direction: string = 'down';
  private movementParticles?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number, config: PlayerConfig = {}) {
    const size = config.size ?? 32;
    super(scene, x, y, size, size, 0x00ff00);

    // Configuration
    this.speed = config.speed ?? 150;
    this.runSpeed = config.runSpeed ?? 250;
    const scale = config.scale ?? 1.5;

    // Configuration du sprite
    this.setOrigin(0.5, 1); // Origine en bas au centre pour FF6 style
    this.setScale(scale);

    // Ajouter à la scène
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuration physique
    this.setupPhysics(size);

    // Configurer les contrôles
    this.setupControls();

    // Créer des particules pour l'effet de mouvement
    this.createMovementParticles();
  }

  /**
   * Configure les propriétés physiques du joueur
   */
  private setupPhysics(size: number): void {
    if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setSize(size / 2, size / 2); // Boîte de collision plus petite
      this.body.setOffset(size / 4, size / 2); // Ajuster l'offset
      this.body.setCollideWorldBounds(true);
    }
  }

  /**
   * Configure les contrôles clavier
   */
  private setupControls(): void {
    this.keys = this.scene.input.keyboard?.addKeys({
      Z: 'Z',
      Q: 'Q',
      S: 'S',
      D: 'D',
      W: 'W',
      A: 'A',
      SHIFT: 'SHIFT'
    }) as { [key: string]: Phaser.Input.Keyboard.Key };
  }

  /**
   * Crée les particules pour l'effet de mouvement
   */
  private createMovementParticles(): void {
    // Créer une texture pour les particules
    this.scene.add.graphics()
      .fillStyle(0xffffff, 0.8)
      .fillCircle(2, 2, 2)
      .generateTexture('particle', 4, 4);

    // Créer l'émetteur de particules
    this.movementParticles = this.scene.add.particles(this.x, this.y, 'particle', {
      speed: { min: 20, max: 40 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300,
      quantity: 2,
      emitting: false
    });
  }

  /**
   * Met à jour la direction du joueur et son apparence
   */
  private updateDirection(newDirection: string): void {
    if (this.direction !== newDirection) {
      this.direction = newDirection;

      // Changer la couleur selon la direction pour visualiser l'orientation
      const directionColors: Record<string, number> = {
        up: 0x0000ff,    // Bleu
        down: 0x00ff00,  // Vert
        left: 0xff0000,  // Rouge
        right: 0xffff00  // Jaune
      };

      this.setFillStyle(directionColors[newDirection] ?? 0x00ff00);
    }
  }

  /**
   * Applique les effets visuels selon l'état du joueur
   */
  private applyMovementEffects(isRunning: boolean): void {
    if (!this.isMoving) {
      // Retour à la normale quand immobile
      this.setAlpha(1);
      this.setScale(1.5);
      this.movementParticles?.stop();
      return;
    }

    if (isRunning) {
      // Effet plus intense pour la course
      this.setAlpha(0.7 + Math.sin(Date.now() * 0.02) * 0.3);
      this.setScale(1.5 + Math.sin(Date.now() * 0.02) * 0.1);
      
      if (this.movementParticles) {
        this.movementParticles.setPosition(this.x, this.y);
        this.movementParticles.start();
      }
    } else {
      // Effet plus doux pour la marche
      this.setAlpha(0.8 + Math.sin(Date.now() * 0.01) * 0.2);
      this.setScale(1.5);
      this.movementParticles?.stop();
    }
  }

  /**
   * Met à jour l'état du joueur à chaque frame
   */
  override update(): void {
    if (!this.keys || !this.body) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Déterminer la vitesse (course si Shift est pressé)
    const isRunning = this.keys['SHIFT']?.isDown ?? false;
    const currentSpeed = isRunning ? this.runSpeed : this.speed;

    // Réinitialiser la vélocité
    body.setVelocity(0);
    this.isMoving = false;

    let newDirection = this.direction;

    // Gestion des mouvements horizontaux
    // Q (AZERTY) ou A (QWERTY) = Gauche
    if (this.keys['Q']?.isDown || this.keys['A']?.isDown) {
      body.setVelocityX(-currentSpeed);
      newDirection = 'left';
      this.isMoving = true;
    } 
    // D = Droite (même pour AZERTY et QWERTY)
    else if (this.keys['D']?.isDown) {
      body.setVelocityX(currentSpeed);
      newDirection = 'right';
      this.isMoving = true;
    }

    // Gestion des mouvements verticaux
    // Z (AZERTY) ou W (QWERTY) = Haut
    if (this.keys['Z']?.isDown || this.keys['W']?.isDown) {
      body.setVelocityY(-currentSpeed);
      newDirection = 'up';
      this.isMoving = true;
    } 
    // S = Bas (même pour AZERTY et QWERTY)
    else if (this.keys['S']?.isDown) {
      body.setVelocityY(currentSpeed);
      newDirection = 'down';
      this.isMoving = true;
    }

    // Mettre à jour la direction et les effets visuels
    if (this.isMoving) {
      this.updateDirection(newDirection);
    }
    
    this.applyMovementEffects(isRunning);
  }

  /**
   * Récupère la direction actuelle du joueur
   */
  getDirection(): string {
    return this.direction;
  }

  /**
   * Récupère l'état de mouvement du joueur
   */
  getIsMoving(): boolean {
    return this.isMoving;
  }
}
