import { Component, output, ChangeDetectionStrategy } from '@angular/core';

/**
 * Composant représentant l'interface du terminal
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
   * Ferme le terminal
   */
  close(): void {
    this.closeTerminal.emit();
  }
}
