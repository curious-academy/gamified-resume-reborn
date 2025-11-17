import { Component, inject, OnInit } from '@angular/core';
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
  imports: [GameComponent, TerminalComponent, TerminalPromptComponent]
})
export class GameContainerComponent implements OnInit {
  protected readonly terminalService = inject(TerminalService);
  private readonly keyboardService = inject(KeyboardService);

  ngOnInit(): void {
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
