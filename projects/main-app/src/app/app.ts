import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './features/game/game.component';

/**
 * Composant racine de l'application
 * Sert de conteneur principal pour l'application
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Gamified Resume Reborn');
}
