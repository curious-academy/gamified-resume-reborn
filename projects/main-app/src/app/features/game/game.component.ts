import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import Phaser from 'phaser';
import { PhaserService } from '../../core/services/phaser.service';
import { GameScene } from './scenes/game.scene';
import { Terminal } from '../terminal/terminal';

/**
 * Composant gérant l'affichage et l'initialisation du jeu Phaser
 */
@Component({
  selector: 'app-game',
  imports: [Terminal],
  template: `
    <div id="game-container" class="game-container"></div>
    @if (isLoading()) {
      <div class="loading">Chargement du jeu...</div>
    }
    @if (phaserService.isTerminalOpen()) {
      <app-terminal (closeTerminal)="onCloseTerminal()" />
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
export class GameComponent implements OnInit, OnDestroy {
  protected readonly phaserService = inject(PhaserService);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.initializeGame();
  }

  ngOnDestroy(): void {
    this.phaserService.destroyGame();
  }

  /**
   * Initialise le jeu Phaser avec la configuration
   */
  private initializeGame(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: GameScene,
      pixelArt: true,
      antialias: false,
      callbacks: {
        postBoot: () => {
          this.isLoading.set(false);
          this.setupSceneEventListeners();
        }
      }
    };

    this.phaserService.initGame(config);
  }

  /**
   * Setup event listeners for the game scene
   */
  private setupSceneEventListeners(): void {
    const gameScene = this.phaserService.getScene<GameScene>('GameScene');
    if (gameScene) {
      // Listen for openTerminal event from Phaser scene
      gameScene.events.on('openTerminal', () => {
        this.phaserService.openTerminal();
      });
    }
  }

  /**
   * Handles closing the terminal
   */
  onCloseTerminal(): void {
    this.phaserService.closeTerminal();
  }

  /**
   * Récupère la scène de jeu
   */
  getGameScene(): GameScene | undefined {
    return this.phaserService.getScene<GameScene>('GameScene');
  }
}
