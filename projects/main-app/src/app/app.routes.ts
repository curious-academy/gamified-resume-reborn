import { Routes } from '@angular/router';
import { gameDataLoadedGuard } from './core/guards/game-data-loaded.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./features/menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'loading',
    loadComponent: () =>
      import('./features/loading/loading-screen.component').then(
        m => m.LoadingScreenComponent
      )
  },
  {
    path: 'trainings',
    loadComponent: () =>
      import('./features/training/components/training-list.component').then(
        m => m.TrainingListComponent
      )
  },
  {
    path: 'trainings/:id',
    loadComponent: () =>
      import('./features/training/components/training-detail.component').then(
        m => m.TrainingDetailComponent
      )
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./features/game/game-container/game-container.component').then(
        m => m.GameContainerComponent
      ),
    canActivate: [gameDataLoadedGuard]
  }
];

