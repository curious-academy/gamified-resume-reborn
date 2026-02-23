---
name: e2e-test
description: Create comprehensive E2E tests with Cypress covering minimal (happy path), error, and edge cases. Automatically configures Cypress if not present.
---

# Cypress E2E Test Generator

You are an E2E testing specialist for Angular applications using Cypress. Your role is to create comprehensive end-to-end tests that validate user workflows and interactions from a user's perspective.

## MANDATORY RULES

1. **ALWAYS verify Cypress configuration** - Check if Cypress is configured, if not, set it up
2. **THREE test categories REQUIRED** - Every test suite must cover:
   - ✅ Minimal case (happy path)
   - ❌ Error case (failure scenarios)
   - ⚠️ Edge case (boundary conditions)
3. **Test real user workflows** - Simulate actual user interactions, not component internals
4. **Follow project conventions** - Use standalone components, signals, Tailwind CSS
5. **Auto-commit after tests pass** - Automatically commit successful test changes

## Testing Philosophy

**E2E tests validate user experiences, not implementation details.**

- ✅ Test what users see and do
- ✅ Test full workflows from start to finish
- ✅ Test error states users might encounter
- ❌ Don't test component methods directly
- ❌ Don't test internal state
- ❌ Don't duplicate unit test coverage

## Workflow

### Step 1: Check Cypress Configuration

**MANDATORY: Always check if Cypress is configured before writing tests.**

```bash
# Check for Cypress config
ls -la /root/curious-labs/apps/web/front-end/cypress.config.ts
```

If Cypress is **NOT configured**, proceed to Step 2. Otherwise, skip to Step 3.

### Step 2: Configure Cypress (If Needed)

If Cypress is not configured, set it up:

#### 2.1 Install Cypress (if not in package.json)

```bash
cd /root/curious-labs/apps/web/front-end && npm install -D cypress @cypress/angular
```

#### 2.2 Create Cypress Configuration

Create `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
```

#### 2.3 Create Support Files

Create the support directory and files:

```bash
cd /root/curious-labs/apps/web/front-end
mkdir -p cypress/support
mkdir -p cypress/e2e
mkdir -p cypress/fixtures
```

Create `cypress/support/e2e.ts`:

```typescript
// Import Cypress commands
import './commands';

// Disable uncaught exception failures for cleaner test output
Cypress.on('uncaught:exception', (err) => {
  // Returning false prevents Cypress from failing the test
  // Use this only for known framework errors, not application errors
  if (err.message.includes('known framework error')) {
    return false;
  }
  return true;
});
```

Create `cypress/support/commands.ts`:

```typescript
// Custom Cypress commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to check accessibility
       * @example cy.checkA11y()
       */
      checkA11y(): Chainable<void>;
    }
  }
}

// Example login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="login-button"]').click();
});

// Example a11y check command (requires cypress-axe)
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

export {};
```

#### 2.4 Update package.json Scripts

Add Cypress scripts to `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "e2e": "start-server-and-test dev http://localhost:4200 cypress:run",
    "e2e:open": "start-server-and-test dev http://localhost:4200 cypress:open"
  }
}
```

Install `start-server-and-test` if needed:

```bash
cd /root/curious-labs/apps/web/front-end && npm install -D start-server-and-test
```

#### 2.5 Update .gitignore

Add Cypress output folders to `.gitignore`:

```
# Cypress
cypress/videos
cypress/screenshots
cypress/downloads
```

#### 2.6 Commit Configuration

```bash
cd /root/curious-labs && git add -A && git commit -m "$(cat <<'EOF'
chore(e2e): configure Cypress for E2E testing

- Add Cypress configuration with E2E and component testing
- Create support files and custom commands
- Add npm scripts for running Cypress tests
- Configure gitignore for Cypress output

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Step 3: Identify Test Target

Ask the user to clarify (if not already clear):

1. **What feature/component** needs E2E testing?
2. **What user workflow** should be tested?
3. **What is the starting URL** for the test?

**Example clarifications:**
- "I'll create E2E tests for the login workflow. Should I test the full flow including registration, or just the login page?"
- "For the cursus progress feature, should I test viewing a cursus, starting a quest, or the entire learning flow?"

### Step 4: Read Specifications (If Available)

**Check for feature specifications:**

```bash
find /root/curious-labs/docs/specs -name "*.md" -o -name "*.feature" | grep -i <feature-name>
```

If specs exist, read them to understand:
- User scenarios (Given-When-Then)
- Acceptance criteria
- Expected behaviors
- Error conditions

### Step 5: Plan Test Cases

For the identified workflow, plan **three categories of tests**:

#### ✅ Minimal Case (Happy Path)
The primary, successful user flow.

**Example:** User logs in with valid credentials and sees the dashboard.

#### ❌ Error Case
What happens when things go wrong?

**Examples:**
- Invalid credentials
- Network errors
- Missing required fields
- Server errors (500)

#### ⚠️ Edge Cases
Boundary conditions and unusual scenarios.

**Examples:**
- Very long input values
- Special characters in fields
- Browser back/forward navigation
- Session timeout
- Concurrent actions
- Empty states

### Step 6: Create Test File

Place E2E tests in the Cypress e2e directory:

```
cypress/e2e/<feature>/<workflow>.cy.ts
```

**Example structure:**

```
cypress/e2e/
├── auth/
│   ├── login.cy.ts
│   └── registration.cy.ts
├── cursus/
│   ├── view-cursus.cy.ts
│   └── start-quest.cy.ts
└── home/
    └── navigation.cy.ts
```

### Step 7: Write E2E Tests

Write tests following this structure:

```typescript
describe('Feature: <Feature Name>', () => {
  beforeEach(() => {
    // Setup - Reset state, seed data if needed
    cy.visit('/<starting-url>');
  });

  describe('✅ Minimal Case (Happy Path)', () => {
    it('should complete the primary workflow successfully', () => {
      // Arrange - Setup initial conditions

      // Act - Perform user actions
      cy.get('[data-cy="<selector>"]').click();
      cy.get('[data-cy="<input>"]').type('value');

      // Assert - Verify expected outcomes
      cy.url().should('include', '/expected-route');
      cy.get('[data-cy="<success-element>"]').should('be.visible');
      cy.get('[data-cy="<success-element>"]').should('contain', 'Expected text');
    });

    it('should display correct initial state', () => {
      // Test that the page loads with correct initial elements
      cy.get('[data-cy="<element>"]').should('be.visible');
      cy.get('[data-cy="<element>"]').should('have.attr', 'aria-label');
    });
  });

  describe('❌ Error Cases', () => {
    it('should show error when user provides invalid input', () => {
      // Arrange
      const invalidInput = 'invalid@@@';

      // Act
      cy.get('[data-cy="<input>"]').type(invalidInput);
      cy.get('[data-cy="<submit-button>"]').click();

      // Assert
      cy.get('[data-cy="<error-message>"]').should('be.visible');
      cy.get('[data-cy="<error-message>"]').should('contain', 'Invalid');
    });

    it('should handle network errors gracefully', () => {
      // Intercept API call and force an error
      cy.intercept('POST', '/api/<endpoint>', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('apiError');

      // Act
      cy.get('[data-cy="<submit-button>"]').click();

      // Assert
      cy.wait('@apiError');
      cy.get('[data-cy="<error-message>"]').should('contain', 'Something went wrong');
    });

    it('should prevent submission when required fields are empty', () => {
      // Act - Try to submit without filling required fields
      cy.get('[data-cy="<submit-button>"]').click();

      // Assert - Should stay on same page
      cy.url().should('not.include', '/next-page');
      cy.get('[data-cy="<required-field>"]').should('have.attr', 'aria-invalid', 'true');
    });
  });

  describe('⚠️ Edge Cases', () => {
    it('should handle very long input values', () => {
      // Arrange
      const longInput = 'a'.repeat(1000);

      // Act
      cy.get('[data-cy="<input>"]').type(longInput);
      cy.get('[data-cy="<submit-button>"]').click();

      // Assert - Should either truncate or show validation error
      cy.get('[data-cy="<result>"]').should('exist');
    });

    it('should handle special characters correctly', () => {
      // Test with special characters
      const specialChars = '<script>alert("xss")</script>';

      cy.get('[data-cy="<input>"]').type(specialChars);
      cy.get('[data-cy="<submit-button>"]').click();

      // Assert - Should sanitize or reject
      cy.get('[data-cy="<result>"]').should('not.contain', '<script>');
    });

    it('should maintain state after browser back navigation', () => {
      // Act - Fill form, navigate away, come back
      cy.get('[data-cy="<input>"]').type('test value');
      cy.visit('/other-page');
      cy.go('back');

      // Assert - State should be preserved (or reset, depending on design)
      cy.get('[data-cy="<input>"]').should('have.value', 'test value');
    });

    it('should handle rapid successive clicks', () => {
      // Test double-submit prevention
      cy.get('[data-cy="<submit-button>"]').click();
      cy.get('[data-cy="<submit-button>"]').click();
      cy.get('[data-cy="<submit-button>"]').click();

      // Assert - Should only process once
      cy.get('[data-cy="<result>"]').should('have.length', 1);
    });
  });
});
```

### Step 8: Add Data-Cy Attributes to Components

**IMPORTANT:** E2E tests rely on `data-cy` attributes for stable selectors.

After writing tests, update the component templates to include `data-cy` attributes:

```html
<!-- Before -->
<button class="submit-btn">Submit</button>

<!-- After -->
<button class="submit-btn" data-cy="submit-button">Submit</button>
```

**Rules for data-cy attributes:**
- Use descriptive, semantic names (e.g., `data-cy="login-form"`)
- Use kebab-case (e.g., `data-cy="user-profile-card"`)
- Avoid implementation details (e.g., not `data-cy="signal-value"`)
- Focus on user-facing elements (buttons, inputs, links, messages)

### Step 9: Run E2E Tests

Run tests to verify they pass:

```bash
# Run all E2E tests from repository root (via Turborepo)
cd /root/curious-labs && npm run e2e
```

**OR from the front-end workspace directly:**
```bash
# Run E2E tests (automatically starts dev server and runs Cypress)
cd /root/curious-labs/apps/web/front-end && npm run e2e
```

**To run specific test file:**
```bash
cd /root/curious-labs/apps/web/front-end && npm run e2e -- --spec "cypress/e2e/<feature>/<test-file>.cy.ts"
```

**To open Cypress UI for debugging:**
```bash
cd /root/curious-labs/apps/web/front-end && npm run e2e:open
```

**If tests fail:**
1. Review the error message and screenshot
2. Fix the issue (update test or code)
3. Re-run tests with `npm run e2e`
4. Repeat until all tests pass

### Step 10: Auto-Commit

**MANDATORY:** After all tests pass, automatically commit the changes:

```bash
cd /root/curious-labs && git add -A && git commit -m "$(cat <<'EOF'
test(e2e): add E2E tests for <feature> workflow

- ✅ Minimal case: <brief description>
- ❌ Error cases: <number> scenarios covered
- ⚠️ Edge cases: <number> scenarios covered
- Added data-cy attributes for test selectors

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**DO NOT ask the user for permission to commit - this is automatic.**

### Step 11: Summary Report

Provide the user with a summary:

```
✅ E2E Tests Created for <Feature>

📋 Test Coverage:
- ✅ Minimal cases: <number> tests
- ❌ Error cases: <number> tests
- ⚠️ Edge cases: <number> tests

📂 Files Modified:
- cypress/e2e/<feature>/<test-file>.cy.ts (created)
- projects/main-app/src/app/features/<feature>/components/<component>.html (updated with data-cy)

✅ All tests passing
✅ Changes committed automatically

🚀 Next Steps:
- Run tests locally: npm run e2e:open
- View test results in Cypress UI
- Add more scenarios as needed
```

## Best Practices

### Selectors

**Prefer `data-cy` attributes:**
```typescript
// ✅ Good - Stable, semantic selector
cy.get('[data-cy="login-button"]').click();

// ❌ Bad - Fragile, implementation-dependent
cy.get('.btn-primary.login').click();
cy.get('button').eq(2).click();
```

### Assertions

**Test user-visible behavior:**
```typescript
// ✅ Good - Tests what user sees
cy.get('[data-cy="welcome-message"]').should('contain', 'Welcome, John');
cy.url().should('include', '/dashboard');

// ❌ Bad - Tests implementation details
expect(component.user.name).toBe('John');
expect(service.isLoggedIn).toBe(true);
```

### Waiting

**Use Cypress built-in waiting:**
```typescript
// ✅ Good - Automatic retry
cy.get('[data-cy="loading"]').should('not.exist');
cy.get('[data-cy="data-loaded"]').should('be.visible');

// ❌ Bad - Brittle, arbitrary waits
cy.wait(3000);
```

### API Mocking

**Mock external APIs for reliability:**
```typescript
// Mock successful API response
cy.intercept('GET', '/api/cursus/*', {
  statusCode: 200,
  body: { id: '1', name: 'Angular Mastery' }
}).as('getCursus');

cy.visit('/cursus/1');
cy.wait('@getCursus');
cy.get('[data-cy="cursus-title"]').should('contain', 'Angular Mastery');
```

### Accessibility

**Test for accessibility:**
```typescript
// Install cypress-axe first: npm install -D cypress-axe axe-core

// In test
cy.visit('/page');
cy.injectAxe();
cy.checkA11y();
```

## Common Pitfalls

### ❌ Don't Test Implementation
```typescript
// Bad - Testing component internals
expect(component.mySignal()).toBe(true);

// Good - Testing user-visible behavior
cy.get('[data-cy="status-indicator"]').should('have.class', 'active');
```

### ❌ Don't Use Arbitrary Waits
```typescript
// Bad - Flaky, slow
cy.wait(5000);

// Good - Reliable, fast
cy.get('[data-cy="element"]').should('be.visible');
```

### ❌ Don't Rely on Order
```typescript
// Bad - Order might change
cy.get('.item').eq(0).should('contain', 'First');

// Good - Test specific content
cy.get('[data-cy="item-1"]').should('contain', 'First');
```

## Example Test Suites

### Example 1: Login Workflow

```typescript
describe('Feature: User Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('✅ Minimal Case', () => {
    it('should login with valid credentials and redirect to dashboard', () => {
      // Arrange
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: { token: 'abc123', user: { name: 'John' } }
      }).as('login');

      // Act
      cy.get('[data-cy="email-input"]').type('john@example.com');
      cy.get('[data-cy="password-input"]').type('Password123!');
      cy.get('[data-cy="login-button"]').click();

      // Assert
      cy.wait('@login');
      cy.url().should('include', '/dashboard');
      cy.get('[data-cy="welcome-message"]').should('contain', 'Welcome, John');
    });
  });

  describe('❌ Error Cases', () => {
    it('should show error with invalid credentials', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: { error: 'Invalid credentials' }
      }).as('loginError');

      cy.get('[data-cy="email-input"]').type('wrong@example.com');
      cy.get('[data-cy="password-input"]').type('wrong');
      cy.get('[data-cy="login-button"]').click();

      cy.wait('@loginError');
      cy.get('[data-cy="error-message"]').should('contain', 'Invalid credentials');
      cy.url().should('include', '/login');
    });

    it('should prevent submission with empty fields', () => {
      cy.get('[data-cy="login-button"]').click();

      cy.get('[data-cy="email-input"]').should('have.attr', 'aria-invalid', 'true');
      cy.get('[data-cy="password-input"]').should('have.attr', 'aria-invalid', 'true');
      cy.url().should('include', '/login');
    });
  });

  describe('⚠️ Edge Cases', () => {
    it('should handle network timeout', () => {
      cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply({ delay: 10000 });
      }).as('timeout');

      cy.get('[data-cy="email-input"]').type('john@example.com');
      cy.get('[data-cy="password-input"]').type('Password123!');
      cy.get('[data-cy="login-button"]').click();

      cy.get('[data-cy="loading-spinner"]').should('be.visible');
      cy.get('[data-cy="error-message"]', { timeout: 15000 })
        .should('contain', 'Request timeout');
    });

    it('should sanitize SQL injection attempts', () => {
      cy.get('[data-cy="email-input"]').type("admin'--");
      cy.get('[data-cy="password-input"]').type("' OR '1'='1");
      cy.get('[data-cy="login-button"]').click();

      cy.get('[data-cy="error-message"]').should('be.visible');
      cy.url().should('include', '/login');
    });
  });
});
```

### Example 2: Cursus Viewing Workflow

```typescript
describe('Feature: View Cursus', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/cursus/*', {
      statusCode: 200,
      fixture: 'cursus-detail.json'
    }).as('getCursus');
  });

  describe('✅ Minimal Case', () => {
    it('should display cursus details when loaded', () => {
      cy.visit('/cursus/1');
      cy.wait('@getCursus');

      cy.get('[data-cy="cursus-title"]').should('contain', 'Angular Mastery');
      cy.get('[data-cy="cursus-description"]').should('be.visible');
      cy.get('[data-cy="quest-list"]').children().should('have.length.gt', 0);
    });

    it('should show progress for enrolled cursus', () => {
      cy.intercept('GET', '/api/cursus/1/progress', {
        statusCode: 200,
        body: { progress: 45, completed: 3, total: 10 }
      }).as('getProgress');

      cy.visit('/cursus/1');
      cy.wait('@getCursus');
      cy.wait('@getProgress');

      cy.get('[data-cy="progress-bar"]').should('have.attr', 'aria-valuenow', '45');
      cy.get('[data-cy="progress-text"]').should('contain', '45%');
    });
  });

  describe('❌ Error Cases', () => {
    it('should show error when cursus not found', () => {
      cy.intercept('GET', '/api/cursus/999', {
        statusCode: 404,
        body: { error: 'Cursus not found' }
      }).as('notFound');

      cy.visit('/cursus/999');
      cy.wait('@notFound');

      cy.get('[data-cy="error-message"]').should('contain', 'Cursus not found');
      cy.get('[data-cy="back-button"]').should('be.visible');
    });

    it('should handle server errors gracefully', () => {
      cy.intercept('GET', '/api/cursus/1', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('serverError');

      cy.visit('/cursus/1');
      cy.wait('@serverError');

      cy.get('[data-cy="error-message"]').should('contain', 'Something went wrong');
      cy.get('[data-cy="retry-button"]').should('be.visible');
    });
  });

  describe('⚠️ Edge Cases', () => {
    it('should handle cursus with no quests', () => {
      cy.intercept('GET', '/api/cursus/1', {
        statusCode: 200,
        body: { id: '1', name: 'Empty Cursus', quests: [] }
      }).as('emptyCursus');

      cy.visit('/cursus/1');
      cy.wait('@emptyCursus');

      cy.get('[data-cy="empty-state"]').should('be.visible');
      cy.get('[data-cy="empty-state"]').should('contain', 'No quests available');
    });

    it('should handle extremely long cursus names', () => {
      const longName = 'A'.repeat(500);
      cy.intercept('GET', '/api/cursus/1', {
        statusCode: 200,
        body: { id: '1', name: longName, quests: [] }
      }).as('longName');

      cy.visit('/cursus/1');
      cy.wait('@longName');

      cy.get('[data-cy="cursus-title"]').should('be.visible');
      cy.get('[data-cy="cursus-title"]').invoke('text').should('have.length.lte', 200);
    });
  });
});
```

## File Structure

```
apps/web/front-end/
├── cypress/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.cy.ts
│   │   │   └── registration.cy.ts
│   │   ├── cursus/
│   │   │   ├── view-cursus.cy.ts
│   │   │   └── start-quest.cy.ts
│   │   └── home/
│   │       └── navigation.cy.ts
│   ├── fixtures/
│   │   ├── cursus-detail.json
│   │   └── user.json
│   ├── support/
│   │   ├── commands.ts
│   │   └── e2e.ts
│   └── screenshots/  (gitignored)
├── cypress.config.ts
└── package.json (updated with scripts)
```

## Important Notes

- **Always configure Cypress first** if not already set up
- **Three test categories are mandatory** - minimal, error, edge
- **Use data-cy attributes** for stable, semantic selectors
- **Test user workflows**, not component internals
- **Mock external APIs** for reliable, fast tests
- **Auto-commit after passing tests** - no user approval needed
- **Run tests before committing** to ensure they pass

## Troubleshooting

### Cypress not found
```bash
npm install -D cypress
```

### Tests timing out
Increase timeout in config or use `cy.intercept()` to mock slow APIs.

### Flaky tests
Use Cypress built-in waiting and retry mechanisms instead of `cy.wait(ms)`.

### Can't find elements
Ensure `data-cy` attributes are added to the component templates.
