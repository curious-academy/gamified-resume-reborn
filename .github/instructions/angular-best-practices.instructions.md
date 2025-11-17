---
applyTo: 'projects/**/*.ts, projects/**/*.html, projects/**/*.scss'
---
---

## 🅰️ Angular 21 Best Practices

### Architecture and Structure

#### Monorepo
```typescript
// Angular workspace structure
workspace/
├── projects/
│   ├── main-app/           // Main application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── features/      // Feature modules
│   │   │   │   ├── core/          // Singleton services
│   │   │   │   ├── shared/        // Shared components
│   │   │   │   └── models/        // Types and interfaces
│   └── shared-ui/          // Reusable component library
└── angular.json
```

#### Standalone Components (Angular 21)
- A standalone component must explicitly declare its imports
- Aim to minimize imports to optimize bundle size
- **ALWAYS use Angular CLI to generate components: `ng g c <component-name>`**
  - Example: `ng g c features/inventory`
  - This ensures proper structure, imports, and conventions

```typescript
// ✅ GOOD - Standalone component with explicit imports
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss' // 'styleUrl' singular for Angular 21
})
export class FeatureComponent {
  // Use signals for reactivity
  protected readonly count = signal(0);
  
  increment(): void {
    this.count.update(value => value + 1);
  }
}
```

### Signals (new reactivity system)
- Avoid using effect as much as possible: prefer computed and derived signals, and linked signals

```typescript
// ✅ GOOD - Modern signals usage
import { Component, signal, computed, effect } from '@angular/core';

export class GameComponent {
  // Basic signal
  protected readonly score = signal(0);
  
  // Computed signal (derived)
  protected readonly scoreDisplay = computed(() => {
    return `Score: ${this.score()}`;
  });
  
  // Update signal
  addPoints(points: number): void {
    this.score.update(current => current + points);
  }
}
```

### Services and Dependency Injection

```typescript
// ✅ GOOD - Service with modern inject()
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // Singleton at app level
})
export class GameService {
  // Use inject() instead of constructor
  private readonly http = inject(HttpClient);
  
  loadGame(id: string): Promise<void> {
    return this.http.get<GameData>(`/api/games/${id}`)
  }
}
```

### Routing

```typescript
// ✅ BON - Routes avec lazy loading
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/game',
    pathMatch: 'full'
  },
  {
    path: 'game',
    loadComponent: () => import('./features/game/game.component')
      .then(m => m.GameComponent)
  },
  {
    path: 'inventory',
    loadComponent: () => import('./features/inventory/inventory.component')
      .then(m => m.InventoryComponent),
    canActivate: [authGuard] // Guard fonctionnel
  }
];
```

### Formulaires

```typescript
// ✅ BON - Reactive Forms avec typage fort
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface ProfileForm {
  username: string;
  email: string;
  level: number;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="username" />
      <input formControlName="email" type="email" />
      <input formControlName="level" type="number" />
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  
  readonly form: FormGroup<ProfileForm> = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    level: [1, [Validators.required, Validators.min(1)]]
  });
  
  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      // Process form data
    }
  }
}
```

### Tests

```typescript
// ✅ BON - Tests avec TestBed moderne
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent] // Composant standalone
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should increment score', () => {
    component.addPoints(10);
    expect(component.score()).toBe(10);
  });
});
```

### Style et Conventions

```typescript
// ✅ Conventions de nommage
// - Fichiers: kebab-case (game-inventory.component.ts)
// - Classes: PascalCase (GameInventoryComponent)
// - Interfaces: PascalCase avec préfixe I optionnel (IGameState ou GameState)
// - Constants: UPPER_SNAKE_CASE (MAX_INVENTORY_SIZE)
// - Variables/fonctions: camelCase (addToInventory)

// ✅ Modificateurs d'accès
export class MyComponent {
  protected readonly publicData = signal([]); // Accessible dans le template
  private internalState = 0; // Interne au composant
}

// ✅ Typage strict
// Toujours typer les paramètres et retours
addItem(item: Item): void {
  // ...
}

// ❌ ÉVITER any
// ✅ Utiliser unknown ou types spécifiques
```

## 🔒 Security

### Angular
- Use `DomSanitizer` for dynamic content
- Enable production mode for build
- Validate all user inputs
- Use `HttpInterceptor` for auth tokens
