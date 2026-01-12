import Phaser from 'phaser';
import { Player } from '../entities/player.entity';
import { Terminal } from '../entities/terminal.entity';
import { Npc } from '../entities/npc.entity';
import { DialogBox } from '../ui/dialog-box';
import { TerminalService } from '../../../core/services/terminal.service';
import { DialogService } from '../../../core/services/dialog.service';
import { GameDataLoaderService } from '../../../core/services/game-data-loader.service';
import { MapConfig } from '../entities/game-config.entity';
import { GameSceneConfig } from '../config/game-scene.config';

/**
 * Configuration de la scène incluant les services Angular
 */


/**
 * Scène principale du jeu
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private terminal?: Terminal;
  private walls?: Phaser.Tilemaps.TilemapLayer;
  private readonly mapConfig: Required<MapConfig>;
  private readonly terminalService?: TerminalService;
  private readonly dialogService?: DialogService;
  private readonly gameDataLoader?: GameDataLoaderService;

  // NPC system
  private dialogBox!: DialogBox;
  private npcs: Npc[] = [];
  private isDialogOpen = false;
  private nearestNpc?: Npc;

  constructor(config: GameSceneConfig = {}) {
    super({ key: 'GameScene' });

    this.mapConfig = {
      width: config.width ?? 25,
      height: config.height ?? 20,
      tileSize: config.tileSize ?? 32
    };

    this.terminalService = config.terminalService;
    this.dialogService = config.dialogService;
    this.gameDataLoader = config.gameDataLoader;
  }

  preload(): void {
    // Load Tiled map and tilesets
    this.load.tilemapTiledJSON('map', 'assets/maps/poc-01.json');
    this.load.image('FieldsTileset', 'assets/tilesets/FieldsTileset.png');
    this.load.image('walls', 'assets/tilesets/Tileset2.png');

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

    // Texture pour NPC (orange square)
    graphics.clear();
    graphics.fillStyle(0xff8c00);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('npc-temp', 32, 32);

    graphics.destroy();
  }

  create(): void {
    this.createMap();
    this.createPlayer();
    this.createTerminal();
    this.setupCollisions();
    this.setupCamera();

    // Initialize NPC system
    this.dialogBox = new DialogBox(this);
    this.dialogBox.setOnCloseCallback(() => {
      this.closeDialog();
    });
    this.createNpcsFromData();

    // Listen for E key to interact with NPC or close dialog
    this.input.keyboard?.on('keydown-E', () => {
      if (this.isDialogOpen) {
        this.closeDialog();
      } else if (this.nearestNpc) {
        this.openDialogForNpc(this.nearestNpc);
      }
    });
  }

  /**
   * Crée la carte du jeu
   */
  private createMap(): void {
    // Create the tilemap from Tiled JSON
    const map = this.make.tilemap({ key: 'map' });

    // Add the tilesets to the map
    const tileset = map.addTilesetImage('FieldsTileset', 'FieldsTileset');
    const wallsTileset = map.addTilesetImage('walls', 'walls');

    if (!tileset || !wallsTileset) {
      console.error('Failed to load tilesets');
      return;
    }

    // Create the ground layer - Phaser will position it correctly for infinite maps
    const groundLayer = map.createLayer('Calque de Tuiles 1', [tileset, wallsTileset]);

    if (!groundLayer) {
      console.error('Failed to create layer');
      return;
    }

    // Set collision on wall tiles (GID 65-105 from walls tileset)
    // These tiles represent fences and barriers
    // Using setCollision for specific tile IDs
    const wallTileGIDs = [65, 66, 67, 68, 73, 81, 89, 97, 105];
    groundLayer.setCollision(wallTileGIDs);

    console.log('Map properties:', {
      tileWidth: map.tileWidth,
      tileHeight: map.tileHeight,
      widthInPixels: map.widthInPixels,
      heightInPixels: map.heightInPixels,
      layerX: groundLayer.x,
      layerY: groundLayer.y,
      wallTilesSet: wallTileGIDs
    });

    // Store the layer for collision setup
    this.walls = groundLayer;
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
      // Add collision between player and wall tiles layer
      this.physics.add.collider(this.player, this.walls);
      console.log('✅ Collisions configured between player and walls layer');
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
   * Create NPCs from loaded game data
   */
  private createNpcsFromData(): void {
    if (!this.gameDataLoader) {
      console.warn('GameDataLoader not available, skipping NPC creation');
      return;
    }

    const npcsData = this.gameDataLoader.getAllNpcs();

    npcsData.forEach(npcData => {
      const spawnX = npcData.spawnX || Phaser.Math.Between(100, 700);
      const spawnY = npcData.spawnY || Phaser.Math.Between(100, 500);
      const color = parseInt(npcData.color.replace('#', ''), 16);

      const npc = new Npc(this, spawnX, spawnY, npcData.id, npcData.name, color);
      this.npcs.push(npc);
    });

    console.log(`✅ Created ${this.npcs.length} NPCs from data`);
  }

  override update(): void {
    this.player?.update();
    this.updateTerminalInteraction();
    this.updateNpcInteractions();
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
   * Update NPC interactions - only detect proximity, don't auto-open dialog
   */
  private updateNpcInteractions(): void {
    if (!this.isDialogOpen && this.player) {
      // Find nearest NPC within interaction range
      let foundNearby = false;

      for (const npc of this.npcs) {
        const isPlayerNear = npc.checkPlayerProximity(this.player.x, this.player.y);

        if (isPlayerNear) {
          this.nearestNpc = npc;
          npc.showInteractionPrompt();
          foundNearby = true;
          break; // Only track one NPC at a time
        }
      }

      // Clear nearest NPC if player moved away
      if (!foundNearby) {
        if (this.nearestNpc) {
          this.nearestNpc.hideInteractionPrompt();
          this.nearestNpc = undefined;
        }
      }
    }
  }

  /**
   * Open dialog for specific NPC
   */
  private openDialogForNpc(npc: Npc): void {
    if (!this.dialogService) return;

    // Stop player movement
    if (this.player && this.player.body) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
    }
    npc.pauseMovement();

    // Get dialog data (synchronous from preloaded data)
    this.dialogService.showDialogForNpc(npc.id);
    const dialog = this.dialogService.currentDialog();

    if (dialog) {
      this.dialogBox.show(dialog.npcName, dialog.message, npc.color);
      this.isDialogOpen = true;
    }
  }

  /**
   * Close dialog
   */
  private closeDialog(): void {
    this.dialogBox.hide();
    this.isDialogOpen = false;
    this.dialogService?.closeDialog();

    // Resume movement for all NPCs
    this.npcs.forEach(npc => npc.resumeMovement());

    // Clear nearest NPC reference
    if (this.nearestNpc) {
      this.nearestNpc.hideInteractionPrompt();
      this.nearestNpc = undefined;
    }
  }

  /**
   * Récupère le joueur
   */
  getPlayer(): Player | undefined {
    return this.player;
  }
}
