---
name: commit
description: Create a clean git commit following conventional commits specification with English messages. Use when the user wants to commit changes, asks for a commit, or mentions "commit".
---

# Conventional Commit Generator

You are a git commit assistant for this project. Your role is to analyze changes and create clean, meaningful commits following the conventional commits specification with messages in English.

## MANDATORY RULES

1. **ALWAYS write commit messages in English** - regardless of the user's language
2. **ALWAYS follow conventional commits format**: `type(scope): description`
3. **ALWAYS analyze changes before proposing a message** - run git status and git diff
4. **ALWAYS present the proposed message for validation** before committing
5. **NEVER commit without user approval** of the message

## Conventional Commits Format

```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types

- **feat**: New feature for the user
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Formatting, missing semicolons, etc; no code change
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI/CD configuration
- **chore**: Maintenance tasks, configuration, etc.

### Scope (optional but recommended)

The scope should indicate which part of the codebase is affected:
- Feature name (e.g., `auth`, `profile`, `cart`)
- Component name (e.g., `login-form`, `header`)
- Area (e.g., `api`, `routing`, `config`)

### Description

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Be concise but descriptive (max 72 characters for the full first line)

### Examples

```bash
feat(auth): add login form with email validation
fix(cart): prevent duplicate items from being added
docs(readme): update installation instructions
refactor(api): simplify error handling logic
test(profile): add unit tests for user service
chore(deps): update Angular to v21.1.0
style(header): format code with prettier
```

## Workflow

### Step 1: Analyze Changes

Run these commands in parallel to understand what will be committed:

```bash
# Check status (never use -uall flag)
git status

# See staged and unstaged changes
git diff HEAD

# Check recent commits for style reference
git log --oneline -10
```

### Step 2: Determine Commit Type and Scope

Based on the changes:
1. Identify the **type** (feat, fix, refactor, etc.)
2. Identify the **scope** (which feature/component is affected)
3. Craft a clear, concise **description**

### Step 3: Stage Files if Needed

If there are unstaged changes that should be included:
- Ask the user which files to stage, OR
- If obvious from context, stage relevant files

Prefer staging specific files:
```bash
git add path/to/file1.ts path/to/file2.html
```

Avoid `git add .` or `git add -A` unless explicitly requested.

### Step 4: Present the Proposed Message

Show the user the proposed commit message and ask for validation:

```
Proposed commit message:
---
feat(auth): add login form with email validation

Adds a new login form component with:
- Email and password fields
- Client-side validation
- Error message display
---

Is this commit message acceptable?
1. Yes, commit with this message
2. Let me modify the message
3. Cancel
```

### Step 5: Create the Commit

After user approval, create the commit with the co-author tag:

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add login form with email validation

Adds a new login form component with:
- Email and password fields
- Client-side validation
- Error message display

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Step 6: Confirm Success

After committing, run `git status` and `git log -1` to confirm the commit was created successfully.

## Example Interactions

### Example 1: Simple feature addition
**User:** "Commit my changes"

**You analyze changes and find a new component was added**

**You:** "I've analyzed your changes. You've added a new login form component.

Proposed commit message:
```
feat(auth): add login form component
```

Should I proceed with this commit?"

### Example 2: Bug fix
**User:** "J'ai corrigé le bug du panier" (French)

**You analyze and see cart-related fixes**

**You:** "I've analyzed your changes. You've fixed the shopping cart bug.

Proposed commit message:
```
fix(cart): prevent duplicate items from being added
```

Should I proceed with this commit?" *(Note: response in French is OK, but commit message MUST be in English)*

### Example 3: Multiple types of changes
**User:** "Commit everything"

**You analyze and find both new features AND bug fixes**

**You:** "I've analyzed your changes and found multiple types of changes:
- New feature: login form component
- Bug fix: cart duplication issue

It's best practice to create separate commits for these. Should I:
1. Create two separate commits (recommended)
2. Create one combined commit
3. Let you choose which files to commit first"

### Example 4: Unclear changes
**User:** "Make a commit"

**You analyze but can't determine the purpose**

**You:** "I've analyzed your changes:
- Modified: login.component.ts, cart.service.ts
- Added: user.model.ts

The changes affect multiple areas. Can you describe what you were working on? This will help me craft an accurate commit message."

## Important Notes

- **Language**: Commit messages are ALWAYS in English, even if the user communicates in another language
- **Git Safety**: Follow all git safety protocols (no --force, no --amend unless explicitly requested)
- **No Skipping Hooks**: Never use --no-verify or --no-gpg-sign
- **File Staging**: Prefer specific file paths over git add .
- **Validation**: Always get user approval before committing
- **Scope is Important**: Try to always include a scope when possible for better commit history
- **Keep it Atomic**: Suggest splitting commits if changes are unrelated
- **Breaking Changes**: For breaking changes, add `!` after type/scope: `feat(api)!: change response format`

## Breaking Changes Format

For breaking changes, use the `!` notation and add a BREAKING CHANGE footer:

```bash
feat(api)!: change user endpoint response format

BREAKING CHANGE: The user endpoint now returns { data: User } instead of User directly.
This affects all API consumers.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## Co-Author Tag

Always include the co-author tag at the end:
```
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```
