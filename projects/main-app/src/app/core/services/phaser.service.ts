import { Injectable, signal } from '@angular/core';
import Phaser from 'phaser';

/**
 * Service gérant l'instance Phaser et sa configuration
 */
@Injectable({
  providedIn: 'root'
})
export class PhaserService {
  private game?: Phaser.Game;
  readonly isGameInitialized = signal<boolean>(false);
  readonly isTerminalOpen = signal<boolean>(false);

  /**
   * Initialise le jeu Phaser avec la configuration fournie
   * @param config Configuration Phaser
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
   * Détruit l'instance du jeu et libère les ressources
   */
  destroyGame(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = undefined;
      this.isGameInitialized.set(false);
      this.isTerminalOpen.set(false);
    }
  }

  /**
   * Récupère une scène spécifique par sa clé
   * @param key Clé de la scène
   * @returns La scène demandée ou undefined
   */
  getScene<T extends Phaser.Scene>(key: string): T | undefined {
    return this.game?.scene.getScene(key) as T;
  }

  /**
   * Récupère l'instance du jeu
   * @returns L'instance Phaser.Game ou undefined
   */
  getGame(): Phaser.Game | undefined {
    return this.game;
  }

  /**
   * Opens the terminal interface
   */
  openTerminal(): void {
    this.isTerminalOpen.set(true);
  }

  /**
   * Closes the terminal interface
   */
  closeTerminal(): void {
    this.isTerminalOpen.set(false);
  }
}
