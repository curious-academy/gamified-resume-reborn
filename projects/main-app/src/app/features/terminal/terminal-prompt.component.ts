import { Component, output, ChangeDetectionStrategy } from '@angular/core';

/**
 * Composant représentant la popup de confirmation pour ouvrir le terminal
 */
@Component({
  selector: 'app-terminal-prompt',
  imports: [],
  templateUrl: './terminal-prompt.component.html',
  styleUrls: ['./terminal-prompt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
