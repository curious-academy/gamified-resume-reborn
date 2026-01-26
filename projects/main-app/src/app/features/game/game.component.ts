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
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
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
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
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
