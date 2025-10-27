import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Phaser, { Scene } from 'phaser';

class Player extends Phaser.GameObjects.Rectangle {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: { [key: string]: Phaser.Input.Keyboard.Key };
  private speed: number = 150;
  private runSpeed: number = 250;
  private isMoving: boolean = false;
  private direction: string = 'down';
  private movementParticles?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 32, 32, 0x00ff00);

    // Configuration du sprite
    this.setOrigin(0.5, 1); // Origine en bas au centre pour FF6 style
    this.setScale(1.5); // Agrandir le sprite

    // Ajouter à la scène
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuration physique
    if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setSize(16, 16); // Boîte de collision plus petite
      this.body.setOffset(8, 16); // Ajuster l'offset
      this.body.setCollideWorldBounds(true);
    }

    // Configurer les contrôles
    this.cursors = scene.input.keyboard?.createCursorKeys();
    this.keys = scene.input.keyboard?.addKeys('SHIFT') as { [key: string]: Phaser.Input.Keyboard.Key };

    // Créer des particules pour l'effet de mouvement
    this.createMovementParticles();
  }

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

  private updateDirection(newDirection: string): void {
    if (this.direction !== newDirection) {
      this.direction = newDirection;

      // Changer la couleur selon la direction pour visualiser l'orientation
      switch (newDirection) {
        case 'up':
          this.setFillStyle(0x0000ff); // Bleu pour haut
          break;
        case 'down':
          this.setFillStyle(0x00ff00); // Vert pour bas
          break;
        case 'left':
          this.setFillStyle(0xff0000); // Rouge pour gauche
          break;
        case 'right':
          this.setFillStyle(0xffff00); // Jaune pour droite
          break;
      }
    }
  }  override update(): void {
    if (!this.cursors || !this.body) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Déterminer la vitesse (course si Shift est pressé)
    const currentSpeed = (this.keys?.['SHIFT']?.isDown) ? this.runSpeed : this.speed;
    const isRunning = this.keys?.['SHIFT']?.isDown || false;

    // Réinitialiser la vélocité
    body.setVelocity(0);
    this.isMoving = false;

    // Gestion des mouvements avec priorité diagonale
    let newDirection = this.direction;

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-currentSpeed);
      newDirection = 'left';
      this.isMoving = true;
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(currentSpeed);
      newDirection = 'right';
      this.isMoving = true;
    }

    if (this.cursors.up?.isDown) {
      body.setVelocityY(-currentSpeed);
      newDirection = 'up';
      this.isMoving = true;
    } else if (this.cursors.down?.isDown) {
      body.setVelocityY(currentSpeed);
      newDirection = 'down';
      this.isMoving = true;
    }

    // Mettre à jour la direction visuellement
    if (this.isMoving) {
      this.updateDirection(newDirection);

      // Effet visuel selon le mode de déplacement
      if (isRunning) {
        // Effet plus intense pour la course
        this.setAlpha(0.7 + Math.sin(Date.now() * 0.02) * 0.3);
        this.setScale(1.5 + Math.sin(Date.now() * 0.02) * 0.1);

        // Activer les particules pour la course
        if (this.movementParticles) {
          this.movementParticles.setPosition(this.x, this.y);
          this.movementParticles.start();
        }
      } else {
        // Effet plus doux pour la marche
        this.setAlpha(0.8 + Math.sin(Date.now() * 0.01) * 0.2);
        this.setScale(1.5);

        // Arrêter les particules pour la marche
        if (this.movementParticles) {
          this.movementParticles.stop();
        }
      }
    } else {
      // Retour à la normale quand immobile
      this.setAlpha(1);
      this.setScale(1.5);

      // Arrêter les particules
      if (this.movementParticles) {
        this.movementParticles.stop();
      }
    }
  }
}

class GameScene extends Phaser.Scene {
  private player?: Player;
  private walls?: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // Créer des assets temporaires avec des formes géométriques
    this.createTemporaryAssets();
  }

  private createTemporaryAssets(): void {
    // Créer un sprite temporaire pour le joueur
    this.add.graphics()
      .fillStyle(0x00ff00)
      .fillRect(0, 0, 32, 32)
      .generateTexture('player-temp', 32, 32);

    // Créer des textures pour les différentes directions
    const graphics = this.add.graphics();

    // Texture pour l'herbe
    graphics.clear();
    graphics.fillStyle(0x228B22);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x32CD32);
    graphics.fillRect(2, 2, 28, 28);
    graphics.generateTexture('grass-temp', 32, 32);

    // Texture pour les murs
    graphics.clear();
    graphics.fillStyle(0x696969);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x808080);
    graphics.fillRect(4, 4, 24, 24);
    graphics.generateTexture('wall-temp', 32, 32);

    graphics.destroy();
  }

  create(): void {
    // Créer le fond ou la carte
    this.createMap();

    // Créer le joueur
    this.player = new Player(this, 400, 300);

    // Configurer les collisions entre le joueur et les murs
    if (this.walls && this.player) {
      this.physics.add.collider(this.player, this.walls);
    }

    // Configurer la caméra pour suivre le joueur
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5); // Zoom légèrement plus proche
    this.cameras.main.setLerp(0.1, 0.1); // Mouvement fluide de la caméra
  }

  private createMap(): void {
    // Créer une carte basique avec de l'herbe et quelques obstacles
    const mapWidth = 25;
    const mapHeight = 20;

    // Créer le sol en herbe
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        this.add.image(x * 32, y * 32, 'grass-temp').setOrigin(0, 0);
      }
    }

    // Créer des murs sur les bordures
    const walls = this.physics.add.staticGroup();

    // Murs horizontaux (haut et bas)
    for (let x = 0; x < mapWidth; x++) {
      const topWall = this.add.image(x * 32, 0, 'wall-temp').setOrigin(0, 0);
      const bottomWall = this.add.image(x * 32, (mapHeight - 1) * 32, 'wall-temp').setOrigin(0, 0);
      walls.add(topWall);
      walls.add(bottomWall);
    }

    // Murs verticaux (gauche et droite)
    for (let y = 1; y < mapHeight - 1; y++) {
      const leftWall = this.add.image(0, y * 32, 'wall-temp').setOrigin(0, 0);
      const rightWall = this.add.image((mapWidth - 1) * 32, y * 32, 'wall-temp').setOrigin(0, 0);
      walls.add(leftWall);
      walls.add(rightWall);
    }

    // Quelques obstacles dans la carte
    const obstacles = [
      { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
      { x: 15, y: 8 }, { x: 16, y: 8 },
      { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 12, y: 12 },
    ];

    obstacles.forEach(pos => {
      const obstacle = this.add.image(pos.x * 32, pos.y * 32, 'wall-temp').setOrigin(0, 0);
      walls.add(obstacle);
    });

    // Stocker le groupe de murs pour les collisions
    this.walls = walls;
  }

  override update(): void {
    // Mettre à jour le joueur
    this.player?.update();
  }
}



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('main-app');

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }, // Pas de gravité pour un jeu 2D top-down
          debug: false // Mettre à true pour voir les boîtes de collision
        }
      },
      scene: GameScene,
      pixelArt: true, // Pour un rendu pixel art style rétro
      antialias: false
    };

    const game = new Phaser.Game(config);
  }
}
