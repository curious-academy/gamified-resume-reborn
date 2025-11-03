import { Injectable, signal } from '@angular/core';

/**
 * Service gérant la communication entre Phaser et Angular pour le terminal
 */
@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  readonly isTerminalOpen = signal<boolean>(false);
  readonly showTerminalPrompt = signal<boolean>(false);

  /**
   * Affiche la popup de confirmation pour ouvrir le terminal
   */
  showPrompt(): void {
    this.showTerminalPrompt.set(true);
  }

  /**
   * Cache la popup de confirmation
   */
  hidePrompt(): void {
    this.showTerminalPrompt.set(false);
  }

  /**
   * Ouvre le terminal
   */
  openTerminal(): void {
    this.isTerminalOpen.set(true);
    this.hidePrompt();
  }

  /**
   * Ferme le terminal
   */
  closeTerminal(): void {
    this.isTerminalOpen.set(false);
  }

  /**
   * Gère l'interaction du joueur avec le terminal
   * @param isNearby true si le joueur est à proximité
   */
  handlePlayerProximity(isNearby: boolean): void {
    if (isNearby && !this.isTerminalOpen() && !this.showTerminalPrompt()) {
      this.showPrompt();
    } else if (!isNearby && this.showTerminalPrompt()) {
      this.hidePrompt();
    }
  }
}
