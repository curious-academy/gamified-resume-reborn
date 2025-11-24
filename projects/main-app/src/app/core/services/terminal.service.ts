import { Injectable, signal } from '@angular/core';

/**
 * Service managing communication between Phaser and Angular for the terminal
 */
@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  readonly isTerminalOpen = signal<boolean>(false);
  readonly showTerminalPrompt = signal<boolean>(false);
  private promptDismissed = false;

  /**
   * Displays the confirmation popup to open the terminal
   */
  showPrompt(): void {
    this.showTerminalPrompt.set(true);
  }

  /**
   * Hides the confirmation popup
   */
  hidePrompt(): void {
    this.showTerminalPrompt.set(false);
  }

  /**
   * Closes the popup and marks it as dismissed by the user
   */
  dismissPrompt(): void {
    this.hidePrompt();
    this.promptDismissed = true;
  }

  /**
   * Opens the terminal
   */
  openTerminal(): void {
    this.isTerminalOpen.set(true);
    this.hidePrompt();
    this.promptDismissed = false;
  }

  /**
   * Closes the terminal
   */
  closeTerminal(): void {
    this.isTerminalOpen.set(false);
  }

  /**
   * Handles player interaction with the terminal
   * @param isNearby true if the player is nearby
   */
  handlePlayerProximity(isNearby: boolean): void {
    if (isNearby && !this.isTerminalOpen() && !this.showTerminalPrompt() && !this.promptDismissed) {
      this.showPrompt();
    } else if (!isNearby) {
      // Reset flag when player moves away
      this.hidePrompt();
      this.promptDismissed = false;
    }
  }
}
