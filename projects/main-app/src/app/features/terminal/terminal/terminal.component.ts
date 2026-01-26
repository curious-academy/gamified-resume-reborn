import { Component, output, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component representing the terminal interface
 */
@Component({
  selector: 'app-terminal',
  imports: [],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalComponent {
  protected readonly closeTerminal = output<void>();

  /**
   * Closes the terminal
   */
  close(): void {
    this.closeTerminal.emit();
  }
}
