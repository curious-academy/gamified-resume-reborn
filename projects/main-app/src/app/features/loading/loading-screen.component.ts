import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameDataLoaderService } from '../../core/services/game-data-loader.service';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
  readonly loader = inject(GameDataLoaderService);
  private router = inject(Router);

  currentTip = '';
  private tips = [
    'Utilisez ZQSD pour vous déplacer...',
    'Maintenez Shift pour courir...',
    'Approchez-vous des PNJ pour discuter...',
    'Appuyez sur E pour interagir...',
    'Explorez le monde pour découvrir des secrets...'
  ];

  ngOnInit(): void {
    this.currentTip = this.tips[Math.floor(Math.random() * this.tips.length)];
    this.startLoading();
  }

  private startLoading(): void {
    // Start the loading process - GameDataLoaderService will manage the state
    this.loader.loadGameData();

    // Monitor the loading state and redirect when done
    const checkInterval = setInterval(() => {
      const state = this.loader.loadingState();

      if (state === 'success') {
        clearInterval(checkInterval);
        setTimeout(() => this.router.navigate(['/game']), 500);
      } else if (state === 'error') {
        clearInterval(checkInterval);
      }
    }, 100);
  }

  retry(): void {
    this.loader.reset();
    this.currentTip = this.tips[Math.floor(Math.random() * this.tips.length)];
    this.startLoading();
  }

  backToMenu(): void {
    this.loader.reset();
    this.router.navigate(['/menu']);
  }
}
