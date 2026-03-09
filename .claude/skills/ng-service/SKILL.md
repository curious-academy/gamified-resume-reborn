---
name: ng-service
description: Generate Angular services for data access and state management. Use when a component needs to access API data or manage feature state. Always creates two services (business + infra).
---

# Angular Service Generator

You are a service generator for this Angular project following hexagonal architecture principles. Your role is to create Angular services using the Angular CLI while strictly following the project's architectural patterns.

## MANDATORY RULES

1. **ALWAYS use `ng g s`** (Angular CLI) to generate services - NEVER create service files manually
2. **ALWAYS create TWO services** for each use case:
   - **Business service** (`.business.ts`) - Contains business logic, will be tested
   - **Infrastructure service** (`.infra.ts`) - Handles API calls, no tests needed
3. **ALWAYS ask for the feature name** if not explicitly provided
4. **ALWAYS ask for the use case name** if not clear from context

## Architecture Pattern

### Hexagonal Architecture (Ports & Adapters)

```
Component
    ↓
Business Service (.business.ts)
    ↓ (uses port/interface)
Infrastructure Service (.infra.ts)
    ↓
API
```

- **Business Service**: Core logic, testable, isolated from infrastructure
- **Infrastructure Service**: Adapter that connects to external systems (API, storage)

## Service Naming Convention

Services are ALWAYS created in pairs:

```bash
# Business service (with tests)
ng g s features/<feature>/services/<use-case>.business

# Infrastructure service (no tests)
ng g s features/<feature>/services/<use-case>.infra
```

**Examples:**
- `features/auth/services/login.business.ts` + `login.infra.ts`
- `features/user/services/profile.business.ts` + `profile.infra.ts`
- `features/cart/services/checkout.business.ts` + `checkout.infra.ts`

## Workflow

### Step 1: Gather Information

If the user's request is missing any of these, you MUST ASK before proceeding:

1. **Feature name** - Which feature does this belong to?
2. **Use case name** - What is the specific use case? (e.g., login, profile, checkout)
3. **Purpose** - Is this for:
   - API data access
   - State management
   - Both

### Step 2: Generate Both Services

Run the Angular CLI commands from the `apps/web/front-end` directory.

**ALWAYS generate in this order:**

```bash
# 1. Generate business service first
cd /root/curious-labs/apps/web/front-end && ng g s features/<feature>/services/<use-case>.business

# 2. Generate infrastructure service second
cd /root/curious-labs/apps/web/front-end && ng g s features/<feature>/services/<use-case>.infra
```

### Step 3: Verify Build

**MANDATORY:** After generating both services, you MUST verify that the project builds correctly:

```bash
cd /root/curious-labs/apps/web/front-end && npm run build
```

**If the build fails:**
1. Analyze the error messages carefully
2. Fix the issues (common problems: incorrect imports, naming conflicts, TypeScript errors)
3. Run the build again
4. Repeat until the build succeeds

**Common errors to fix:**
- Missing imports or exports
- TypeScript compilation errors
- Circular dependencies between services
- Incorrect dependency injection

**DO NOT proceed to Step 4 until the build succeeds.**

### Step 4: Auto-Commit

**MANDATORY:** After the build succeeds, automatically commit the changes:

```bash
git add . && git commit -m "$(cat <<'EOF'
feat(<feature>): add <use-case> services

Generated business and infrastructure services:
- <use-case>.business.ts - business logic (with tests)
- <use-case>.infra.ts - API calls (no tests)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**Commit message format:**
- Use the feature name in the scope
- Mention both services in the message

**DO NOT ask the user for permission to commit - this is automatic.**

### Step 5: Explain the Pattern

After the commit succeeds, briefly explain to the user:
- The business service contains the logic and will be tested
- The infra service handles API calls and has no tests
- The business service depends on the infra service via dependency injection
- The build is successful and the services are ready to use
- Changes have been committed automatically

### Step 6: Next Steps

Remind the user:
- Implement the business logic in the `.business.ts` file
- Implement API calls in the `.infra.ts` file
- Write tests for the business service

## Example Interactions

### Example 1: Complete request
**User:** "I need a login service for the auth feature"

**You:** *Proceeds to run:*
```bash
cd /root/curious-labs/apps/web/front-end && ng g s features/auth/services/login.business
cd /root/curious-labs/apps/web/front-end && ng g s features/auth/services/login.infra
```

Then explains:
"I've created two services for login:
- `login.business.ts` - Put your authentication logic here (will be tested)
- `login.infra.ts` - Put your API calls here (no tests needed)

The business service can inject the infra service to access the API."

### Example 2: Missing feature name
**User:** "Create a profile service"

**You:** "I'll create the profile service. Which feature does this belong to? For example: `user`, `account`, `settings`?"

### Example 3: Missing use case
**User:** "I need services for the shopping cart"

**You:** "I'll create services for the shopping cart feature. What specific use case? For example: `cart-management`, `checkout`, `add-to-cart`?"

### Example 4: State management
**User:** "I need to manage the state of the current user"

**You:** "I'll create services for user state management. Should this be:
- In an existing feature (e.g., `user`, `auth`)? If so, which one?
- Or a new feature?

Also, what should I call the use case? For example: `current-user`, `user-session`, `user-state`?"

## Important Notes

- Services are injectable with `providedIn: 'root'` by default (Angular 21)
- The CLI creates: `service.ts` and `service.spec.ts` (delete `.spec.ts` for infra services)
- Business services should inject infrastructure services, not the other way around
- Always run commands from the `apps/web/front-end` directory

## File Organization

Services should be organized by feature and use case:

```
projects/main-app/src/app/features/
└── <feature>/
    └── services/
        ├── <use-case>.business.ts
        ├── <use-case>.business.spec.ts  (tests)
        └── <use-case>.infra.ts          (no tests)
```

**Example:**
```
projects/main-app/src/app/features/
├── auth/
│   └── services/
│       ├── login.business.ts
│       ├── login.business.spec.ts
│       └── login.infra.ts
└── user/
    └── services/
        ├── profile.business.ts
        ├── profile.business.spec.ts
        └── profile.infra.ts
```
