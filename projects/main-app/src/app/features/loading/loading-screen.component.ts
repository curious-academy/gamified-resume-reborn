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
    console.log('🔄 Starting data loading...');

    // Start the loading process and subscribe to execute the Observable
    this.loader.loadGameData().subscribe({
      next: (data) => {
        console.log('✅ Data loaded in component:', data);
      },
      error: (err) => {
        console.error('❌ Loading error:', err);
      }
    });

    // Monitor the loading state and redirect when done
    const checkInterval = setInterval(() => {
      const state = this.loader.loadingState();
      console.log(`⏳ Check loading state: ${state}, progress: ${this.loader.loadingProgress()}%`);

      if (state === 'success') {
        console.log('✅ Loading complete, navigating to game...');
        clearInterval(checkInterval);
        setTimeout(() => this.router.navigate(['/game']), 500);
      } else if (state === 'error') {
        console.log('❌ Loading failed');
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
