import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private router = inject(Router);

  hasSavedGame = false; // TODO: Connect to SaveGameService later

  startNewGame(): void {
    console.log('🎮 Starting new game...');
    this.router.navigate(['/loading']);
  }

  continueGame(): void {
    console.log('↻ Continuing game...');
    // TODO: Load save game
    this.router.navigate(['/game']);
  }

  showSettings(): void {
    console.log('⚙ Settings (TODO)');
  }

  showCredits(): void {
    console.log('ℹ Credits (TODO)');
  }
}
