import { Injectable, inject, DestroyRef } from '@angular/core';
import { TerminalService } from './terminal.service';

/**
 * Service managing global keyboard shortcuts for the application
 */
@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private readonly terminalService = inject(TerminalService);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Initializes keyboard listeners
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
   * Handles key presses
   */
  private handleKeyPress(event: KeyboardEvent): void {
    // Enter key - Open terminal if popup is displayed
    if (event.key === 'Enter') {
      if (this.terminalService.showTerminalPrompt()) {
        this.terminalService.openTerminal();
        event.preventDefault();
        return;
      }
    }

    // Escape key
    if (event.key === 'Escape') {
      // Priority 1: Close terminal if it's open
      if (this.terminalService.isTerminalOpen()) {
        this.terminalService.closeTerminal();
        event.preventDefault();
        return;
      }

      // Priority 2: Close popup if it's displayed
      if (this.terminalService.showTerminalPrompt()) {
        this.terminalService.dismissPrompt();
        event.preventDefault();
        return;
      }
    }
  }
}
