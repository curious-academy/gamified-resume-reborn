## Context
Currently, the game component (`app-game`) and all related UI elements (controls info, terminal prompt, terminal) are integrated directly into the `app.html` template. This creates tight coupling and makes the `AppComponent` responsible for both application layout and game-specific logic.

## Objectives
- Extract the entire game section into a dedicated `GameContainerComponent`
- Create a route `/game/new` for this new component
- Simplify `AppComponent` to only contain the header and router-outlet
- Improve separation of concerns and modularity

## Technical Approach
1. Create a new `GameContainerComponent` in `features/game/`
2. Move all game-related HTML from `app.html` to the new component template
3. Move terminal logic (openTerminal, closeTerminal, closePrompt methods) to the new component
4. Configure the `/game/new` route in `app.routes.ts`
5. Update `app.html` to only retain the header and `<router-outlet>`
6. Ensure all service dependencies (TerminalService, KeyboardService) are properly injected

## Expected Impacts
- Better separation of responsibilities
- Lighter and more focused `AppComponent`
- Navigation to the game via routing
- More modular and maintainable architecture

## Validation Criteria
- [ ] The new `GameContainerComponent` is created in `features/game/` and contains all game logic extracted from `app.html`
- [ ] The route `/game/new` is configured in `app.routes.ts` and points to the new component
- [ ] The `AppComponent` is simplified: it only contains the header and `<router-outlet>`
- [ ] The application compiles without TypeScript errors
- [ ] The game functions identically to before (navigation, controls, terminal, etc.)
- [ ] Services (TerminalService, KeyboardService) are correctly injected in the new component
- [ ] Code respects Angular 21 best practices (standalone components, signals, control flow syntax @if)
