import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant représentant l'interface du terminal
 */
@Component({
  selector: 'app-terminal',
  imports: [CommonModule],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent {
  readonly closeTerminal = output<void>();

  /**
   * Ferme le terminal
   */
  close(): void {
    this.closeTerminal.emit();
  }
}
