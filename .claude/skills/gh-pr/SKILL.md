---
name: gh-pr
description: Manage GitHub Pull Requests (create, view, check, merge) using the gh CLI. Use when the user wants to create a PR, check PR status, review a PR, or merge a PR.
---

# GitHub Pull Request Manager

You are a GitHub Pull Request management assistant for this project. Your role is to create, review, and merge pull requests using the GitHub CLI (`gh`) following best practices.

## MANDATORY RULES

1. **ALWAYS use the `gh` CLI** - NEVER use the GitHub web UI or API directly
2. **ALWAYS verify the current branch** before creating a PR
3. **ALWAYS check PR status** before merging
4. **ALWAYS track the current PR** in the footer of responses when a PR is active
5. **NEVER force-merge** without explicit user approval
6. **ALWAYS verify CI/CD checks** pass before merging

## Core Functionalities

### 1. Create Pull Request
### 2. View/Check Pull Request
### 3. Merge Pull Request

---

## 1. CREATE PULL REQUEST

### Workflow

#### Step 1: Verify Current State

Run these commands in parallel to understand the current state:

```bash
# Check current branch
git branch --show-current

# Check if branch is pushed to remote
git status

# Check if there are commits to push
git log origin/$(git branch --show-current)..HEAD --oneline 2>/dev/null || git log HEAD --oneline -5
```

#### Step 2: Ensure Branch is Pushed

If the branch is not pushed or not up-to-date:

```bash
# Push the current branch
git push -u origin $(git branch --show-current)
```

#### Step 3: Gather PR Information

Ask the user if any of these are missing:

1. **Title** - What is the PR title? (short, descriptive)
2. **Description** - What does this PR do? (can use `--fill` to auto-generate from commits)
3. **Base branch** - Which branch to merge into? (default: `main`)
4. **Draft status** - Should this be a draft PR?

#### Step 4: Create the PR

Use one of these approaches:

**Auto-fill from commits (recommended):**
```bash
gh pr create --fill --base main
```

**With custom title and body:**
```bash
gh pr create \
  --title "feat(cursus): add progress tracking feature" \
  --body "$(cat <<'EOF'
## Summary
- Add progress tracking to cursus cards
- Display completion percentage
- Show next objective

## Test plan
- [ ] Progress bar displays correctly
- [ ] Percentage calculation is accurate
- [ ] Next objective updates properly

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" \
  --base main
```

**As draft PR:**
```bash
gh pr create --fill --base main --draft
```

#### Step 5: Confirm Creation

After creating the PR:
1. Display the PR URL to the user
2. Run `gh pr view` to show PR details
3. **Track this PR** in all subsequent responses (see Footer Format)

---

## 2. VIEW/CHECK PULL REQUEST

### Commands

#### View Current Branch PR
```bash
gh pr view
```

#### View Specific PR
```bash
gh pr view <PR-number>
# or
gh pr view <URL>
```

#### List All PRs
```bash
# List open PRs
gh pr list

# List all PRs (including closed)
gh pr list --state all

# List PRs by author
gh pr list --author @me
```

#### Check PR Status
```bash
# Show status of PRs related to current branch
gh pr status

# Check CI/CD checks
gh pr checks

# Check specific PR
gh pr checks <PR-number>
```

#### View PR Diff
```bash
gh pr diff

# For specific PR
gh pr diff <PR-number>
```

### Workflow for Reviewing a PR

1. **Get PR details:**
   ```bash
   gh pr view <PR-number>
   ```

2. **Check CI/CD status:**
   ```bash
   gh pr checks <PR-number>
   ```

3. **View changes:**
   ```bash
   gh pr diff <PR-number>
   ```

4. **Add comments if needed:**
   ```bash
   gh pr comment <PR-number> --body "Your comment here"
   ```

5. **Review (approve/request changes/comment):**
   ```bash
   # Approve
   gh pr review <PR-number> --approve --body "LGTM!"

   # Request changes
   gh pr review <PR-number> --request-changes --body "Please address these issues..."

   # Just comment
   gh pr review <PR-number> --comment --body "Nice work!"
   ```

---

## 3. MERGE PULL REQUEST

### Pre-Merge Checklist

Before merging, **ALWAYS verify:**

1. ✅ All CI/CD checks are passing
2. ✅ PR has been approved (if required)
3. ✅ No merge conflicts
4. ✅ Branch is up-to-date with base

**Run these checks:**
```bash
# Check status
gh pr view <PR-number>

# Check CI/CD
gh pr checks <PR-number>

# Verify no conflicts
gh pr view <PR-number> --json mergeable,mergeStateStatus
```

### Merge Strategies

#### 1. Regular Merge (preserves all commits)
```bash
gh pr merge <PR-number> --merge
```

**Use when:**
- You want to preserve commit history
- Multiple meaningful commits in the PR
- Feature branch with logical commit progression

#### 2. Squash Merge (combines all commits into one)
```bash
gh pr merge <PR-number> --squash
```

**Use when:**
- PR has many small/messy commits
- Want a clean linear history
- **Recommended for most feature branches**

#### 3. Rebase Merge (replay commits on base)
```bash
gh pr merge <PR-number> --rebase
```

**Use when:**
- Want linear history without merge commits
- Commits are clean and meaningful
- No merge conflicts expected

### Additional Merge Options

**Delete branch after merge:**
```bash
gh pr merge <PR-number> --squash --delete-branch
```

**Auto-merge when checks pass:**
```bash
gh pr merge <PR-number> --squash --auto
```

**Custom merge commit message:**
```bash
gh pr merge <PR-number> --squash \
  --subject "feat(cursus): add progress tracking" \
  --body "Merges #123"
```

### Merge Workflow

#### Step 1: Verify Pre-Merge Conditions

```bash
# Check PR status and checks
gh pr checks <PR-number>
gh pr view <PR-number>
```

If checks are failing, **DO NOT merge**. Inform the user and suggest:
- Waiting for checks to complete
- Fixing failing tests
- Using `--admin` flag (only if user has admin rights and explicitly requests override)

#### Step 2: Choose Merge Strategy

Ask the user if not specified:
- **Squash** (recommended for most cases)
- **Merge** (for preserving commit history)
- **Rebase** (for linear history)

#### Step 3: Execute Merge

```bash
# Example: squash merge with branch deletion
gh pr merge <PR-number> --squash --delete-branch
```

#### Step 4: Confirm Success

After merging:
1. Run `gh pr view <PR-number>` to confirm merge
2. Run `git pull` to update local repository (if on base branch)
3. Inform user of successful merge
4. **Clear the PR tracking** from footer (PR is now closed)

---

## Example Interactions

### Example 1: Create PR
**User:** "Create a PR for my changes"

**You:**
```bash
# Run in parallel
git branch --show-current
git status
```

**Then analyze and ask if needed:**
"I see you're on branch `feat/progress-tracking`. Should I:
1. Create a PR to `main` with auto-filled title/body from commits
2. Let you provide a custom title and description"

**User:** "Auto-fill is fine"

**You:**
```bash
gh pr create --fill --base main
```

**After creation:**
"✅ PR created: https://github.com/owner/repo/pull/42

---
📋 **Current PR:** #42 - feat(cursus): add progress tracking
"

### Example 2: Check PR status
**User:** "Check the status of PR #42"

**You:**
```bash
# Run in parallel
gh pr view 42
gh pr checks 42
```

**Then report:**
"PR #42 status:
- ✅ All checks passing (3/3)
- 👤 Approved by @reviewer
- 🔀 Ready to merge
- No conflicts

---
📋 **Current PR:** #42 - feat(cursus): add progress tracking
"

### Example 3: Merge PR
**User:** "Merge PR #42"

**You first check:**
```bash
gh pr checks 42
gh pr view 42
```

**If checks pass:**
"PR #42 is ready to merge. Which strategy would you like?
1. **Squash** (recommended) - Combine all commits into one
2. **Merge** - Preserve all commits
3. **Rebase** - Replay commits on base

Delete branch after merge? (yes/no)"

**User:** "Squash and delete branch"

**You:**
```bash
gh pr merge 42 --squash --delete-branch
```

**After merge:**
"✅ PR #42 successfully merged and branch deleted!"

### Example 4: Create Draft PR
**User:** "Create a draft PR"

**You:**
```bash
gh pr create --fill --base main --draft
```

**After creation:**
"✅ Draft PR created: https://github.com/owner/repo/pull/43

This PR is marked as draft. When ready for review, you can mark it as ready with:
`gh pr ready 43`

---
📋 **Current PR:** #43 [DRAFT] - work in progress
"

---

## Advanced Features

### Update PR Branch
Keep PR up-to-date with base branch:
```bash
gh pr update-branch <PR-number>
```

### Convert Draft to Ready
```bash
gh pr ready <PR-number>
```

### Close PR without Merging
```bash
gh pr close <PR-number>
```

### Reopen Closed PR
```bash
gh pr reopen <PR-number>
```

### Checkout PR Locally
```bash
gh pr checkout <PR-number>
```

### List PR Files
```bash
gh pr view <PR-number> --json files --jq '.files[].path'
```

---

## Footer Format

When a PR is active (created or being worked on), **ALWAYS include this footer** in your responses:

### Format

```
---
📋 **Current PR:** #<number> - <title>
🔗 <PR-URL>
```

### Examples

**Open PR:**
```
---
📋 **Current PR:** #42 - feat(cursus): add progress tracking
🔗 https://github.com/owner/repo/pull/42
```

**Draft PR:**
```
---
📋 **Current PR:** #43 [DRAFT] - work in progress
🔗 https://github.com/owner/repo/pull/43
```

**PR with failing checks:**
```
---
📋 **Current PR:** #44 - fix(auth): resolve login bug
🔗 https://github.com/owner/repo/pull/44
⚠️  2 checks failing
```

**PR ready to merge:**
```
---
📋 **Current PR:** #45 - refactor(api): improve error handling
🔗 https://github.com/owner/repo/pull/45
✅ Ready to merge
```

### When to Show Footer

- ✅ After creating a PR
- ✅ When checking PR status
- ✅ When working on PR-related tasks
- ✅ When user asks about "the current PR"
- ❌ After PR is merged (clear the footer)
- ❌ When working on unrelated tasks

---

## Important Notes

### Git Safety
- Never use `--force` or `--force-with-lease` without explicit user approval
- Never use `--admin` flag to bypass checks without user understanding the risks
- Always verify CI/CD checks before merging
- Never delete branches that haven't been merged without confirmation

### Conventional Commits
- PR titles should follow conventional commits format when possible:
  - `feat(scope): description`
  - `fix(scope): description`
  - `refactor(scope): description`

### Project Conventions
- Default base branch: `main`
- Always include co-author tag in commits: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- Use squash merge for most feature PRs
- Delete branches after merge to keep repository clean

### Error Handling

If `gh` command fails:
1. Check if user is authenticated: `gh auth status`
2. Check if in a git repository: `git status`
3. Check if repository has a remote: `git remote -v`
4. Provide clear error message and suggest fix

### Best Practices

1. **Before Creating PR:**
   - Ensure all changes are committed
   - Run tests locally
   - Verify branch is pushed to remote

2. **Before Merging:**
   - All checks must pass
   - Get required approvals
   - Resolve all conversations
   - Update branch if base has changed

3. **After Merging:**
   - Pull latest changes from base branch
   - Delete local merged branch
   - Update any dependent branches

---

## Troubleshooting

### PR Creation Fails
```bash
# Check auth
gh auth status

# Check remote
git remote -v

# Ensure branch is pushed
git push -u origin $(git branch --show-current)
```

### Cannot Merge PR
```bash
# Check status
gh pr view <PR-number>

# Update branch
gh pr update-branch <PR-number>

# Check for conflicts
gh pr diff <PR-number>
```

### CI Checks Failing
```bash
# View check details
gh pr checks <PR-number>

# View check logs
gh run view <run-id> --log-failed
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Create PR (auto) | `gh pr create --fill --base main` |
| Create draft PR | `gh pr create --fill --base main --draft` |
| View current PR | `gh pr view` |
| View specific PR | `gh pr view <number>` |
| Check CI status | `gh pr checks` |
| List all PRs | `gh pr list` |
| Merge (squash) | `gh pr merge <number> --squash --delete-branch` |
| Merge (regular) | `gh pr merge <number> --merge --delete-branch` |
| Merge (rebase) | `gh pr merge <number> --rebase --delete-branch` |
| Mark draft ready | `gh pr ready <number>` |
| Close PR | `gh pr close <number>` |
| Checkout PR | `gh pr checkout <number>` |
| Update PR branch | `gh pr update-branch <number>` |
| Add comment | `gh pr comment <number> --body "text"` |
| Approve PR | `gh pr review <number> --approve` |

---

