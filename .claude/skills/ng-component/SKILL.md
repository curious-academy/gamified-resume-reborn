---
name: ng-component
description: Generate an Angular component following project conventions. Use when the user wants to create a new Angular component, asks for a component, or mentions "ng g c".
---

# Angular Component Generator

You are a component generator for this Angular project. Your role is to create Angular components using the Angular CLI while strictly following the project's folder conventions.

## MANDATORY RULES

1. **ALWAYS use `ng g c`** (Angular CLI) to generate components - NEVER create component files manually
2. **ALWAYS ask the user for the feature name** if it's not explicitly provided in their request
3. **ALWAYS ask the user for the component type** if not clear from context

## Folder Structure Conventions

Components MUST be placed in one of these locations:

### 1. Feature Components
**Path:** `projects/main-app/src/app/features/<feature>/components/<component-name>`

Use for: Components specific to a feature that are NOT full pages.

### 2. Feature Pages
**Path:** `projects/main-app/src/app/features/<feature>/pages/<component-name>.page`

Use for: Full page components within a feature (routable components).

### 3. Shared Components
**Path:** `projects/main-app/src/app/shared/components/<category>/<component-name>`

Use for: Reusable components used across multiple features.
The `<category>` should group similar components (e.g., `buttons`, `forms`, `layout`, `cards`, `modals`).

## Workflow

### Step 1: Gather Information

If the user's request is missing any of these, you MUST ASK before proceeding:

1. **Component name** - What should the component be called?
2. **Feature name** - Which feature does this belong to? (required for feature components/pages)
3. **Component type** - Is this a:
   - Feature component (part of a specific feature)
   - Page component (a routable page within a feature)
   - Shared component (reusable across features)
4. **Category** (for shared components only) - What category? (e.g., buttons, forms, layout)

### Step 2: Generate the Component

Run the Angular CLI command from the `apps/web/front-end` directory:

```bash
cd /root/curious-labs/apps/web/front-end && ng g c <path>
```

**Examples:**

```bash
# Feature component
ng g c features/auth/components/login-form

# Page component
ng g c features/auth/pages/login.page

# Shared component
ng g c shared/components/buttons/primary-button
```

### Step 3: Apply Design System (DA)

**MANDATORY:** After generating the component, you MUST apply the Direction Artistique (DA) to the HTML template.

**Invoke the `da-style` skill using the Skill tool:**

The da-style skill will automatically:
- Apply the blue-grey / orange color palette
- Add appropriate spacing and typography
- Include hover/focus states for interactive elements
- Ensure accessibility standards
- **Verify build and auto-commit the changes**

**DO NOT skip this step - all components must follow the DA.**

**Note:** Since da-style handles build verification and commit, you don't need to do these steps manually.

### Step 4: Confirm Creation

After the da-style skill completes, confirm to the user:
- The files that were created
- The path where the component was generated
- That the build is successful
- That changes have been committed
- Any next steps (like adding to routes for pages)

## Example Interactions

### Example 1: Missing feature name
**User:** "Create a user profile card component"
**You:** "I'll create the user profile card component. Which feature does this belong to? Or should this be a shared component reusable across features?"

### Example 2: Missing component type
**User:** "Create a dashboard component for the analytics feature"
**You:** "I'll create a dashboard component for the analytics feature. Should this be:
1. A **page** (routable, full page view) - placed in `features/analytics/pages/dashboard.page`
2. A **component** (part of a page) - placed in `features/analytics/components/dashboard`"

### Example 3: Shared component missing category
**User:** "Create a shared loading spinner"
**You:** "I'll create a shared loading spinner component. What category should it be in? For example: `feedback`, `layout`, `indicators`?"

### Example 4: Complete request
**User:** "Create a login form component in the auth feature"
**You:** *Proceeds to run:*
```bash
cd /root/curious-labs/apps/web/front-end && ng g c features/auth/components/login-form
```

## Important Notes

- Components are generated as **standalone** by default (Angular 21)
- The CLI will create: `component.ts`, `component.html`, `component.css`, `component.spec.ts`
- For pages, remind the user to add the route in `app.routes.ts`
- Always run commands from the `apps/web/front-end` directory

## MANDATORY Angular Standards (apply to every generated component)

### 1. ChangeDetectionStrategy.OnPush — ALWAYS

Every component **MUST** use `OnPush` change detection. No exceptions.

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class MyComponent {}
```

### 2. Derived values from inputs → `computed` signals, NEVER methods

Any value that is derived from an `input()` signal **MUST** be expressed as a `computed()` signal, not as a regular class method.

**❌ WRONG — method called in template:**
```typescript
export class MyComponent {
  readonly duration = input.required<number>();

  // BAD: regular method
  formatDuration(minutes: number): string {
    return `${minutes} min`;
  }
}
```
```html
<!-- BAD: method call in template -->
{{ formatDuration(duration()) }}
```

**✅ CORRECT — computed signal:**
```typescript
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export class MyComponent {
  readonly duration = input.required<number>();

  // GOOD: computed signal derived from input
  readonly formattedDuration = computed(() => {
    const minutes = this.duration();
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  });
}
```
```html
<!-- GOOD: computed property access -->
{{ formattedDuration() }}
```

**Rule:** If a method takes an input signal's value as parameter to return a derived value, convert it to a `computed`. Pure lookup helpers called with **strictly local variables** (e.g., `getRarityClass(reward.rarity)` where `reward.rarity` is a loop-local value **and** the method does not access any signal internally) may stay as methods.

> ⚠️ **Critical distinction:** If the method body calls `this.someSignal()` or `this.someComputed()` internally — even if the parameter looks "loop-local" — the entire method **MUST** be refactored into a `computed`. Hiding signal reads inside a regular method call defeats OnPush and makes change detection unpredictable.

**❌ WRONG — method accesses a signal internally (disguised as a lookup):**
```typescript
// Template: @if (getPosition(node.objective.id); as pos)
getPosition(id: string): NodePosition | undefined {
  return this.positions().find(p => p.id === id); // BAD: reads signal inside method
}
```

**✅ CORRECT — use a computed Map for O(1) lookup:**
```typescript
// In component class:
readonly positionMap = computed(() =>
  new Map(this.positions().map(p => [p.id, p]))
);
```
```html
<!-- Template: -->
@if (positionMap().get(node.objective.id); as pos) { ... }
```

### 3. MANDATORY Auto-Commit

After the component is generated, styled (via da-style), and the build succeeds:
- **Auto-commit immediately** — do NOT ask the user
- Use the `commit` skill in auto-commit mode
- If da-style already committed, verify with `git status` — if clean, skip

**If da-style is NOT invoked** (e.g., headless component with no template):
- Verify the build: `ng build main-app`
- Auto-commit: `git add -A && git commit -m "feat(<feature>): generate <component-name> component"`

### 4. Checklist before committing a component

- [ ] `ChangeDetectionStrategy.OnPush` is set in the decorator
- [ ] No method calls in the template that derive from `input()` signals
- [ ] All such derivations use `computed()`
- [ ] `computed` is imported from `@angular/core`
