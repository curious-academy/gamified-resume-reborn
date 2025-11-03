import { Component, inject, output } from '@angular/core';

/**
 * Terminal component displayed as an overlay when player interacts with terminal
 */
@Component({
  selector: 'app-terminal',
  imports: [],
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss'
})
export class Terminal {
  // Event emitter for close action
  readonly closeTerminal = output<void>();

  /**
   * Handles close button click
   */
  onClose(): void {
    this.closeTerminal.emit();
  }
}
