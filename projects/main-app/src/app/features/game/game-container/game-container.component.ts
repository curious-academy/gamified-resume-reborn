import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { GameComponent } from '../game.component';
import { TerminalComponent } from '../../terminal/terminal.component';
import { TerminalPromptComponent } from '../../terminal/terminal-prompt.component';
import { TerminalService } from '../../../core/services/terminal.service';
import { KeyboardService } from '../../../core/services/keyboard.service';

/**
 * Game container component
 * Wraps the Phaser game component and provides control information
 * Manages terminal display and interactions
 */
@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss',
  imports: [GameComponent, TerminalComponent, TerminalPromptComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameContainerComponent {
  protected readonly terminalService = inject(TerminalService);
  private readonly keyboardService = inject(KeyboardService);

  constructor() {
    this.keyboardService.initialize();
  }

  /**
   * Opens the terminal
   */
  openTerminal(): void {
    this.terminalService.openTerminal();
  }

  /**
   * Closes the terminal
   */
  closeTerminal(): void {
    this.terminalService.closeTerminal();
  }

  /**
   * Closes the prompt (user declined)
   */
  closePrompt(): void {
    this.terminalService.dismissPrompt();
  }
}
