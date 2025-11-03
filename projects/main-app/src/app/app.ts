import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './features/game/game.component';
import { TerminalComponent } from './features/terminal/terminal.component';
import { TerminalPromptComponent } from './features/terminal/terminal-prompt.component';
import { TerminalService } from './core/services/terminal.service';
import { KeyboardService } from './core/services/keyboard.service';

/**
 * Composant racine de l'application
 * Sert de conteneur principal pour l'application
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameComponent, TerminalComponent, TerminalPromptComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Gamified Resume Reborn');
  protected readonly terminalService = inject(TerminalService);
  private readonly keyboardService = inject(KeyboardService);

  ngOnInit(): void {
    this.keyboardService.initialize();
  }

  /**
   * Ouvre le terminal
   */
  openTerminal(): void {
    this.terminalService.openTerminal();
  }

  /**
   * Ferme le terminal
   */
  closeTerminal(): void {
    this.terminalService.closeTerminal();
  }

  /**
   * Ferme la popup de confirmation (refus de l'utilisateur)
   */
  closePrompt(): void {
    this.terminalService.dismissPrompt();
  }
}
