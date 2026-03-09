# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Rules

- **Code, comments, commit messages, branch names**: ALL in English
- **Agent responses to the user**: ALL in French

## Build & Commit (Critical Rules)

- **ALWAYS build before committing**: `ng build main-app` - NO EXCEPTIONS
- **Commit after each logical modification** - do not accumulate changes
- **Fix all build warnings** (unused imports, type issues) before committing
- **Always specify project**: `ng build main-app`, not `ng build`
- Conventional commit format: `<type>(<scope>): <subject>` (max 72 chars)
  - Types: feat, fix, refactor, perf, style, docs, test, chore
  - Scopes: game, training, terminal, routing, player, etc.

## Commands

```bash
# Install
npm install

# Dev server (auto-builds shared-ui first via prestart)
npm start                    # serves main-app on localhost:4200

# Build
npm run build:lib            # build shared-ui library (must be built before main-app)
npm run build                # build main-app (production)
npm run build:all            # build shared-ui then main-app

# Test
npm run test:main-app        # Karma tests for main-app
npm run test:lib             # Karma tests for shared-ui
```

## Architecture

Angular 21 monorepo with Phaser 3 game engine. Two projects under `projects/`:

### `projects/main-app/` - Main Application

Standalone components with lazy-loaded routes (`app.routes.ts`):
- `/menu` - Menu screen
- `/loading` - Loading screen (loads game data from backend)
- `/trainings` - Training list/detail views
- `/game` - Game container (guarded by `gameDataLoadedGuard`)

Feature-based organization under `src/app/`:

**`core/`** - Singleton services and models:
- `PhaserService` - Manages Phaser.Game lifecycle (init/destroy)
- `GameDataLoaderService` - Loads game data from backend API (`localhost:5000/api/game-data/all`), falls back to mock data
- `DialogService` - NPC dialog state management using Angular signals
- `TerminalService` - In-game terminal interaction state
- `KeyboardService` - Keyboard input management
- `game-data.models.ts` - Shared interfaces: `GameData`, `NpcData`, `DialogData`, `ItemData`

**`features/game/`** - Phaser 3 game integration:
- `GameContainerComponent` - Angular wrapper, composes GameComponent + Terminal UI
- `GameComponent` - Initializes Phaser via PhaserService
- `GameScene` (Phaser.Scene) - Main scene: creates map, player, NPCs, terminal, handles collisions and interactions
- `entities/` - Phaser game objects:
  - `Player` - Rectangle-based player with ZQSD/WASD movement, run (Shift), direction colors
  - `Npc` - Autonomous NPCs with waypoint movement, interaction prompts (E key)
  - `Terminal` - In-game terminal object with proximity detection
- `ui/dialog-box.ts` - Phaser-rendered dialog box for NPC conversations
- `config/game-scene.config.ts` - Scene configuration interface

**`features/training/`** - Training/quest system with models (Training, Quest, Objective, Video)

**`features/terminal/`** - Terminal UI components (Angular)

### `projects/shared-ui/` - Shared UI Library

Angular component library (built with ng-packagr). Must be built before main-app.
- Exports via `public-api.ts`
- Import as `'shared-ui'` (path mapped to `dist/shared-ui` in tsconfig)

## Key Patterns

- **Angular signals** preferred over RxJS Subjects for state management
- **Phaser-Angular bridge**: Angular services are injected into Phaser scenes via `GameSceneConfig` constructor parameter (not Angular DI)
- **Game data flow**: LoadingScreen loads data via `GameDataLoaderService` -> cached in Maps -> synchronous access during gameplay
- **Standalone components** with `ChangeDetectionStrategy.OnPush`
- **SCSS** for styling
- **Strict TypeScript**: `strict: true`, `strictTemplates: true`
- **Prettier** configured: 100 printWidth, singleQuote, angular HTML parser

## Workflow

Before starting any task, determine if it relates to the current branch or requires a new issue/branch/PR:
- **Same branch**: Skip issue/branch/PR creation, implement directly
- **New task**: Create GitHub issue -> branch (`feature/`, `tech/`, `fix/`, `improve/` prefix) -> draft PR -> wait for user confirmation before implementing

Branch prefixes: `feature/` (new features), `tech/` (refactoring), `fix/` (bug fixes), `improve/` (improvements)

Backend planned: .NET 10 Minimal API (not yet implemented in repo).
