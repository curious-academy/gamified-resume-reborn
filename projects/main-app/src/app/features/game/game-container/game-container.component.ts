import { Component } from '@angular/core';
import { GameComponent } from '../game.component';

/**
 * Game container component
 * Wraps the Phaser game component and provides control information
 */
@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss',
  imports: [GameComponent]
})
export class GameContainerComponent {
}
