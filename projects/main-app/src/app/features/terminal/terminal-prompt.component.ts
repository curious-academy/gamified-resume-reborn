import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant représentant la popup de confirmation pour ouvrir le terminal
 */
@Component({
  selector: 'app-terminal-prompt',
  imports: [CommonModule],
  templateUrl: './terminal-prompt.component.html',
  styleUrls: ['./terminal-prompt.component.scss']
})
export class TerminalPromptComponent {
  readonly openTerminal = output<void>();
  readonly closePrompt = output<void>();

  /**
   * Ouvre le terminal
   */
  open(): void {
    this.openTerminal.emit();
  }

  /**
   * Ferme la popup
   */
  close(): void {
    this.closePrompt.emit();
  }
}
