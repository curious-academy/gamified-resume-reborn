import { Component, output, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component representing the confirmation popup to open the terminal
 */
@Component({
  selector: 'app-terminal-prompt',
  imports: [],
  templateUrl: './terminal-prompt.component.html',
  styleUrls: ['./terminal-prompt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalPromptComponent {
  protected readonly openTerminal = output<void>();
  protected readonly closePrompt = output<void>();

  /**
   * Opens the terminal
   */
  open(): void {
    this.openTerminal.emit();
  }

  /**
   * Closes the popup
   */
  close(): void {
    this.closePrompt.emit();
  }
}
