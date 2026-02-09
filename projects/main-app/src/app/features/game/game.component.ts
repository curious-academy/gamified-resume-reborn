import { Component, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import Phaser from 'phaser';
import { Dispatcher } from '@ngrx/signals/events';
import { PhaserService } from '../../core/services/phaser.service';
import { TerminalService } from '../../core/services/terminal.service';
import { DialogService } from '../../core/services/dialog.service';
import { GameDataLoaderService } from '../../core/services/game-data-loader.service';
import { GameSessionStore } from './store';
import { gameSessionEvents } from './store/game-session.events';
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
  private readonly gameSessionStore = inject(GameSessionStore);
  private readonly dispatcher = inject(Dispatcher);
  protected readonly isLoading = signal<boolean>(true);

  constructor() {
    this.initializeGame();
  }

  ngOnDestroy(): void {
    this.phaserService.destroyGame();
    // Pause session when leaving the game
    if (this.gameSessionStore.isSessionActive()) {
      this.dispatcher.dispatch(gameSessionEvents.sessionPaused());
    }
  }

  /**
   * Initializes Phaser game with configuration
   */
  private initializeGame(): void {
    // Start a new game session
    const gameId = `game-${Date.now()}`;
    this.dispatcher.dispatch(gameSessionEvents.sessionStarted({ gameId, playerId: 'player-1' }));

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
        gameDataLoader: this.gameDataLoader,
        gameSessionStore: this.gameSessionStore,
        dispatcher: this.dispatcher,
        gameEvents: gameSessionEvents
      }),
      pixelArt: true,
      antialias: false,
      callbacks: {
        postBoot: () => {
          console.log('✅ Phaser postBoot callback - game ready');
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
