---
name: ngrx-signals-store-management
description: Create, modify and manage NgRx Signal Stores based on a given model. Use this when asked to create or modify a store with ngrx signals, manage events with eventGroup, add computed signals, or handle signal dependencies with withLinkedState.
license: MIT
---

# NgRx Signals Store Management

## When to Use This Skill

Use this skill when:
- Creating a new NgRx Signal Store for a feature
- Modifying an existing NgRx Signal Store
- Adding event management with eventGroup
- Creating computed signals with withComputed
- Managing signal dependencies with withLinkedState
- Setting up state management for Angular components

## Core Principles

### 0. Event-Driven Architecture (CRITICAL - MANDATORY)

**⚠️ ABSOLUTE RULE: All stores MUST use event-driven architecture with Events plugin**

This is NON-NEGOTIABLE. Never create a store without this pattern.

#### Required Pattern Components

1. **Events with eventGroup** (`store/feature.events.ts`)
```typescript
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const featureEvents = eventGroup({
  source: 'Feature Name',
  events: {
    opened: type<void>(),
    queryChanged: type<string>(),
    itemSelected: type<number>(),
  },
});
```

2. **Event Handlers with withEventHandlers** (`store/index.ts`)
```typescript
import { Events, Dispatcher, withEventHandlers } from '@ngrx/signals/events';

// CRITICAL: Must inject Events service for event listening
withEventHandlers(
  (store, events = inject(Events), service = inject(SomeService)) => ({
    // Observable ending in $ - reacts to events
    onFeatureOpened$: events
      .on(featureEvents.opened, featureEvents.queryChanged)
      .pipe(
        switchMap(() =>
          service.getData().pipe(
            mapResponse({
              next: (data) => apiEvents.loadSuccess(data),
              error: (error) => apiEvents.loadFailure(error.message),
            })
          )
        )
      ),
    
    // Another handler for logging
    onError$: events
      .on(apiEvents.loadFailure)
      .pipe(tap(({ payload }) => console.error(payload))),
  })
)
```

3. **State Transitions with withReducer** (REQUIRED for state updates)
```typescript
import { on, withReducer } from '@ngrx/signals/events';

// CRITICAL: Use withReducer with on() for ALL state updates in response to events
withReducer(
  // Simple state update
  on(featureEvents.queryChanged, ({ payload: query }) => ({
    filter: { query },
  })),
  
  // Access current state via second parameter
  on(featureEvents.itemSelected, ({ payload: id }, state) => ({
    selectedItem: state.items.find(item => item.id === id) ?? null,
  })),
  
  // Multiple state updates
  on(apiEvents.loadSuccess, ({ payload: items }) => ({
    items,
    isLoading: false,
    error: null,
  })),
  
  // Conditional logic with state access
  on(featureEvents.experienceGained, ({ payload: amount }, state) => {
    const newExp = state.experience + amount;
    if (newExp >= 100) {
      return {
        experience: newExp - 100,
        level: state.level + 1,
      };
    }
    return { experience: newExp };
  })
)
```

4. **Side Effects with withEventHandlers** (ONLY for impure operations)
```typescript
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { switchMap, tap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';

// CRITICAL: Use withEventHandlers ONLY for side effects (API calls, logging, etc.)
withEventHandlers(
  (store, events = inject(Events), service = inject(SomeService)) => ({
    // API call side effect
    loadData$: events
      .on(featureEvents.opened, featureEvents.queryChanged)
      .pipe(
        switchMap(() =>
          service.getData(store.query()).pipe(
            mapResponse({
              next: (data) => apiEvents.loadSuccess(data),
              error: (error: { message: string }) =>
                apiEvents.loadFailure(error.message),
            })
          )
        )
      ),
    
    // Logging side effect
    logError$: events
      .on(apiEvents.loadFailure)
      .pipe(tap(({ payload }) => console.error(payload))),
  })
)
```

5. **Event Dispatching with Dispatcher** (in methods or hooks)
```typescript
// In withMethods
withMethods((store, dispatcher = inject(Dispatcher)) => ({
  startAction(): void {
    // Dispatch events using Dispatcher
    dispatcher.dispatch(featureEvents.opened());
  },
}))

// In withHooks
withHooks({
  onInit(store, dispatcher = inject(Dispatcher)) {
    dispatcher.dispatch(featureEvents.pageOpened());
  },
})
```

6. **Component Integration with injectDispatch**
```typescript
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  // ...
})
export class FeatureComponent {
  readonly store = inject(FeatureStore);
  readonly dispatch = injectDispatch(featureEvents); // Simplified dispatching
  
  onUserAction(): void {
    // Direct event dispatch - cleaner syntax
    this.dispatch.queryChanged('new query');
  }
}
```

#### Architecture Flow

```
[Component] 
   ↓ calls method / uses injectDispatch
[Store Methods / Component]
   ↓ dispatcher.dispatch(event) or dispatch.eventName()
[Dispatcher] 
   ↓ broadcasts event
[State Transitions (withReducer)] 
   ↓ on() catches events and updates state FIRST
   ↓ pure state updates (no side effects)
[Event Handlers (withEventHandlers)] 
   ↓ events.on() listens and reacts AFTER state is updated
   ↓ performs side effects (API calls, logging, etc.)
   ↓ can dispatch new events (success/failure)
[State Updated (if handlers dispatch new events)]
   ↓ signals react
[Component Re-renders]
```

**Key Points:**
- **withReducer runs BEFORE withEventHandlers** (state updates happen first)
- **withReducer** = synchronous, pure state transitions
- **withEventHandlers** = asynchronous, impure side effects

#### Critical Rules for Event-Driven Architecture

**⚠️ MOST IMPORTANT RULE: withReducer vs withEventHandlers**

```
┌─────────────────────────────────────────────────────────────┐
│  withReducer          →  State Transitions (PURE)          │
│    - Modify state in response to events                    │
│    - NO side effects                                        │
│    - NO API calls                                           │
│    - NO logging                                             │
│    - Return partial state objects                           │
│                                                             │
│  withEventHandlers    →  Side Effects (IMPURE)             │
│    - API calls via services                                 │
│    - Logging                                                │
│    - External communications                                │
│    - Return observables ($)                                 │
│    - CAN dispatch new events (e.g., success/failure)       │
└─────────────────────────────────────────────────────────────┘
```

**Decision Tree:**
```
Need to update state in response to an event?
│
├─ State update ONLY (no API, no logging)
│  → Use withReducer with on()
│  → Example: on(userSelected, ({ payload }) => ({ selectedUser: payload }))
│
└─ Need side effects (API, logging, etc.)
   → Use withEventHandlers with events.on()
   → Example: events.on(pageOpened).pipe(switchMap(() => api.getData()))
```

**Examples:**

❌ **WRONG - Using withEventHandlers for state transitions:**
```typescript
withEventHandlers((store, events = inject(Events)) => ({
  onUserSelected$: events.on(userSelected).pipe(
    tap(({ payload }) => {
      patchState(store, { selectedUser: payload }); // ❌ DON'T DO THIS
    })
  ),
}))
```

✅ **CORRECT - Using withReducer for state transitions:**
```typescript
withReducer(
  on(userSelected, ({ payload }) => ({
    selectedUser: payload, // ✅ Pure state update
  }))
)
```

❌ **WRONG - Using withReducer for API calls:**
```typescript
withReducer(
  on(pageOpened, () => {
    api.getData(); // ❌ Side effect in reducer!
    return { isLoading: true };
  })
)
```

✅ **CORRECT - Using withEventHandlers for API calls:**
```typescript
withEventHandlers((store, events = inject(Events), api = inject(ApiService)) => ({
  loadData$: events.on(pageOpened).pipe(
    switchMap(() => api.getData().pipe( // ✅ Side effect in handler
      mapResponse({
        next: (data) => apiEvents.loadSuccess(data),
        error: (error) => apiEvents.loadFailure(error.message),
      })
    ))
  ),
}))

// Then handle the result in withReducer
withReducer(
  on(pageOpened, () => ({ isLoading: true })),
  on(apiEvents.loadSuccess, ({ payload }) => ({
    data: payload,
    isLoading: false,
  }))
)
```

#### General Rules

1. ✅ **ALWAYS** use `eventGroup` with `type<>()` for event definitions
2. ✅ **ALWAYS** use `withReducer` with `on()` for **state transitions** (pure functions)
3. ✅ **ALWAYS** use `withEventHandlers` with `events.on()` for **side effects** (API, logging)
4. ✅ **ALWAYS** import `Events` from `'@ngrx/signals/events'` when using withEventHandlers
5. ✅ **ALWAYS** inject `Events` in `withEventHandlers`: `events = inject(Events)`
6. ✅ **ALWAYS** return observables ending in `$` from event handlers
7. ✅ **ALWAYS** inject `Dispatcher` when dispatching events in methods/hooks
8. ✅ **ALWAYS** use `dispatcher.dispatch(event())` for manual dispatching
9. ✅ **ALWAYS** use `injectDispatch()` in components for cleaner syntax
10. ✅ In `withReducer`, access current state via second parameter: `on(event, ({ payload }, state) => ({ ... }))`
11. ❌ **NEVER** use `patchState` in `withEventHandlers` - use `withReducer` instead
12. ❌ **NEVER** perform side effects in `withReducer` - use `withEventHandlers` instead
13. ❌ **NEVER** call event creators directly without dispatching
14. ❌ **NEVER** skip the Events plugin - event-driven architecture is mandatory
13. ❌ **NEVER** skip the Events plugin - it's mandatory

### 1. Store Creation/Verification

Always follow this sequence when creating a store:

1. **Analyze the model** - Understand data structure, dependencies, and events
2. **Define types** - Create explicit TypeScript interfaces
3. **Create store folder** - Create `store/` directory inside feature folder
4. **Define events** - Use `eventGroup` with `type<>()` in `store/feature.events.ts`
5. **Create store** - Use `signalStore()` in `store/index.ts` with proper feature composition
6. **Integrate** - Provide and inject in components

### 2. Folder Structure (MANDATORY)

**Every feature MUST follow this structure:**

```
feature/
├── models/                       # Domain models only (entities, DTOs)
│   └── feature.model.ts
├── services/                     # API/Business services
│   └── feature.service.ts
├── store/                        # ⭐ State management (REQUIRED)
│   ├── index.ts                  # State interface + initial state + signal store
│   └── feature.events.ts         # Event groups
├── feature.component.ts
└── feature.component.html
```

**Key Rules:**
- ✅ State interface lives in `store/index.ts` (NOT in models/)
- ✅ Events live in `store/feature.events.ts` (separate file)
- ✅ Store is exported from `store/index.ts`
- ✅ Import as: `import { FeatureStore } from './store';`

### 3. Event Management with eventGroup

**CRITICAL: Always use `type<>()` syntax, NEVER use `payload<>()` or `emptyProps()`**

```typescript
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const featureEvents = eventGroup({
  source: 'Feature Name',
  events: {
    // Event without payload
    opened: type<void>(),
    
    // Events with payloads
    itemSelected: type<number>(),
    queryChanged: type<string>(),
    dataLoaded: type<DataType[]>(),
  },
});
```

### 4. Computed Signals with withComputed

Use `withComputed` for **read-only derived values** that don't need to be updated via `patchState`:

```typescript
import { computed } from '@angular/core';
import { withComputed } from '@ngrx/signals';

withComputed(({ items, filter }) => ({
  // Simple computed
  itemsCount: computed(() => items().length),
  
  // Computed with dependencies
  filteredItems: computed(() => {
    const query = filter.query().toLowerCase();
    return items().filter(item => 
      item.name.toLowerCase().includes(query)
    );
  }),
  
  // Can return functions (auto-wrapped in computed)
  hasItems: () => items().length > 0,
}))
```

### 5. Signal Dependencies with withLinkedState

**CRITICAL: Use `withLinkedState` when a signal depends on another signal AND needs to be updatable by dispatching events**

#### Decision Tree: withComputed vs withLinkedState

```
Does the value need to be UPDATED by dispatching events?
│
├─ YES → Use withLinkedState
│   │
│   └─ Does it need previous value or complex logic?
│       │
│       ├─ YES → Use explicit linking with linkedSignal()
│       └─ NO  → Use implicit linking with computation function
│
└─ NO → Use withComputed
```

#### Implicit Linking (Simple Derivation)

Use when the linked state is a simple derivation:

```typescript
import { withLinkedState } from '@ngrx/signals';

withLinkedState(({ options, items }) => ({
  // Automatically updates when 'options' changes
  selectedOption: () => options()[0] ?? undefined,
  
  // Depends on multiple signals
  selectedItem: () => {
    const selectedId = options()[0];
    return items().find(item => item.id === selectedId);
  },
}))

// Later you can update it by dispatching an event:
// dispatcher.dispatch(featureEvents.optionChanged(newValue))
```

#### Explicit Linking (Complex Computation with Previous Value)

Use when you need to preserve previous state or complex logic:

```typescript
import { linkedSignal } from '@angular/core';
import { withLinkedState } from '@ngrx/signals';

withLinkedState(({ options }) => ({
  selectedOption: linkedSignal<Option[], Option>({
    source: options,
    computation: (newOptions, previous) => {
      // Preserve selection if the option still exists
      const option = newOptions.find(
        (o) => o.id === previous?.value.id
      );
      // Otherwise, select the first one
      return option ?? newOptions[0];
    },
  }),
}))
```

## Complete Store Structure

### Step-by-Step Process

#### 1. Define Domain Models (if needed)

```typescript
// models/feature.model.ts
export interface Item {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}
```

#### 2. Define Events

```typescript
// store/feature.events.ts
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Item } from '../models/feature.model';

export const featureEvents = eventGroup({
  source: 'Feature',
  events: {
    pageOpened: type<void>(),
    queryChanged: type<string>(),
    statusChanged: type<'all' | 'active' | 'inactive'>(),
    itemSelected: type<number>(),
  },
});

export const featureApiEvents = eventGroup({
  source: 'Feature API',
  events: {
    loadSuccess: type<Item[]>(),
    loadFailure: type<string>(),
  },
});
```

#### 3. Create Store in store/index.ts

```typescript
// store/index.ts
import { computed, inject } from '@angular/core';
import { linkedSignal } from '@angular/core';
import {
  signalStore,
  withState,
  withLinkedState,
  withComputed,
  withMethods,
  withHooks,
} from '@ngrx/signals';
import {
  Events,
  Dispatcher,
  on,
  withReducer,
  withEventHandlers,
} from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { switchMap, tap } from 'rxjs';
import { Item } from '../models/feature.model';
import { FeatureService } from '../services/feature.service';
import { featureEvents, featureApiEvents } from './feature.events';

// State interface
export type FeatureState = {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  filter: {
    query: string;
    status: 'all' | 'active' | 'inactive';
  };
};

// Initial state
const initialState: FeatureState = {
  items: [],
  isLoading: false,
  error: null,
  filter: { query: '', status: 'all' },
};

// Signal Store
export const FeatureStore = signalStore(
  // 1. Base state
  withState(initialState),
  
  // 2. Linked state (depends on base state, updatable)
  withLinkedState(({ items }) => ({
    // Implicit linking - simple derivation
    selectedItem: () => items()[0] ?? null,
  })),
  
  // 3. Computed (read-only derived values)
  withComputed(({ items, filter, selectedItem }) => ({
    itemsCount: computed(() => items().length),
    
    filteredItems: computed(() => {
      const query = filter.query().toLowerCase();
      const status = filter.status();
      
      return items().filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(query);
        const matchesStatus = status === 'all' || item.status === status;
        return matchesQuery && matchesStatus;
      });
    }),
    
    hasSelection: computed(() => selectedItem() !== null),
  })),
  
  // 4. State transitions (reducers)
  withReducer(
    on(featureEvents.queryChanged, ({ payload: query }) => ({
      filter: { query, status: 'all' },
    })),
    
    on(featureEvents.statusChanged, ({ payload: status }) => ({
      filter: (state) => ({ ...state.filter, status }),
    })),
    
    on(featureEvents.pageOpened, () => ({ isLoading: true })),
    
    on(featureApiEvents.loadSuccess, ({ payload: items }) => ({
      items,
      isLoading: false,
      error: null,
    })),
    
    on(featureApiEvents.loadFailure, ({ payload: error }) => ({
      isLoading: false,
      error,
    }))
  ),
  
  // 5. Side effects (event handlers)
  withEventHandlers(
    (store, events = inject(Events), service = inject(FeatureService)) => ({
      loadItems$: events
        .on(featureEvents.pageOpened, featureEvents.queryChanged)
        .pipe(
          switchMap(() =>
            service.getItems(store.filter.query()).pipe(
              mapResponse({
                next: (items) => featureApiEvents.loadSuccess(items),
                error: (error: { message: string }) =>
                  featureApiEvents.loadFailure(error.message),
              })
            )
          )
        ),
      
      logError$: events
        .on(featureApiEvents.loadFailure)
        .pipe(tap(({ payload }) => console.error(payload))),
    })
  ),
  
  // 6. Methods (optional, for dispatching events imperatively)
  withMethods((store, dispatcher = inject(Dispatcher)) => ({
    selectItemById(id: number): void {
      // Dispatch event instead of using patchState directly
      dispatcher.dispatch(featureEvents.itemSelected(id));
    },
  })),
  
  // 7. Lifecycle hooks
  withHooks({
    onInit(store, dispatcher = inject(Dispatcher)) {
      console.log('Store initialized');
      dispatcher.dispatch(featureEvents.pageOpened());
    },
    onDestroy(store) {
      console.log('Store destroyed', store.itemsCount());
    },
  })
);
```

#### 4. Component Integration

```typescript
// feature.component.ts
import { Component, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { FeatureStore } from './store'; // Import from store folder
import { featureEvents } from './store/feature.events';

@Component({
  selector: 'app-feature',
  template: `
    <h1>Items ({{ store.itemsCount() }})</h1>
    
    <input 
      type="text" 
      [value]="store.filter.query()"
      (input)="dispatch.queryChanged($any($event.target).value)"
    />
    
    <select 
      [value]="store.filter.status()"
      (change)="dispatch.statusChanged($any($event.target).value)"
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    
    @if (store.isLoading()) {
      <p>Loading...</p>
    }
    
    @if (store.error()) {
      <p class="error">{{ store.error() }}</p>
    }
    
    @for (item of store.filteredItems(); track item.id) {
      <div 
        class="item" 
        [class.selected]="store.selectedItem()?.id === item.id"
        (click)="dispatch.itemSelected(item.id)"
      >
        {{ item.name }} - {{ item.status }}
      </div>
    }
  `,
  providers: [FeatureStore],
})
export class FeatureComponent {
  readonly store = inject(FeatureStore);
  readonly dispatch = injectDispatch(featureEvents);
}
```

## File Structure

**CRITICAL: Always organize stores in a dedicated `store/` folder per feature**

```
feature/
├── models/
│   └── feature.model.ts          # Domain models (entities, DTOs)
├── services/
│   └── feature.service.ts        # API services
├── store/
│   ├── index.ts                  # State interface, initial state, signal store (exported)
│   └── feature.events.ts         # Event groups
└── feature.component.ts          # Component using store
```

### Store Organization Rules

1. ✅ **ALWAYS** create a `store/` folder inside the feature folder
2. ✅ **ALWAYS** export the store from `store/index.ts`
3. ✅ **State interface** goes in `store/index.ts` (not in models/)
4. ✅ **Events** go in `store/feature.events.ts` (dedicated file)
5. ✅ **Domain models** (entities, DTOs) go in `models/` folder
6. ✅ Import the store as: `import { FeatureStore } from './store';`

## Critical Rules

### File Organization
1. ✅ **ALWAYS** create a `store/` folder inside the feature folder
2. ✅ **ALWAYS** put state interface, initial state, and signal store in `store/index.ts`
3. ✅ **ALWAYS** put events in `store/feature.events.ts` (separate file)
4. ✅ **ALWAYS** export the store from `store/index.ts` for clean imports
5. ✅ Import store as: `import { FeatureStore } from './store';`
6. ✅ Import events as: `import { featureEvents } from './store/feature.events';`
7. ❌ **NEVER** put state types in the `models/` folder (only domain models go there)

### Event Definitions
1. ✅ **ALWAYS** use `type<>()` for defining event payloads
2. ✅ Use `type<void>()` for events without payload
3. ❌ **NEVER** use `payload<>()`, `emptyPayload()`, `props()`, or `emptyProps()`
4. ✅ Group related events with `eventGroup`
5. ✅ Use descriptive event names: `queryChanged`, not `change`

### Linked State vs Computed
1. ✅ Use `withLinkedState` when the value needs to be updatable by dispatching events
2. ✅ Use `withComputed` for read-only derived values
3. ✅ Use implicit linking for simple derivations
4. ✅ Use explicit linking (`linkedSignal`) when you need:
   - Access to previous value
   - Complex computation logic
   - Multi-source dependencies with custom logic

### Store Composition Order
The order matters! Always follow this sequence:
```typescript
signalStore(
  withState(/* ... */),         // 1. Base state
  withLinkedState(/* ... */),   // 2. Linked state (depends on base)
  withComputed(/* ... */),      // 3. Computed (read-only derived)
  withReducer(/* ... */),       // 4. State transitions
  withEventHandlers(/* ... */), // 5. Side effects
  withMethods(/* ... */),       // 6. Imperative methods (optional)
  withHooks(/* ... */)          // 7. Lifecycle hooks
)
```

### Event Dispatching
1. ✅ Prefer `injectDispatch()` over manual `Dispatcher` injection
2. ✅ Use events for most state changes (declarative)
3. ✅ Use methods only when imperative control is needed
4. ✅ Dispatch events from components, not stores

### Type Safety
1. ✅ Always define explicit types for state
2. ✅ Always define explicit types for event payloads
3. ✅ Use TypeScript strict mode
4. ✅ Avoid `any` - use proper types

## Verification Checklist

Before completing store creation/modification:

**File Structure:**
- [ ] `store/` folder exists inside feature folder
- [ ] `store/index.ts` contains state interface, initial state, and signal store
- [ ] `store/feature.events.ts` contains all event definitions
- [ ] Store is exported from `store/index.ts`
- [ ] Component imports from `./store` (not a specific file)

**Type Safety:**
- [ ] All state properties have explicit types
- [ ] All events use `type<>()` syntax
- [ ] No `any` types used

**Store Composition:**
- [ ] Dependencies between signals use `withLinkedState`
- [ ] Read-only derived values use `withComputed`
- [ ] Event handlers perform side effects correctly

**Integration:**
- [ ] Store is provided at component level
- [ ] Events are dispatched using `injectDispatch()`

**Code Quality:**
- [ ] Code builds without errors
- [ ] No unused imports or variables

## Common Patterns

### Pattern 1: List with Selection

```typescript
withState({ items: [], selectedId: null as number | null }),
withLinkedState(({ items, selectedId }) => ({
  selectedItem: () => {
    const id = selectedId();
    return id ? items().find(i => i.id === id) ?? null : null;
  },
}))
```

### Pattern 2: Filtered and Sorted List

```typescript
withComputed(({ items, filter }) => ({
  filteredAndSorted: computed(() => {
    const filtered = items().filter(/* filter logic */);
    return filtered.sort(/* sort logic */);
  }),
}))
```

### Pattern 3: Loading State Management

```typescript
withReducer(
  on(dataEvents.loadStarted, () => ({ isLoading: true, error: null })),
  on(dataEvents.loadSuccess, ({ payload }) => ({
    data: payload,
    isLoading: false,
    error: null,
  })),
  on(dataEvents.loadFailure, ({ payload }) => ({
    isLoading: false,
    error: payload,
  }))
)
```

## References

- NgRx Signals Documentation: https://ngrx.io/guide/signals
- Signal Store: https://ngrx.io/guide/signals/signal-store
- Events Plugin: https://ngrx.io/guide/signals/signal-store/events
- Linked State: https://ngrx.io/guide/signals/signal-store/linked-state
