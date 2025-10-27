# Copilot Instructions - Gamified Resume Reborn

## 🎯 Vue d'ensemble du projet

Ce projet est une application **gamifiée** utilisant:
- **Frontend**: Angular 21 (architecture monorepo)
- **Backend**: .NET 10 avec Minimal API
- **Game Engine**: Phaser 3 pour le moteur de jeu 2D

---

## 📋 Workflow de développement des features

### Processus obligatoire pour chaque nouvelle feature

Suis **rigoureusement** ces étapes dans l'ordre:

#### 1️⃣ Collecte du titre de la feature
```
❓ Question à poser: "Quel est le titre de la feature que vous souhaitez développer ?"
📝 Format attendu: Titre court et descriptif (ex: "Ajout du système d'inventaire")
✅ Validation: Le titre doit être clair et en français
```

#### 2️⃣ Collecte du contenu détaillé
```
❓ Question à poser: "Décrivez le contenu et les fonctionnalités de cette feature"
📝 Format attendu: Description détaillée incluant:
   - Objectif de la feature
   - Fonctionnalités principales
   - Comportements attendus
   - Contraintes techniques
✅ Validation: La description doit être suffisamment détaillée pour implémenter
```

#### 3️⃣ Collecte des tests d'acceptation
```
❓ Question à poser: "Quels sont les critères d'acceptation et tests pour cette feature ?"
📝 Format attendu: Liste de critères testables (Given/When/Then)
   Exemple:
   - GIVEN: L'utilisateur est sur l'écran de jeu
   - WHEN: Il appuie sur la touche 'I'
   - THEN: L'inventaire s'ouvre avec les items collectés
✅ Validation: Au moins 3 critères d'acceptation clairs
```

#### 4️⃣ Création de l'issue GitHub
```
🔧 Action: Créer automatiquement une issue sur le repository avec:
   - Titre: [même titre qu'à l'étape 1]
   - Body: 
     ## Description
     [contenu de l'étape 2]
     
     ## Critères d'acceptation
     [tests de l'étape 3]
     
     ## Labels suggérés
     - feature
     - [frontend/backend selon le cas]
     
📍 Repository: curious-academy/gamified-resume-reborn
✅ Confirmation: Afficher le numéro et l'URL de l'issue créée
```

#### 5️⃣ Création de la branche locale
```
🔧 Action: Créer une branche locale avec le format:
   - Nom: feature/[titre-en-kebab-case]
   - Base: branch courante (généralement main ou install-phaser)
   
📝 Transformation du titre:
   - Convertir en anglais
   - Convertir en kebab-case (minuscules, mots séparés par -)
   - Préfixer avec "feature/"
   
Exemple: "Ajout du système d'inventaire" → "feature/add-inventory-system"

✅ Confirmation: Afficher le nom de la branche créée
```

#### 6️⃣ Pause et attente de confirmation
```
⏸️ Message obligatoire:
"✅ Feature setup complet !
📝 Issue #[numéro] créée: [URL]
🌿 Branche créée: [nom-de-la-branche]

⏳ Attendant votre confirmation pour commencer l'implémentation.
💬 Tapez 'go' ou 'continue' pour démarrer le développement."

⛔ NE PAS continuer sans confirmation explicite de l'utilisateur
```

---

## 🅰️ Bonnes pratiques Angular 21

### Architecture et Structure

#### Monorepo
```typescript
// Structure du workspace Angular
workspace/
├── projects/
│   ├── main-app/           // Application principale
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── features/      // Features modules
│   │   │   │   ├── core/          // Services singleton
│   │   │   │   ├── shared/        // Components partagés
│   │   │   │   └── models/        // Types et interfaces
│   └── shared-ui/          // Librairie de composants réutilisables
└── angular.json
```

#### Composants Standalone (Angular 21)
- Un composant standalone doit déclarer explicitement ses imports
- Chercher à minimiser les imports pour optimiser le bundle
```typescript
// ✅ BON - Composant standalone avec imports explicites
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss' // 'styleUrl' au singulier pour Angular 21
})
export class FeatureComponent {
  // Utiliser signals pour la réactivité
  protected readonly count = signal(0);
  
  increment(): void {
    this.count.update(value => value + 1);
  }
}
```

### Signals (nouveau système de réactivité)
- éviter au maximum d'utiliser effect : préférer computed et signals dérivés, et linked signals

```typescript
// ✅ BON - Utilisation moderne des signals
import { Component, signal, computed, effect } from '@angular/core';

export class GameComponent {
  // Signal basique
  protected readonly score = signal(0);
  
  // Computed signal (dérivé)
  protected readonly scoreDisplay = computed(() => {
    return `Score: ${this.score()}`;
  });
  
  // Mise à jour du signal
  addPoints(points: number): void {
    this.score.update(current => current + points);
  }
}
```

### Services et Injection de dépendances

```typescript
// ✅ BON - Service avec inject() moderne
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // Singleton au niveau app
})
export class GameService {
  // Utiliser inject() au lieu du constructor
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

---

## 🔷 Bonnes pratiques .NET 10 Minimal API

### Structure du projet Backend

```
backend/
├── Program.cs              // Point d'entrée et configuration
├── Models/                 // DTOs et entités
│   ├── Requests/
│   └── Responses/
├── Services/               // Logique métier
├── Repositories/           // Accès aux données
├── Endpoints/              // Extensions pour les routes
├── Middleware/             // Middleware personnalisés
└── appsettings.json
```

### Configuration Minimal API

```csharp
// ✅ BON - Program.cs avec Minimal API .NET 10
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Configuration des services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS pour le frontend Angular
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4201")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Services métier
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();

var app = builder.Build();

// Configuration du pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

// Endpoints
app.MapGameEndpoints();
app.MapPlayerEndpoints();

app.Run();
```

### Endpoints organisés par feature

```csharp
// ✅ BON - Endpoints/GameEndpoints.cs
public static class GameEndpoints
{
    public static void MapGameEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/games")
            .WithTags("Games")
            .WithOpenApi();

        // GET /api/games
        group.MapGet("/", async (IGameService gameService) =>
        {
            var games = await gameService.GetAllGamesAsync();
            return Results.Ok(games);
        })
        .Produces<List<GameResponse>>(200)
        .WithName("GetAllGames")
        .WithSummary("Récupère tous les jeux");

        // GET /api/games/{id}
        group.MapGet("/{id:guid}", async (Guid id, IGameService gameService) =>
        {
            var game = await gameService.GetGameByIdAsync(id);
            return game is not null 
                ? Results.Ok(game) 
                : Results.NotFound();
        })
        .Produces<GameResponse>(200)
        .Produces(404)
        .WithName("GetGameById");

        // POST /api/games
        group.MapPost("/", async (CreateGameRequest request, IGameService gameService) =>
        {
            var game = await gameService.CreateGameAsync(request);
            return Results.CreatedAtRoute("GetGameById", new { id = game.Id }, game);
        })
        .Produces<GameResponse>(201)
        .Produces<ValidationProblemDetails>(400)
        .WithName("CreateGame");

        // PUT /api/games/{id}
        group.MapPut("/{id:guid}", async (Guid id, UpdateGameRequest request, IGameService gameService) =>
        {
            var success = await gameService.UpdateGameAsync(id, request);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .Produces(204)
        .Produces(404)
        .WithName("UpdateGame");

        // DELETE /api/games/{id}
        group.MapDelete("/{id:guid}", async (Guid id, IGameService gameService) =>
        {
            var success = await gameService.DeleteGameAsync(id);
            return success ? Results.NoContent() : Results.NotFound();
        })
        .Produces(204)
        .Produces(404)
        .WithName("DeleteGame");
    }
}
```

### Models et DTOs

```csharp
// ✅ BON - Models/Requests/CreateGameRequest.cs
using System.ComponentModel.DataAnnotations;

public record CreateGameRequest
{
    [Required(ErrorMessage = "Le nom est requis")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Le nom doit contenir entre 3 et 100 caractères")]
    public required string Name { get; init; }

    [Range(1, 100, ErrorMessage = "Le niveau doit être entre 1 et 100")]
    public int Level { get; init; } = 1;

    public List<string>? Tags { get; init; }
}

// ✅ BON - Models/Responses/GameResponse.cs
public record GameResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public int Level { get; init; }
    public DateTime CreatedAt { get; init; }
    public List<string> Tags { get; init; } = new();
}
```

### Services avec injection de dépendances

```csharp
// ✅ BON - Services/IGameService.cs
public interface IGameService
{
    Task<List<GameResponse>> GetAllGamesAsync();
    Task<GameResponse?> GetGameByIdAsync(Guid id);
    Task<GameResponse> CreateGameAsync(CreateGameRequest request);
    Task<bool> UpdateGameAsync(Guid id, UpdateGameRequest request);
    Task<bool> DeleteGameAsync(Guid id);
}

// ✅ BON - Services/GameService.cs
public class GameService : IGameService
{
    private readonly IGameRepository _repository;
    private readonly ILogger<GameService> _logger;

    public GameService(IGameRepository repository, ILogger<GameService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<GameResponse> CreateGameAsync(CreateGameRequest request)
    {
        _logger.LogInformation("Creating new game: {GameName}", request.Name);

        var game = new Game
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Level = request.Level,
            CreatedAt = DateTime.UtcNow,
            Tags = request.Tags ?? new List<string>()
        };

        await _repository.AddAsync(game);

        return new GameResponse
        {
            Id = game.Id,
            Name = game.Name,
            Level = game.Level,
            CreatedAt = game.CreatedAt,
            Tags = game.Tags
        };
    }

    // ... autres méthodes
}
```

### Validation et gestion d'erreurs

```csharp
// ✅ BON - Middleware de gestion globale des erreurs
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error occurred");
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { error = "An internal error occurred" });
        }
    }
}
```

### Tests

```csharp
// ✅ BON - Tests unitaires avec xUnit
public class GameServiceTests
{
    private readonly Mock<IGameRepository> _mockRepository;
    private readonly Mock<ILogger<GameService>> _mockLogger;
    private readonly GameService _service;

    public GameServiceTests()
    {
        _mockRepository = new Mock<IGameRepository>();
        _mockLogger = new Mock<ILogger<GameService>>();
        _service = new GameService(_mockRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task CreateGameAsync_ValidRequest_ReturnsGameResponse()
    {
        // Arrange
        var request = new CreateGameRequest
        {
            Name = "Test Game",
            Level = 5
        };

        // Act
        var result = await _service.CreateGameAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(request.Name, result.Name);
        Assert.Equal(request.Level, result.Level);
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Game>()), Times.Once);
    }
}
```

### Conventions .NET

```csharp
// ✅ Conventions de nommage
// - Fichiers: PascalCase (GameService.cs)
// - Classes/Interfaces: PascalCase (IGameService, GameService)
// - Méthodes publiques: PascalCase (GetGameByIdAsync)
// - Méthodes privées: camelCase ou _camelCase (private void processGame() ou _processGame())
// - Paramètres: camelCase (string gameName)
// - Constants: PascalCase (const int MaxLevel = 100)
// - Fields privés: _camelCase (private readonly ILogger _logger)

// ✅ Async/Await
// Toujours suffixer avec "Async" et retourner Task<T>
public async Task<GameResponse> GetGameAsync(Guid id)
{
    return await _repository.GetByIdAsync(id);
}

// ✅ Records pour DTOs immutables
public record GameDto(Guid Id, string Name, int Level);

// ✅ Nullable reference types
public GameResponse? FindGame(Guid id) // Peut retourner null
{
    return _games.FirstOrDefault(g => g.Id == id);
}
```

---

## 🎮 Intégration Phaser 3 avec Angular

### Service Phaser

```typescript
// ✅ BON - Services/phaser.service.ts
import { Injectable, signal } from '@angular/core';
import Phaser from 'phaser';

@Injectable({
  providedIn: 'root'
})
export class PhaserService {
  private game?: Phaser.Game;
  readonly gameState = signal<GameState | null>(null);

  initGame(config: Phaser.Types.Core.GameConfig): void {
    this.game = new Phaser.Game(config);
  }

  destroyGame(): void {
    this.game?.destroy(true);
    this.game = undefined;
  }

  getScene<T extends Phaser.Scene>(key: string): T | undefined {
    return this.game?.scene.getScene(key) as T;
  }
}
```

---

## 🔒 Sécurité

### Angular
- Utiliser `DomSanitizer` pour le contenu dynamique
- Activer le mode production pour le build
- Valider toutes les entrées utilisateur
- Utiliser `HttpInterceptor` pour les tokens d'auth

### .NET
- Activer HTTPS en production
- Implémenter l'authentification JWT
- Valider les inputs avec Data Annotations
- Utiliser des parameterized queries
- Configurer CORS strictement

---

## 📝 Documentation

- Commenter le code complexe
- Utiliser JSDoc/XML Doc comments
- Maintenir un README.md à jour
- Documenter les endpoints API avec Swagger/OpenAPI

---

## ⚠️ Rappels importants

1. **TOUJOURS suivre le workflow en 6 étapes** pour les nouvelles features
2. **JAMAIS** continuer après l'étape 6 sans confirmation explicite
3. **TOUJOURS** créer l'issue GitHub avant la branche
4. **TOUJOURS** utiliser le kebab-case en anglais pour les noms de branches
5. **TOUJOURS** préfixer les branches avec `feature/`
6. **TOUJOURS** utiliser les signals Angular 21 au lieu des Subjects RxJS quand possible
7. **TOUJOURS** utiliser des records C# pour les DTOs immutables
8. **TOUJOURS** typer strictement (TypeScript et C#)

---

*Ces instructions doivent être suivies pour assurer la cohérence et la qualité du code dans le projet Gamified Resume Reborn.*
