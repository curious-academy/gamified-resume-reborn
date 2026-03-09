---
name: ng-signal-store
description: Create an NgRx Signal Store for a feature following the project's event-driven architecture. Use when a feature needs state management, when state should be shared across components, or when HTTP side effects need to be managed reactively. Creates store, events, and wires the business service as proxy.
---

# NgRx Signal Store Generator

You are a state management expert for this Angular 21 project using `@ngrx/signals` v21. Your role is to create a complete NgRx Signal Store for a feature following the project's event-driven Flux architecture.

## Package Imports Reference

```typescript
// Store core
import { signalStore, withState, withComputed, withHooks, patchState, type } from '@ngrx/signals';

// Events plugin — ALWAYS from '@ngrx/signals/events'
import {
  eventGroup,
  withReducer,
  withEventHandlers,
  on,
  Events,
  injectDispatch,
} from '@ngrx/signals/events';

// Standard Angular + RxJS
import { inject, computed } from '@angular/core';
import { catchError, exhaustMap, switchMap, map } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
```

## Architecture Pattern

```
Component
  ↓ (injects)
Business Service   ← proxy layer
  ├── dispatches events  →  Store  (withReducer → state updates)
  ├── reads signals      ←  Store  (withEventHandlers → HTTP calls)
  └── pure logic methods (no HTTP, testable)

Store withEventHandlers
  → injects Infra Services (HttpClient)
  → dispatches API events back
```

## File Structure

For each feature, create:

```
features/<feature>/
  store/
    <feature>.events.ts     # Event groups (commands + API events)
    <feature>.store.ts      # SignalStore with state, computed, reducer, eventHandlers
  utils/
    <feature>.utils.ts      # Pure functions shared between store and business (optional)
  services/
    <feature>.business.ts   # Proxy: dispatches + store signals + pure logic
    <feature>.infra.ts      # HTTP calls (called from withEventHandlers in store)
```

## Mandatory Rules

1. **Store location**: `features/<feature>/store/<feature>.store.ts`
2. **Events location**: `features/<feature>/store/<feature>.events.ts`
3. **Two event groups**: one for commands (`<feature>Events`), one for API results (`<feature>ApiEvents`)
4. **Business service** = proxy only: dispatches events + exposes store signals + pure utility methods
5. **HTTP calls** go ONLY in `withEventHandlers` in the store (never in business service)
6. **All computed values** that derive from state go in `withComputed` in the store
7. **Linked signals** in components/pages for UI-only state that resets based on store signals
8. **Store is `providedIn: 'root'`** unless explicitly scoped

## Step 1: Create Events File

```typescript
// features/<feature>/store/<feature>.events.ts
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { MyData } from '../models/my-data.model';

// Command events (what components/services request)
export const featureEvents = eventGroup({
  source: 'Feature',
  events: {
    loadData: type<void>(),
    loadDataById: type<{ id: string }>(),
    // Add more commands as needed
  },
});

// API events (what the backend returns)
export const featureApiEvents = eventGroup({
  source: 'FeatureApi',
  events: {
    dataLoaded: type<{ items: MyData[] }>(),
    dataLoadFailed: type<{ error: string }>(),
    itemLoaded: type<{ item: MyData }>(),
    itemLoadFailed: type<{ error: string }>(),
  },
});
```

## Step 2: Create Store File

```typescript
// features/<feature>/store/<feature>.store.ts
import { inject, computed } from '@angular/core';
import { signalStore, withState, withComputed, withHooks, type } from '@ngrx/signals';
import { withReducer, withEventHandlers, on, Events, injectDispatch } from '@ngrx/signals/events';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MyData } from '../models/my-data.model';
import { FeatureInfra } from '../services/feature.infra';
import { featureEvents, featureApiEvents } from './feature.events';

interface FeatureState {
  items: MyData[];
  selectedItem: MyData | null;
  isLoading: boolean;
  error: string | null;
}

export const FeatureStore = signalStore(
  { providedIn: 'root' },
  withState<FeatureState>({
    items: [],
    selectedItem: null,
    isLoading: false,
    error: null,
  }),
  withComputed(({ items, selectedItem, isLoading, error }) => ({
    // All derived values belong here — NEVER in the component
    hasItems: computed(() => items().length > 0),
    itemCount: computed(() => items().length),
    hasError: computed(() => error() !== null),
    isReady: computed(() => !isLoading() && !error()),
  })),
  withReducer(
    on(featureEvents.loadData, () => ({ isLoading: true, error: null })),
    on(featureApiEvents.dataLoaded, ({ payload }) => ({
      items: payload.items,
      isLoading: false,
    })),
    on(featureApiEvents.dataLoadFailed, ({ payload }) => ({
      error: payload.error,
      isLoading: false,
    })),
  ),
  withEventHandlers(
    // Use default params to inject dependencies within the injection context
    (_, events = inject(Events), infra = inject(FeatureInfra)) => ({
      loadData$: events.on(featureEvents.loadData).pipe(
        exhaustMap(() =>
          infra.getAll().pipe(
            map((items) => featureApiEvents.dataLoaded({ items })),
            catchError((err: Error) =>
              of(featureApiEvents.dataLoadFailed({ error: err.message })),
            ),
          ),
        ),
      ),
    }),
  ),
  // Optional: auto-load on store init
  withHooks({
    onInit(store) {
      const dispatch = injectDispatch(featureEvents);
      dispatch.loadData();
    },
  }),
);
```

## Step 3: Refactor Business Service as Proxy

```typescript
// features/<feature>/services/feature.business.ts
import { Injectable, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { FeatureStore } from '../store/feature.store';
import { featureEvents } from '../store/feature.events';
import { MyData } from '../models/my-data.model';

@Injectable({ providedIn: 'root' })
export class FeatureBusiness {
  private readonly store = inject(FeatureStore);
  private readonly dispatch = injectDispatch(featureEvents);

  // ── Expose store signals (read-only for components) ──────────────────────
  readonly items = this.store.items;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly hasItems = this.store.hasItems;

  // ── Commands (dispatch events to store) ───────────────────────────────────
  loadData(): void {
    this.dispatch.loadData();
  }

  // ── Pure business logic (no HTTP, no side effects, fully testable) ────────
  filterActiveItems(items: MyData[]): MyData[] {
    return items.filter((item) => item.isActive);
  }

  calculateSomething(value: number): number {
    return value * 2;
  }
}
```

## Step 4: Update Component to Use Business Service

```typescript
// features/<feature>/pages/<feature>.page.ts
import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { FeatureBusiness } from '../services/feature.business';

@Component({
  selector: 'app-feature-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class FeaturePage {
  private readonly featureBusiness = inject(FeatureBusiness);

  // Read signals directly from business service (no toSignal needed!)
  readonly items = this.featureBusiness.items;
  readonly isLoading = this.featureBusiness.isLoading;
  readonly error = this.featureBusiness.error;

  // UI-only state: use linkedSignal when it should reset based on store data
  // Example: reset selected item when data reloads
  readonly selectedItem = linkedSignal({
    source: this.featureBusiness.items,
    computation: () => null as MyData | null,
  });

  // Simple UI state: use signal()
  readonly isModalOpen = signal(false);

  onSelectItem(item: MyData): void {
    this.selectedItem.set(item);
  }

  onRetry(): void {
    this.featureBusiness.loadData();
  }
}
```

## Linked Signals — When to Use

Use `linkedSignal` in components/pages when:
- UI state should **automatically reset** when store data changes
- Managing form values that derive from but can override store values
- Tracking temporary state tied to the lifecycle of another signal

```typescript
// Reset hovered item when list changes
readonly hoveredItem = linkedSignal({
  source: this.featureBusiness.items,
  computation: () => null as MyData | null,
});

// Form value pre-filled from store but editable
readonly editedName = linkedSignal({
  source: this.featureBusiness.selectedItem,
  computation: (item) => item()?.name ?? '',
});
```

## withEventHandlers — HTTP Pattern with Multiple Services

```typescript
withEventHandlers(
  (
    _,
    events = inject(Events),
    service1 = inject(Service1Infra),
    service2 = inject(Service2Infra),
  ) => ({
    loadCombinedData$: events.on(featureEvents.loadData).pipe(
      exhaustMap(() =>
        combineLatest([service1.getAll(), service2.getAll()]).pipe(
          map(([data1, data2]) => featureApiEvents.dataLoaded({ data1, data2 })),
          catchError((err: Error) =>
            of(featureApiEvents.dataLoadFailed({ error: err.message })),
          ),
        ),
      ),
    ),

    loadById$: events.on(featureEvents.loadDataById).pipe(
      switchMap(({ payload }) =>
        service1.getById(payload.id).pipe(
          map((item) => featureApiEvents.itemLoaded({ item })),
          catchError((err: Error) =>
            of(featureApiEvents.itemLoadFailed({ error: err.message })),
          ),
        ),
      ),
    ),
  }),
)
```

## Unit Testing the Store

```typescript
// features/<feature>/store/<feature>.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { injectDispatch } from '@ngrx/signals/events';
import { FeatureStore } from './feature.store';
import { featureEvents } from './feature.events';

describe('FeatureStore', () => {
  let store: InstanceType<typeof FeatureStore>;
  let httpMock: HttpTestingController;
  let dispatch: ReturnType<typeof injectDispatch<typeof featureEvents>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FeatureStore,
      ],
    });

    store = TestBed.inject(FeatureStore);
    httpMock = TestBed.inject(HttpTestingController);
    dispatch = TestBed.runInInjectionContext(() => injectDispatch(featureEvents));
  });

  afterEach(() => httpMock.verify());

  it('should load data when loadData event is dispatched', () => {
    // Initial state
    expect(store.isLoading()).toBe(false);

    // Dispatch command
    TestBed.runInInjectionContext(() => dispatch.loadData());

    // State transitions to loading
    expect(store.isLoading()).toBe(true);

    // Mock HTTP response
    const req = httpMock.expectOne('/api/items');
    req.flush([{ id: '1', name: 'Item 1' }]);

    // State updates with data
    expect(store.items().length).toBe(1);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });
});
```

## Unit Testing the Business Service (Pure Logic)

```typescript
// Test only pure logic methods — HTTP is tested in store spec
describe('FeatureBusiness', () => {
  let service: FeatureBusiness;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FeatureStore,
        FeatureBusiness,
      ],
    });
    service = TestBed.inject(FeatureBusiness);
  });

  it('should filter active items', () => {
    const items = [
      { id: '1', isActive: true },
      { id: '2', isActive: false },
    ];
    expect(service.filterActiveItems(items).length).toBe(1);
  });
});
```

## Workflow

### Step 1: Check if store is needed

Ask yourself:
- Is state shared between multiple components? → Yes → Use store
- Does the feature make HTTP calls? → Yes → Use store with `withEventHandlers`
- Is state local to a single component with no HTTP? → No → Use simple `signal()`

### Step 2: Generate or identify existing services

```bash
# Business service (proxy after refactoring)
cd /root/curious-labs/apps/web/front-end && ng g s features/<feature>/services/<use-case>.business

# Infrastructure service (HTTP only)
cd /root/curious-labs/apps/web/front-end && ng g s features/<feature>/services/<use-case>.infra
```

### Step 3: Create store files manually (not via ng g)

Store files are plain TypeScript classes, not Angular injectable services generated by CLI.
Create them with the Write tool in the correct location.

### Step 4: Verify build

```bash
cd /root/curious-labs/apps/web/front-end && npx ng build --project main-app 2>&1 | tail -20
```

### Step 5: Run tests — ALL must pass

```bash
cd /root/curious-labs/apps/web/front-end && npm test
```

**CRITICAL — ZERO TOLERANCE RULE:**
- ✅ **ALL tests in the project must pass** — 0 failures, no exceptions
- ❌ **NEVER accept partial success** — "only 2 pre-existing failures" is NOT acceptable
- ❌ **NEVER create a PR with failing tests** — fix everything first
- ✅ **Fix any test that fails**, including tests unrelated to your feature (they are regressions)

If any test fails:
1. Read the failure output carefully
2. Fix the root cause (do NOT comment out or delete the test)
3. Run the full suite again until the output shows `X passed (X)` with **no failures**

### Step 6: Auto-commit

```bash
git add -A && git commit -m "feat(<feature>): add NgRx Signal Store with event-driven architecture

- Create <feature>.events.ts with command and API event groups
- Create <feature>.store.ts with state, computed, reducer, eventHandlers
- Refactor <feature>.business.ts as proxy for store signals and dispatch
- Move HTTP side effects to withEventHandlers in store
- Update unit tests for new store-based architecture

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

## Testing Pitfalls — Must Avoid

### Pitfall 1: `withHooks.onInit` auto-loading (AVOID)

**Problem:** Using `withHooks.onInit` to auto-dispatch a load event starts HTTP calls the moment the store is injected. In tests, this creates requests that may be left open after each test, causing `httpMock.verify()` failures and cascading `"Cannot configure the test module"` errors.

**❌ Anti-pattern (avoid):**
```typescript
withHooks({
  onInit(store) {
    const dispatch = injectDispatch(featureEvents);
    dispatch.loadData(); // ← auto-fires HTTP on injection; breaks tests
  },
}),
```

**✅ Correct pattern — explicit loading from component `ngOnInit`:**
```typescript
// Store: NO withHooks
export const FeatureStore = signalStore(
  { providedIn: 'root' },
  withState(...),
  withComputed(...),
  withReducer(...),
  withEventHandlers(...),
  // No withHooks!
);

// Component: explicit trigger
@Component({ ... })
export class FeaturePage implements OnInit {
  private readonly business = inject(FeatureBusiness);

  ngOnInit(): void {
    this.business.loadData(); // explicit, predictable, testable
  }
}
```

### Pitfall 2: `combineLatest` leaves orphaned HTTP requests in tests (AVOID)

**Problem:** With `combineLatest([req1$, req2$])`, if `req1$` errors, combineLatest propagates the error and unsubscribes from `req2$` — but Angular's `HttpTestingController` still tracks `req2$` as an open request. `afterEach(() => httpMock.verify())` then throws, breaking all subsequent tests.

**❌ Anti-pattern:**
```typescript
exhaustMap(() =>
  combineLatest([service1.getAll(), service2.getAll()]).pipe( // ← if s1 errors, s2 is orphaned
    map(([d1, d2]) => featureApiEvents.dataLoaded({ d1, d2 })),
    catchError(...),
  ),
),
```

**✅ Correct pattern — sequential `switchMap`:**
```typescript
exhaustMap(() =>
  service1.getAll().pipe(
    switchMap((d1) =>
      service2.getAll().pipe(
        map((d2) => featureApiEvents.dataLoaded({ d1, d2 })),
      ),
    ),
    catchError((err: Error) =>
      of(featureApiEvents.dataLoadFailed({ error: err.message })),
    ),
  ),
),
```
With sequential calls: if `service1` fails, `service2` is never called → no orphaned requests → tests stay clean.

### Pitfall 3: Component required inputs in tests

**Problem:** Angular 17+ required inputs (`input.required<T>()`) throw `NG0950` if not set before change detection runs.

**✅ Always set required inputs before `fixture.whenStable()` or `fixture.detectChanges()`:**
```typescript
fixture = TestBed.createComponent(MyComponent);
fixture.componentRef.setInput('requiredProp', mockValue()); // ← before detectChanges!
await fixture.whenStable();
```

## Common Errors

### Error: inject() called outside injection context
**Cause**: Calling `injectDispatch()` outside of a class constructor or factory function.
**Fix**: Always call `injectDispatch()` in the class field initializer or constructor.

### Error: NullInjectorError: No provider for Dispatcher
**Cause**: Store not initialized before dispatching.
**Fix**: Ensure the store is provided (either `providedIn: 'root'` or in the component's providers).

### Error: Circular dependency
**Cause**: Business service injects Store, Store's withEventHandlers injects Business service.
**Fix**: Extract shared pure logic to a utils file. Store only injects Infra services.

### TypeScript: `withReducer` type mismatch
**Cause**: State type doesn't match what reducer returns.
**Fix**: Ensure `withReducer` is called after `withState<MyState>()` and reducers return `Partial<MyState>`.
