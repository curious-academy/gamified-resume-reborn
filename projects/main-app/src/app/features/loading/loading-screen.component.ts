import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameDataLoaderService } from '../../core/services/game-data-loader.service';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-screen">
      <!-- Loading state -->
      <div class="loading-content" *ngIf="loader.loadingState() === 'loading'">
        <h1>🎮 Chargement du jeu...</h1>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="loader.loadingProgress()"></div>
        </div>
        <p class="progress-text">{{ loader.loadingProgress() }}%</p>
        <p class="loading-tip">{{ currentTip }}</p>
      </div>

      <!-- Error state -->
      <div class="error-content" *ngIf="loader.loadingState() === 'error'">
        <h1>❌ Erreur de chargement</h1>
        <p class="error-message">{{ loader.errorMessage() }}</p>
        <div class="error-actions">
          <button class="btn-retry" (click)="retry()">🔄 Réessayer</button>
          <button class="btn-back" (click)="backToMenu()">⬅ Retour au menu</button>
        </div>
      </div>

      <!-- Success (auto-redirect, normally invisible) -->
      <div class="success-content" *ngIf="loader.loadingState() === 'success'">
        <h1>✅ Chargement terminé !</h1>
        <p>Lancement du jeu...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-screen {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: 'Courier New', monospace;
    }

    .loading-content, .error-content, .success-content {
      text-align: center;
      color: white;
      max-width: 500px;
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 2rem;
      text-shadow: 0 0 10px rgba(255, 140, 0, 0.5);
    }

    .progress-bar {
      width: 100%;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      overflow: hidden;
      margin: 1.5rem 0;
      border: 2px solid rgba(255, 140, 0, 0.3);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff8c00, #ffa500);
      transition: width 0.5s ease;
      box-shadow: 0 0 10px rgba(255, 140, 0, 0.8);
    }

    .progress-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: #ff8c00;
      margin-bottom: 1rem;
    }

    .loading-tip {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
      margin-top: 1rem;
    }

    .error-message {
      color: #ff4444;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    button {
      padding: 0.8rem 1.5rem;
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-retry {
      background: #ff8c00;
      color: white;
    }

    .btn-retry:hover {
      background: #ffa500;
      transform: scale(1.05);
    }

    .btn-back {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .success-content {
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
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
    this.loader.loadGameData().subscribe({
      next: (data) => {
        console.log('✅ Data loaded, redirecting to game...');
        // Small delay to show success
        setTimeout(() => {
          this.router.navigate(['/game']);
        }, 500);
      },
      error: (error) => {
        console.error('❌ Loading failed:', error);
        // Error already handled in service
      }
    });
  }

  retry(): void {
    this.loader.reset();
    this.currentTip = this.tips[Math.floor(Math.random() * this.tips.length)];
    this.startLoading();
  }

  backToMenu(): void {
    this.router.navigate(['/menu']);
  }
}
