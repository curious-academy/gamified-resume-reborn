import { Injectable, inject } from '@angular/core';
import { TerminalService } from './terminal.service';

/**
 * Service gérant les raccourcis clavier globaux de l'application
 */
@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private readonly terminalService = inject(TerminalService);

  /**
   * Initialise les écouteurs de clavier
   */
  initialize(): void {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.handleKeyPress(event);
    });
  }

  /**
   * Gère les touches pressées
   */
  private handleKeyPress(event: KeyboardEvent): void {
    // Touche Échap
    if (event.key === 'Escape') {
      // Priorité 1: Fermer le terminal s'il est ouvert
      if (this.terminalService.isTerminalOpen()) {
        this.terminalService.closeTerminal();
        event.preventDefault();
        return;
      }

      // Priorité 2: Fermer la popup si elle est affichée
      if (this.terminalService.showTerminalPrompt()) {
        this.terminalService.dismissPrompt();
        event.preventDefault();
        return;
      }
    }
  }

  /**
   * Nettoie les écouteurs
   */
  cleanup(): void {
    // Note: Dans une vraie application, on devrait stocker la référence
    // à la fonction d'écoute pour pouvoir la retirer proprement
  }
}
