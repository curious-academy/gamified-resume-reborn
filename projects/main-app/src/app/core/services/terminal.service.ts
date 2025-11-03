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
  private promptDismissed = false;

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
   * Ferme la popup et marque qu'elle a été refusée par l'utilisateur
   */
  dismissPrompt(): void {
    this.hidePrompt();
    this.promptDismissed = true;
  }

  /**
   * Ouvre le terminal
   */
  openTerminal(): void {
    this.isTerminalOpen.set(true);
    this.hidePrompt();
    this.promptDismissed = false;
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
    if (isNearby && !this.isTerminalOpen() && !this.showTerminalPrompt() && !this.promptDismissed) {
      this.showPrompt();
    } else if (!isNearby) {
      // Reset le flag quand le joueur s'éloigne
      this.hidePrompt();
      this.promptDismissed = false;
    }
  }
}
