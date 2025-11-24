import { Injectable, signal } from '@angular/core';
import Phaser from 'phaser';

/**
 * Service managing Phaser instance and its configuration
 */
@Injectable({
  providedIn: 'root'
})
export class PhaserService {
  private game?: Phaser.Game;
  readonly isGameInitialized = signal<boolean>(false);

  /**
   * Initializes Phaser game with the provided configuration
   * @param config Phaser configuration
   */
  initGame(config: Phaser.Types.Core.GameConfig): void {
    if (this.game) {
      console.warn('Game already initialized');
      return;
    }

    this.game = new Phaser.Game(config);
    this.isGameInitialized.set(true);
  }

  /**
   * Destroys the game instance and releases resources
   */
  destroyGame(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = undefined;
      this.isGameInitialized.set(false);
    }
  }

  /**
   * Gets a specific scene by its key
   * @param key Scene key
   * @returns The requested scene or undefined
   */
  getScene<T extends Phaser.Scene>(key: string): T | undefined {
    return this.game?.scene.getScene(key) as T;
  }

  /**
   * Gets the game instance
   * @returns The Phaser.Game instance or undefined
   */
  getGame(): Phaser.Game | undefined {
    return this.game;
  }
}
