# Copilot Instructions - Gamified Resume Reborn

## � Language Guidelines

### Code & Comments
- ✅ **ALL code MUST be written in ENGLISH** (variables, functions, classes, files, etc.)
- ✅ **ALL code comments MUST be in ENGLISH** (JSDoc, inline comments, documentation)
- ✅ **ALL commit messages MUST be in ENGLISH**
- ✅ **ALL branch names MUST be in ENGLISH**

### Agent Responses
- ✅ **ALL agent responses to the user MUST be in FRENCH**
- ✅ When asking questions to the user, use FRENCH
- ✅ When providing explanations or summaries, use FRENCH
- ✅ When reporting progress or status, use FRENCH

### Examples
```typescript
// ✅ CORRECT - Code and comments in English
/**
 * Initializes the game with the provided configuration
 * @param config Phaser game configuration
 */
function initGame(config: GameConfig): void {
  // Create new game instance
  const game = new Phaser.Game(config);
}

// ❌ INCORRECT - Comments in French
/**
 * Initialise le jeu avec la configuration fournie
 * @param config Configuration du jeu Phaser
 */
function initGame(config: GameConfig): void {
  // Créer une nouvelle instance du jeu
  const game = new Phaser.Game(config);
}
```

---

## 🎯 Project Overview

This project is a **gamified** application using:
- **Frontend**: Angular 21 (monorepo architecture)
- **Backend**: .NET 10 with Minimal API
- **Game Engine**: Phaser 3 for 2D game engine

---

## 📋 Development Workflows

### ⚠️ Important Rule: Automatic Task Type Detection

Before starting any work, **ALWAYS** determine the task type and context:

1. **New Feature**: Adding new functionality (e.g., "Add inventory system")
   → Check if related to current branch, then follow appropriate workflow

2. **Technical Task**: Refactoring, fixes, improvements, optimizations (e.g., "Refactor code", "Performance improvement", "Bug fix")
   → Check if related to current branch, then follow appropriate workflow

### 🔍 Context Detection (Step 0 for all workflows)

Before following any workflow, **ALWAYS** check:

```
❓ Question to ask: "Is this task related to the current branch and its feature/issue?"

📝 If YES (task is part of current work):
   → Skip steps 4, 5, 6 (no issue/branch/PR creation)
   → Ask user confirmation before implementation
   → Continue on current branch

📝 If NO (independent task):
   → Follow complete workflow (all 7 steps)
   → Create new issue, branch, and PR
```

---

## 📋 Feature Workflow (New Functionality)

### Mandatory process for each new feature

**⚠️ STEP 0: Check Context (see Context Detection above)**

Follow these steps **rigorously** in order:

#### 1️⃣ Collect Feature Title
```
❓ Question to ask: "What is the title of the feature you want to develop?"
📝 Expected format: Short and descriptive title (e.g., "Add inventory system")
✅ Validation: Title must be clear and in French (for user communication)
```

#### 2️⃣ Collect Detailed Content
```
❓ Question to ask: "Describe the content and functionality of this feature"
📝 Expected format: Detailed description including:
   - Feature objective
   - Main functionalities
   - Expected behaviors
   - Technical constraints
✅ Validation: Description must be detailed enough for implementation
```

#### 3️⃣ Collect Acceptance Tests
```
❓ Question to ask: "What are the acceptance criteria and tests for this feature?"
📝 Expected format: List of testable criteria (Given/When/Then)
   Example:
   - GIVEN: User is on the game screen
   - WHEN: User presses 'I' key
   - THEN: Inventory opens with collected items
✅ Validation: At least 3 clear acceptance criteria
```

#### 4️⃣ Create GitHub Issue (⚠️ SKIP if task is part of current branch)
```
🔧 Action: Automatically create an issue on the repository with:
   - Title: [same title as step 1, translated to English]
   - Body: 
     ## Description
     [content from step 2, in English]
     
     ## Acceptance Criteria
     [tests from step 3, in English]
     
     ## Suggested Labels
     - feature
     - [frontend/backend depending on case]
     
📍 Repository: curious-academy/gamified-resume-reborn
✅ Confirmation: Display issue number and URL
```

#### 5️⃣ Create Local Branch (⚠️ SKIP if task is part of current branch)
```
🔧 Action: Create a local branch with format:
   - Name: feature/[title-in-kebab-case]
   - Base: current branch (usually main or install-phaser)
   
📝 Title transformation:
   - Convert to English if not already
   - Convert to kebab-case (lowercase, words separated by -)
   - Prefix with "feature/"
   
Example: "Add inventory system" → "feature/add-inventory-system"

✅ Confirmation: Display created branch name
```

#### 6️⃣ Create Pull Request and Link to Issue (⚠️ SKIP if task is part of current branch)
```
🔧 Action: Automatically create a Pull Request with:
   - Title: Same as the issue title
   - Body: 
     ## Description
     [Brief description of the feature]
     
     ## Related Issue
     Closes #[issue-number]
     
     ## Type of Change
     - [x] New feature
     
   - Base: main (or current default branch)
   - Head: [branch-name from step 5]
   - Draft: true (mark as draft initially)
   - Link to issue: Use "Closes #[issue-number]" in PR body

📍 Repository: curious-academy/gamified-resume-reborn
✅ Confirmation: Display PR number and URL
```

#### 7️⃣ Pause and Wait for Confirmation
```
⏸️ Mandatory message (in French):

IF steps 4, 5, 6 were executed (independent task):
"✅ Feature setup complet !
📝 Issue #[number] créée: [URL]
🌿 Branche créée: [branch-name]
🔗 Pull Request #[number] créée: [URL]

⏳ Attendant votre confirmation pour commencer l'implémentation.
💬 Tapez 'go' ou 'continue' pour démarrer le développement."

IF steps 4, 5, 6 were skipped (task related to current branch):
"✅ Préparation terminée !
🌿 Branche actuelle: [current-branch-name]
📋 Tâche: [task-title]

⏳ Attendant votre confirmation pour commencer l'implémentation.
💬 Tapez 'go' ou 'continue' pour démarrer le développement."

⛔ DO NOT continue without explicit user confirmation
```

#### 8️⃣ Build Verification and Commit (After Implementation)
```
🔧 After completing the implementation and receiving user approval:

STEP 8.1 - Build Verification:
   - Run: ng build
   - Check build output for errors
   
STEP 8.2 - Error Handling (if build fails):
   - Analyze build errors
   - Fix errors automatically
   - Run ng build again
   - Repeat until build succeeds
   - ⚠️ DO NOT proceed to commit until build is successful
   
STEP 8.3 - Conventional Commit (only if build succeeds):
   - Format: <type>(<scope>): <subject>
   - Types:
     * feat: New feature
     * fix: Bug fix
     * refactor: Code refactoring
     * perf: Performance improvement
     * style: Code style changes
     * docs: Documentation changes
     * test: Test changes
     * chore: Build/tooling changes
   
   - Scope: Component or feature name (e.g., training, game, terminal)
   - Subject: Short description in English (max 72 chars)
   
   Examples:
   * "feat(training): add video input component"
   * "feat(training): implement training list and detail views"
   * "refactor(game): simplify player entity logic"
   * "fix(terminal): resolve command parsing issue"

STEP 8.4 - Commit Execution:
   - Stage all changes: git add .
   - Commit with conventional message
   - Display commit confirmation

📝 Message (in French):
"🔨 Build en cours...
✅ Build réussi !
💾 Commit effectué: [commit-message]"

OR if build failed initially:
"🔨 Build en cours...
❌ Erreurs détectées, correction en cours...
🔄 Tentative [N]...
✅ Build réussi !
💾 Commit effectué: [commit-message]"
```

---

## 📋 Technical Workflow (Refactoring, Fixes, Improvements)

### Mandatory process for each technical task

**⚠️ STEP 0: Check Context (see Context Detection above)**

Follow these steps **rigorously** in order:

#### 1️⃣ Collect Task Title
```
❓ Question to ask: "What is the title of the technical task you want to accomplish?"
📝 Expected format: Short and descriptive title (e.g., "Refactor App component", "Fix collision bug")
✅ Validation: Title must be clear and in French (for user communication)
```

#### 2️⃣ Collect Detailed Content
```
❓ Question to ask: "Describe the content and objectives of this technical task"
📝 Expected format: Detailed description including:
   - Current problem or context
   - Improvement/fix objective
   - Proposed technical approach
   - Expected impacts
✅ Validation: Description must be detailed enough for implementation
```

#### 3️⃣ Collect Validation Criteria
```
❓ Question to ask: "What are the validation criteria for this technical task?"
📝 Expected format: List of verifiable criteria
   Example for refactoring:
   - Code compiles without errors
   - Existing tests still pass
   - Architecture respects SOLID principles
   - Documentation is up to date
✅ Validation: At least 3 clear validation criteria
```

#### 4️⃣ Create GitHub Issue (⚠️ SKIP if task is part of current branch)
```
🔧 Action: Automatically create an issue on the repository with:
   - Title: [same title as step 1, translated to English]
   - Body: 
     ## Context
     [content from step 2, in English]
     
     ## Validation Criteria
     [criteria from step 3, in English]
     
     ## Suggested Labels
     - enhancement (for improvement)
     - refactoring (for refactoring)
     - bug (for fix)
     - [frontend/backend depending on case]
     
📍 Repository: curious-academy/gamified-resume-reborn
✅ Confirmation: Display issue number and URL
```

#### 5️⃣ Create Local Branch (⚠️ SKIP if task is part of current branch)
```
🔧 Action: Create a local branch with format:
   - Name: [type]/[title-in-kebab-case]
   - Type: tech/ for refactoring, fix/ for fixes, improve/ for improvements
   - Base: current branch (usually main or install-phaser)
   
📝 Title transformation:
   - Convert to English if not already
   - Convert to kebab-case (lowercase, words separated by -)
   - Prefix with appropriate type
   
Examples: 
   - "Refactor App component" → "tech/refactor-app-component"
   - "Fix collision bug" → "fix/collision-bug"
   - "Performance improvement" → "improve/performance-optimization"

✅ Confirmation: Display created branch name
```

#### 6️⃣ Create Pull Request and Link to Issue (⚠️ SKIP if task is part of current branch)
```
🔧 Action: Automatically create a Pull Request with:
   - Title: Same as the issue title
   - Body: 
     ## Context
     [Brief description of the technical task]
     
     ## Related Issue
     Closes #[issue-number]
     
     ## Type of Change
     - [x] Technical improvement/refactoring/bug fix
     
   - Base: main (or current default branch)
   - Head: [branch-name from step 5]
   - Draft: true (mark as draft initially)
   - Link to issue: Use "Closes #[issue-number]" in PR body

📍 Repository: curious-academy/gamified-resume-reborn
✅ Confirmation: Display PR number and URL
```

#### 7️⃣ Pause and Wait for Confirmation
```
⏸️ Mandatory message (in French):

IF steps 4, 5, 6 were executed (independent task):
"✅ Tâche technique setup complet !
📝 Issue #[number] créée: [URL]
🌿 Branche créée: [branch-name]
🔗 Pull Request #[number] créée: [URL]

⏳ Attendant votre confirmation pour commencer l'implémentation.
💬 Tapez 'go' ou 'continue' pour démarrer le développement."

IF steps 4, 5, 6 were skipped (task related to current branch):
"✅ Préparation terminée !
🌿 Branche actuelle: [current-branch-name]
📋 Tâche: [task-title]

⏳ Attendant votre confirmation pour commencer l'implémentation.
💬 Tapez 'go' ou 'continue' pour démarrer le développement."

⛔ DO NOT continue without explicit user confirmation
```

#### 8️⃣ Build Verification and Commit (After Implementation)
```
🔧 After completing the implementation and receiving user approval:

STEP 8.1 - Build Verification:
   - Run: ng build
   - Check build output for errors
   
STEP 8.2 - Error Handling (if build fails):
   - Analyze build errors
   - Fix errors automatically
   - Run ng build again
   - Repeat until build succeeds
   - ⚠️ DO NOT proceed to commit until build is successful
   
STEP 8.3 - Conventional Commit (only if build succeeds):
   - Format: <type>(<scope>): <subject>
   - Types:
     * feat: New feature
     * fix: Bug fix
     * refactor: Code refactoring
     * perf: Performance improvement
     * style: Code style changes
     * docs: Documentation changes
     * test: Test changes
     * chore: Build/tooling changes
   
   - Scope: Component or feature name (e.g., training, game, terminal)
   - Subject: Short description in English (max 72 chars)
   
   Examples:
   * "fix(game): resolve collision detection bug"
   * "refactor(terminal): simplify command processing"
   * "perf(player): optimize entity update loop"
   * "style(app): apply consistent formatting"

STEP 8.4 - Commit Execution:
   - Stage all changes: git add .
   - Commit with conventional message
   - Display commit confirmation

📝 Message (in French):
"🔨 Build en cours...
✅ Build réussi !
💾 Commit effectué: [commit-message]"

OR if build failed initially:
"🔨 Build en cours...
❌ Erreurs détectées, correction en cours...
🔄 Tentative [N]...
✅ Build réussi !
💾 Commit effectué: [commit-message]"
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

## 🔒 Security


### .NET
- Enable HTTPS in production
- Implement JWT authentication
- Validate inputs with Data Annotations
- Use parameterized queries
- Configure CORS strictly

---

## 📝 Documentation

- Comment complex code
- Use JSDoc/XML Doc comments
- Maintain an up-to-date README.md
- Document API endpoints with Swagger/OpenAPI

---

## ⚠️ Important Reminders

1. **ALWAYS detect the task type** (feature vs technical) before starting
2. **ALWAYS follow the appropriate 8-step workflow** (Feature or Technical)
3. **NEVER** continue after step 7 without explicit user confirmation
4. **ALWAYS** create the GitHub issue before the branch
5. **ALWAYS** create the Pull Request and link it to the issue
6. **ALWAYS** use kebab-case in English for branch names
7. **ALWAYS** use the correct branch prefix:
   - `feature/` for new features
   - `tech/` for refactorings
   - `fix/` for bug fixes
   - `improve/` for improvements
8. **ALWAYS** run `ng build` after implementation and fix errors until build succeeds
9. **ALWAYS** use conventional commit format for commit messages
10. **ALWAYS** use Angular 21 signals instead of RxJS Subjects when possible
11. **ALWAYS** use C# records for immutable DTOs
12. **ALWAYS** use strict typing (TypeScript and C#)

---

*These instructions must be followed to ensure consistency and code quality in the Gamified Resume Reborn project.*
