import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataLoaderService } from '../services/game-data-loader.service';

export const gameDataLoadedGuard = () => {
  const loader = inject(GameDataLoaderService);
  const router = inject(Router);

  if (loader.isDataLoaded()) {
    return true;
  }

  console.warn('⚠️ Game data not loaded, redirecting to loading screen...');
  router.navigate(['/loading']);
  return false;
};
