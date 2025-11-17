import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'trainings',
    pathMatch: 'full'
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
      import('./features/game/game.component').then(m => m.GameComponent)
  },
  {
    path: 'game/new',
    loadComponent: () =>
      import('./features/game/game-container/game-container.component').then(
        m => m.GameContainerComponent
      )
  }
];

