import Phaser from 'phaser';
import { Player } from '../entities/player.entity';
import { Terminal } from '../entities/terminal.entity';
import { TerminalService } from '../../../core/services/terminal.service';

/**
 * Configuration de la carte
 */
interface MapConfig {
  width?: number;
  height?: number;
  tileSize?: number;
}

/**
 * Configuration de la scène incluant les services Angular
 */
export interface GameSceneConfig extends MapConfig {
  terminalService?: TerminalService;
}

/**
 * Scène principale du jeu
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private terminal?: Terminal;
  private walls?: Phaser.Physics.Arcade.StaticGroup;
  private readonly mapConfig: Required<MapConfig>;
  private readonly terminalService?: TerminalService;

  constructor(config: GameSceneConfig = {}) {
    super({ key: 'GameScene' });

    this.mapConfig = {
      width: config.width ?? 25,
      height: config.height ?? 20,
      tileSize: config.tileSize ?? 32
    };

    this.terminalService = config.terminalService;
  }

  preload(): void {
    this.createTemporaryAssets();
  }

  /**
   * Crée des assets temporaires pour le prototype
   */
  private createTemporaryAssets(): void {
    const graphics = this.add.graphics();

    // Texture pour le joueur
    graphics.clear();
    graphics.fillStyle(0x00ff00);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('player-temp', 32, 32);

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
    this.createMap();
    this.createPlayer();
    this.createTerminal();
    this.setupCollisions();
    this.setupCamera();
  }

  /**
   * Crée la carte du jeu
   */
  private createMap(): void {
    const { width, height, tileSize } = this.mapConfig;

    // Créer le sol en herbe
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.add.image(x * tileSize, y * tileSize, 'grass-temp').setOrigin(0, 0);
      }
    }

    // Créer les murs
    this.walls = this.physics.add.staticGroup();
    this.createBorderWalls();
    this.createObstacles();
  }

  /**
   * Crée les murs de bordure
   */
  private createBorderWalls(): void {
    if (!this.walls) return;

    const { width, height, tileSize } = this.mapConfig;

    // Murs horizontaux (haut et bas)
    for (let x = 0; x < width; x++) {
      const topWall = this.add.image(x * tileSize, 0, 'wall-temp').setOrigin(0, 0);
      const bottomWall = this.add.image(x * tileSize, (height - 1) * tileSize, 'wall-temp').setOrigin(0, 0);
      this.walls.add(topWall);
      this.walls.add(bottomWall);
    }

    // Murs verticaux (gauche et droite)
    for (let y = 1; y < height - 1; y++) {
      const leftWall = this.add.image(0, y * tileSize, 'wall-temp').setOrigin(0, 0);
      const rightWall = this.add.image((width - 1) * tileSize, y * tileSize, 'wall-temp').setOrigin(0, 0);
      this.walls.add(leftWall);
      this.walls.add(rightWall);
    }
  }

  /**
   * Crée les obstacles dans la carte
   */
  private createObstacles(): void {
    if (!this.walls) return;

    const { tileSize } = this.mapConfig;

    const obstacles = [
      { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
      { x: 15, y: 8 }, { x: 16, y: 8 },
      { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 12, y: 12 },
    ];

    obstacles.forEach(pos => {
      const obstacle = this.add.image(pos.x * tileSize, pos.y * tileSize, 'wall-temp').setOrigin(0, 0);
      this.walls?.add(obstacle);
    });
  }

  /**
   * Crée le joueur
   */
  private createPlayer(): void {
    this.player = new Player(this, 400, 300);
  }

  /**
   * Crée le terminal d'accès
   */
  private createTerminal(): void {
    const { tileSize } = this.mapConfig;
    // Positionner le terminal à une position visible dans la carte
    this.terminal = new Terminal(this, 12 * tileSize, 10 * tileSize, {
      size: tileSize,
      proximityRadius: tileSize * 2.5
    });
  }

  /**
   * Configure les collisions
   */
  private setupCollisions(): void {
    if (this.walls && this.player) {
      this.physics.add.collider(this.player, this.walls);
    }
  }

  /**
   * Configure la caméra
   */
  private setupCamera(): void {
    if (!this.player) return;

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setLerp(0.1, 0.1);
  }

  override update(): void {
    this.player?.update();
    this.updateTerminalInteraction();
  }

  /**
   * Met à jour l'interaction avec le terminal
   */
  private updateTerminalInteraction(): void {
    if (!this.player || !this.terminal || !this.terminalService) return;

    const isNearby = this.terminal.checkProximity(this.player.x, this.player.y);
    this.terminalService.handlePlayerProximity(isNearby);
  }

  /**
   * Récupère le joueur
   */
  getPlayer(): Player | undefined {
    return this.player;
  }
}
