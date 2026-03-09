---
name: typescript
description: Enforce TypeScript strict typing standards for this project. Use when writing or reviewing TypeScript code, when any type issues arise, or when adding new interfaces/types. This skill is MANDATORY and applies to every TypeScript file in the project.
---

# TypeScript Strict Typing — Project Standards

You are a TypeScript expert enforcing strict type safety across this Angular project.
These rules are **non-negotiable** and apply to every `.ts` file without exception.

---

## 🚨 RULE #1 — NEVER USE `any`. EVER.

```
❌ FORBIDDEN in this project — zero exceptions
```

`any` completely disables type checking. It defeats the purpose of TypeScript and
propagates unsafety silently across the codebase.

### What to use instead

| Instead of `any`         | Use this                                      |
|--------------------------|-----------------------------------------------|
| Unknown external data    | `unknown` (forces explicit type narrowing)    |
| Polymorphic object shape | Discriminated union (`type A | type B`)       |
| Generic container        | Generic `<T>` parameter                      |
| Flexible record          | `Record<string, unknown>`                     |
| JSON-like structure      | `JsonValue` or explicit nested interface      |
| Callback with any args   | Typed function signature or `(...args: unknown[]) => void` |
| Temporary hack           | **There is no temporary — type it properly**  |

### Discriminated unions — the right way to type polymorphism

When an object has different shapes based on a `type` / `kind` field,
**always** use a discriminated union — never `any` for the variable part:

```typescript
// ❌ WRONG
interface Activity {
  type: 'video' | 'quiz';
  content?: any; // ← kills type safety
}

// ✅ CORRECT
interface VideoContent { url: string; thumbnailUrl?: string; }
interface QuizContent { questions: QuizQuestion[]; }

type Activity =
  | { type: 'video'; content?: VideoContent }
  | { type: 'quiz';  content?: QuizContent  };

// TypeScript now narrows automatically:
function handleActivity(a: Activity) {
  if (a.type === 'video') {
    a.content?.url; // ✅ typed as VideoContent
  }
}
```

### `unknown` — for truly unknown external data

```typescript
// ❌ WRONG
function parseResponse(data: any) { ... }

// ✅ CORRECT
function parseResponse(data: unknown): MyModel {
  if (typeof data !== 'object' || data === null) throw new Error('Invalid');
  // narrow explicitly, then return typed result
}
```

---

## RULE #2 — Strict mode is non-negotiable

The project `tsconfig.json` has `"strict": true`. Never disable it.
This covers:
- `noImplicitAny` — no inferred `any` from missing annotations
- `strictNullChecks` — `null` and `undefined` are not assignable without explicit types
- `strictFunctionTypes` — function parameters checked contravariantly
- `strictPropertyInitialization` — class properties must be initialized

---

## RULE #3 — Angular-specific typing rules

### Signals — always typed explicitly

```typescript
// ❌ Inferred as Signal<any>
const data = signal(null);

// ✅ Explicit generic
const data = signal<MyModel | null>(null);
```

### `input()` and `input.required()` — always typed

```typescript
// ❌
readonly item = input.required();

// ✅
readonly item = input.required<CursusWithProgress>();
```

### HTTP responses — never cast to `any`

```typescript
// ❌
this.http.get<any>('/api/items')

// ✅
this.http.get<MyModel[]>('/api/items')
```

### `inject()` — always let TypeScript infer the type from the token

```typescript
// ❌
const service = inject(MyService) as any;

// ✅
const service = inject(MyService); // typed automatically
```

---

## RULE #4 — Type assertion (`as`) usage

Use `as` sparingly and only when TypeScript cannot narrow correctly.

```typescript
// ❌ Using `as any` as a shortcut
const result = response as any;

// ❌ Unnecessary assertion
const el = document.querySelector('.btn') as HTMLButtonElement; // ok only when you KNOW the type

// ✅ Prefer type guards
function isHTMLButton(el: Element | null): el is HTMLButtonElement {
  return el instanceof HTMLButtonElement;
}
```

Never use double assertion (`value as unknown as TargetType`) unless dealing with
third-party library boundaries where the type is provably wrong.

---

## RULE #5 — Interfaces vs Types

- Use `interface` for object shapes that represent **entities** (models, DTOs, API responses)
- Use `type` for **unions, intersections, and aliases** (discriminated unions, utility types)

```typescript
// ✅ Entity → interface
export interface Cursus {
  id: string;
  name: string;
}

// ✅ Union → type
export type Activity =
  | (BaseActivity & { type: 'video'; content?: VideoContent })
  | (BaseActivity & { type: 'quiz'; content?: QuizContent });

// ✅ Alias → type
export type CursusId = string;
```

---

## RULE #6 — No `@ts-ignore` / `@ts-expect-error` in production code

These suppress type errors silently. Fix the root cause instead.

```typescript
// ❌ FORBIDDEN
// @ts-ignore
someUntypedThing.doStuff();

// ✅ Fix the type
(someUntypedThing as ProperType).doStuff();
// or add a proper type guard
```

The only acceptable use of `@ts-expect-error` is in unit test files to test
deliberate type errors.

---

## RULE #7 — Return types on public service methods

All `public` and `protected` methods in services **must** have explicit return types.
Private methods are optional but encouraged.

```typescript
// ❌
calculateProgress(items: UserProgress[]) {
  return items.filter(...).length / items.length;
}

// ✅
calculateProgress(items: UserProgress[]): number {
  return items.filter(...).length / items.length;
}
```

---

## Checklist — before every commit

- [ ] Zero occurrences of `: any` in modified files
- [ ] Zero occurrences of `as any`
- [ ] No `@ts-ignore` added
- [ ] All new interfaces/types are exported from their model file
- [ ] Signal generics are explicit (`signal<T>`, `input<T>`, `computed<T>`)
- [ ] HTTP calls have typed response generics (`this.http.get<T>()`)
- [ ] Discriminated unions used for polymorphic shapes (not `any`)

---

## Quick verification command

Run this to check for `any` leaks before committing:

```bash
grep -rn ': any[;)\[\|, ]' apps/web/front-end/projects/main-app/src --include='*.ts'
grep -rn 'as any' apps/web/front-end/projects/main-app/src --include='*.ts'
grep -rn '@ts-ignore' apps/web/front-end/projects/main-app/src --include='*.ts'
```

All three commands must return **empty output**. If not, fix before committing.
