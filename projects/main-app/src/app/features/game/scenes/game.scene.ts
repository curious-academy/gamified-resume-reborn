import Phaser from 'phaser';
import { Player } from '../entities/player.entity';
import { Terminal } from '../entities/terminal.entity';
import { InteractionPopup } from '../ui/interaction-popup';

/**
 * Configuration de la carte
 */
interface MapConfig {
  width?: number;
  height?: number;
  tileSize?: number;
}

/**
 * Scène principale du jeu
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private walls?: Phaser.Physics.Arcade.StaticGroup;
  private terminal?: Terminal;
  private interactionPopup?: InteractionPopup;
  private interactKey?: Phaser.Input.Keyboard.Key;
  private escapeKey?: Phaser.Input.Keyboard.Key;
  private isPlayerNearTerminal: boolean = false;
  private readonly mapConfig: Required<MapConfig>;

  constructor(mapConfig: MapConfig = {}) {
    super({ key: 'GameScene' });

    this.mapConfig = {
      width: mapConfig.width ?? 25,
      height: mapConfig.height ?? 20,
      tileSize: mapConfig.tileSize ?? 32
    };
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
    this.setupInteractionUI();
    this.setupInputHandlers();
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
   * Crée le terminal
   */
  private createTerminal(): void {
    const { tileSize } = this.mapConfig;
    // Place terminal at position (12, 6)
    this.terminal = new Terminal(this, 12 * tileSize, 6 * tileSize, {
      size: tileSize,
      interactionRadius: 100 // Increased for easier interaction
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

  /**
   * Setup interaction UI
   */
  private setupInteractionUI(): void {
    this.interactionPopup = new InteractionPopup(this, {
      message: 'Do you want to open the terminal?',
      acceptKey: 'E',
      declineKey: 'ESC'
    });
  }

  /**
   * Setup input handlers for interaction
   */
  private setupInputHandlers(): void {
    if (!this.input.keyboard) return;

    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  /**
   * Checks player proximity to terminal
   */
  private checkTerminalProximity(): void {
    if (!this.player || !this.terminal) return;

    const playerX = this.player.x;
    const playerY = this.player.y;
    const terminalCenterX = this.terminal.x + this.terminal.width / 2;
    const terminalCenterY = this.terminal.y + this.terminal.height / 2;
    const distance = Phaser.Math.Distance.Between(terminalCenterX, terminalCenterY, playerX, playerY);
    const isInRange = distance <= 100; // interaction radius

    // Debug logging
    if (distance < 120) {
      console.log('Distance to terminal:', distance, 'In range:', isInRange);
    }

    if (isInRange && !this.isPlayerNearTerminal) {
      console.log('Player entered terminal range!');
      this.isPlayerNearTerminal = true;
      this.terminal.showGlow();
      
      // Show popup at terminal position
      this.interactionPopup?.show(terminalCenterX, terminalCenterY);
    } else if (!isInRange && this.isPlayerNearTerminal) {
      console.log('Player left terminal range!');
      this.isPlayerNearTerminal = false;
      this.terminal.hideGlow();
      this.interactionPopup?.hide();
    } else if (isInRange && this.isPlayerNearTerminal) {
      // Update popup position if still in range (camera may have moved)
      this.updatePopupPosition(terminalCenterX, terminalCenterY);
    }
  }

  /**
   * Updates popup position based on world coordinates
   */
  private updatePopupPosition(worldX: number, worldY: number): void {
    if (!this.interactionPopup?.isVisible()) return;
    
    const camera = this.cameras.main;
    const screenX = (worldX - camera.scrollX) * camera.zoom;
    const screenY = (worldY - camera.scrollY) * camera.zoom - 60;
    
    // Update position without animation
    const container = (this.interactionPopup as any).container;
    if (container) {
      container.setPosition(screenX, screenY);
    }
  }

  /**
   * Handles terminal interaction
   */
  private handleTerminalInteraction(): void {
    if (!this.isPlayerNearTerminal) return;

    // Emit event to open terminal (will be caught by Angular)
    this.events.emit('openTerminal');
    
    // Hide popup
    this.interactionPopup?.hide();
  }

  /**
   * Handles cancel interaction
   */
  private handleCancelInteraction(): void {
    if (this.interactionPopup?.isVisible()) {
      this.interactionPopup.hide();
    }
  }

  override update(): void {
    this.player?.update();

    // Check proximity to terminal continuously
    this.checkTerminalProximity();

    // Check for interaction input
    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.handleTerminalInteraction();
    }

    if (this.escapeKey && Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      this.handleCancelInteraction();
    }
  }

  /**
   * Récupère le joueur
   */
  getPlayer(): Player | undefined {
    return this.player;
  }

  /**
   * Gets the terminal
   */
  getTerminal(): Terminal | undefined {
    return this.terminal;
  }
}
