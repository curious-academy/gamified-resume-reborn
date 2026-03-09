---
name: commit
description: Create a clean git commit following conventional commits specification with English messages. Use when the user wants to commit changes, asks for a commit, or mentions "commit". MANDATORY AUTO-TRIGGER after completing ANY unit of modification that successfully builds (compiles, passes tests, or passes linting) — run git status and if uncommitted changes exist, commit immediately without asking. Every logical change MUST result in a commit. Never accumulate uncommitted changes across multiple modifications.
---

# Conventional Commit Generator

You are a git commit assistant for this project. Your role is to analyze changes and create clean, meaningful commits following the conventional commits specification with messages in English.

## ⚠️ GOLDEN RULE — MANDATORY AUTO-COMMIT

**Every single unit of logical modification MUST be committed automatically.**
A "unit of modification" is any one of:
- A file creation (component, service, config, spec, etc.)
- A file edit that completes a logical change (fix, feature step, refactor)
- A build/test fix
- A styling change
- Any change that leaves the project in a working state

**NEVER accumulate multiple logical changes without committing.** Each commit = one logical unit.

## TWO MODES

### Auto-commit mode (after a unit task that builds) — DEFAULT MODE
Triggered automatically when a unit task completes **and the build succeeds** (compilation, tests pass, lint passes).
- Run `git status` — if no uncommitted changes, skip silently
- If changes exist: `git add -A` and commit **immediately, without asking**
- Infer the commit message from context (what was just done)
- This is NON-INTERACTIVE — do not propose, do not ask for approval
- **Do NOT commit if the build failed** — broken code must not be committed
- **ALL skills and agents MUST trigger auto-commit** after completing their work

### Manual mode (user explicitly asks `/commit` or "commit my changes")
- Analyze changes, propose a message, wait for user approval before committing

## MANDATORY RULES

1. **ALWAYS write commit messages in English** — regardless of the user's language
2. **ALWAYS follow conventional commits format**: `type(scope): description`
3. **ALWAYS analyze changes before committing** — run git status and git diff
4. **In auto-commit mode**: commit immediately, no approval needed
5. **In manual mode**: present the proposed message and wait for approval

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

## Auto-Commit Workflow (non-interactive)

### Step 1: Check for changes

```bash
git status
```

If nothing to commit → skip silently, say nothing.

### Step 2: Stage all changes

```bash
git add -A
```

### Step 3: Infer message from context and commit immediately

```bash
git commit -m "$(cat <<'EOF'
type(scope): description inferred from what was just done

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Step 4: Confirm

```bash
git log -1 --oneline
```

Mention briefly in the response: e.g. "✓ Committed: `fix(e2e): ...`"

---

## Manual Commit Workflow (user-requested)

### Step 1: Analyze Changes

Run these commands in parallel:

```bash
git status
git diff HEAD
git log --oneline -10
```

### Step 2: Determine Commit Type and Scope

Based on the changes:
1. Identify the **type** (feat, fix, refactor, etc.)
2. Identify the **scope** (which feature/component is affected)
3. Craft a clear, concise **description**

### Step 3: Stage Files if Needed

Prefer staging specific files:
```bash
git add path/to/file1.ts path/to/file2.html
```

Use `git add -A` only when all changes belong to the same logical unit.

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

Shall I proceed?
```

### Step 5: Create the Commit

After user approval:

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

```bash
git status && git log -1
```

---

## Important Notes

- **Language**: Commit messages are ALWAYS in English, even if the user communicates in another language
- **Git Safety**: Follow all git safety protocols (no --force, no --amend unless explicitly requested)
- **No Skipping Hooks**: Never use --no-verify or --no-gpg-sign
- **Scope is Important**: Always include a scope when possible
- **Keep it Atomic**: Suggest splitting commits if changes are unrelated
- **Breaking Changes**: For breaking changes, add `!` after type/scope: `feat(api)!: change response format`

## Breaking Changes Format

```bash
feat(api)!: change user endpoint response format

BREAKING CHANGE: The user endpoint now returns { data: User } instead of User directly.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## Co-Author Tag

Always include at the end:
```
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```
