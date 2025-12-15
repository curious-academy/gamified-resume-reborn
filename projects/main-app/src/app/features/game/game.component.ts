import { Component, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import Phaser from 'phaser';
import { PhaserService } from '../../core/services/phaser.service';
import { TerminalService } from '../../core/services/terminal.service';
import { DialogService } from '../../core/services/dialog.service';
import { GameDataLoaderService } from '../../core/services/game-data-loader.service';
import { GameScene } from './scenes/game.scene';

/**
 * Component managing Phaser game display and initialization
 */
@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="game-container" class="game-container"></div>
    @if (isLoading()) {
      <div class="loading">Chargement du jeu...</div>
    }
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .game-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 1.5rem;
      background: rgba(0, 0, 0, 0.7);
      padding: 1rem 2rem;
      border-radius: 8px;
    }
  `]
})
export class GameComponent implements OnDestroy {
  private readonly phaserService = inject(PhaserService);
  private readonly terminalService = inject(TerminalService);
  private readonly dialogService = inject(DialogService);
  private readonly gameDataLoader = inject(GameDataLoaderService);
  protected readonly isLoading = signal<boolean>(true);

  constructor() {
    this.initializeGame();
  }

  ngOnDestroy(): void {
    this.phaserService.destroyGame();
  }

  /**
   * Initializes Phaser game with configuration
   */
  private initializeGame(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 800,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: new GameScene({
        width: 25,
        height: 20,
        tileSize: 32,
        terminalService: this.terminalService,
        dialogService: this.dialogService,
        gameDataLoader: this.gameDataLoader
      }),
      pixelArt: true,
      antialias: false,
      callbacks: {
        postBoot: () => {
          this.isLoading.set(false);
        }
      }
    };

    this.phaserService.initGame(config);
  }

  /**
   * Gets the game scene
   */
  getGameScene(): GameScene | undefined {
    return this.phaserService.getScene<GameScene>('GameScene');
  }
}
