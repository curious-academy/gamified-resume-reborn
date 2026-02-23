# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Rules

- **Code, comments, commits, branch names**: ALL in ENGLISH
- **Responses to the user**: ALL in FRENCH

## Build & Development Commands

```bash
npm start                 # Dev server (auto-builds shared-ui first via prestart)
ng build main-app         # Build main app (ALWAYS specify project name)
npm run build:lib         # Build shared-ui library
npm run build:all         # Build both projects
npm run test:main-app     # Test main app
npm run test:lib          # Test shared-ui library
```

**CRITICAL**: Always run `ng build main-app` before every commit. Fix all errors AND warnings before committing. Never use bare `ng build` in this monorepo.

## Project Overview

**Gamified Resume Reborn** - A 2D RPG game (Final Fantasy 6-style) built as an Angular 21 monorepo with Phaser 3. Players explore, interact with NPCs, and learn through gameplay.

**Stack**: Angular 21 (next) | Phaser 3 | NgRx Signals | TypeScript 5.9 | SCSS | Karma+Jasmine

## Monorepo Structure

```
projects/
├── main-app/           # Angular application
│   └── src/app/
│       ├── core/       # Singleton services (PhaserService, DialogService, KeyboardService, etc.)
│       │   ├── guards/
│       │   ├── models/
│       │   └── services/
│       └── features/   # Feature modules (lazy-loaded)
│           ├── game/          # Core 2D game (Phaser scenes, entities, store)
│           ├── loading/       # Loading screen
│           ├── menu/          # Main menu
│           ├── terminal/      # CLI terminal feature
│           └── training/      # Training/learning modules
└── shared-ui/          # Shared UI component library
```

## Architecture

### Angular + Phaser Integration

`PhaserService` (singleton) manages the Phaser game lifecycle. `GameScene` extends `Phaser.Scene` and contains all game logic. Angular components communicate with the game through services and the NgRx signal store.

### Event-Driven State Management

State is managed via `GameSessionStore` using NgRx Signals with an event-driven pattern:

1. **Events** defined in `features/game/store/game-session.events.ts` via `eventGroup()`
2. **Reducers** react to events with `withReducer(on(...))` in the store
3. **Methods** on the store dispatch events via `Dispatcher` from `@ngrx/signals/events`
4. **Computed signals** derive UI state (e.g., `isSessionActive`, `playerPosition`)

Flow: Game action -> Store method -> Dispatcher -> Event -> Reducer -> Signal update -> UI reactivity

### Entity Pattern

Game entities (`Player`, `NPC`, `Terminal`) extend Phaser base classes and live in `features/game/entities/`. They handle their own rendering, physics, and interaction logic.

### Data Loading

`GameDataLoaderService` fetches game data from `http://localhost:5000/api/game-data/all` with automatic fallback to mock data. Data is cached in Maps for O(1) access during the game loop. The `/game` route is guarded by `gameDataLoadedGuard`.

### Routing

All routes use lazy-loaded standalone components. Routes: `menu` (default) | `loading` | `trainings` | `trainings/:id` | `game` (guarded).

## Commit Conventions

Format: `<type>(<scope>): <subject>` (max 72 chars, English)

Types: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `chore`
Scopes: `game`, `player`, `terminal`, `store`, `training`, `loading`, `routing`, etc.

Branch prefixes: `feature/` | `tech/` | `fix/` | `improve/`

## Workflow Rules

1. **Build before every commit**: `ng build main-app` - no exceptions
2. **Commit incrementally**: after each logical unit of work, not accumulated
3. **For non-code files** (docs, config): commit immediately without build
4. **Wait for user confirmation** before starting implementation on new features/tasks
5. **Context detection**: check if current task relates to the active branch before creating new issues/branches/PRs

### New Branch Workflow (independent tasks)

When a task is NOT related to the current branch, execute these steps **before** any implementation:

1. **Create branch** from `main`: `git checkout -b <prefix>/<kebab-case-name> main`
2. **Push branch** immediately: `git push -u origin <branch-name>`
3. **Create draft PR** immediately via `gh pr create --draft --title "..." --body "..."`
4. **Then** start implementation (with build + commit after each modification)

This ensures the PR exists from the start and tracks all commits automatically.

## Code Conventions

- Angular 21 standalone components with `inject()` (not constructor DI)
- Signals over RxJS Subjects when possible
- `ChangeDetectionStrategy.OnPush` for all components
- Strict TypeScript (`strict: true`, `noImplicitReturns`, etc.)
- Prettier: 100 char width, single quotes, angular HTML parser
- Path mapping: `shared-ui` -> `./dist/shared-ui`

## Backend (.NET 10 Minimal API)

Not yet in this repo but planned. Structure: `Endpoints/` (route groups) | `Services/` | `Repositories/` | `Models/Requests/` + `Models/Responses/` (records for DTOs).
