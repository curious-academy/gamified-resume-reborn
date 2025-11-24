import { Injectable, inject, DestroyRef } from '@angular/core';
import { TerminalService } from './terminal.service';

/**
 * Service gérant les raccourcis clavier globaux de l'application
 */
@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private readonly terminalService = inject(TerminalService);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Initialise les écouteurs de clavier
   */
  initialize(): void {
    const handler = (event: KeyboardEvent) => this.handleKeyPress(event);
    window.addEventListener('keydown', handler);

    // Auto-cleanup when service is destroyed
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('keydown', handler);
    });
  }

  /**
   * Gère les touches pressées
   */
  private handleKeyPress(event: KeyboardEvent): void {
    // Touche Entrée - Ouvrir le terminal si la popup est affichée
    if (event.key === 'Enter') {
      if (this.terminalService.showTerminalPrompt()) {
        this.terminalService.openTerminal();
        event.preventDefault();
        return;
      }
    }

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
}
