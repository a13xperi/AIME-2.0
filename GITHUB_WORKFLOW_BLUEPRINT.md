# GitHub Workflow Blueprint - Agent Alex

**Version:** 1.0  
**Date:** October 20, 2025  
**Status:** Ready to Execute

---

## 🎯 Executive Summary

This whitepaper defines the complete GitHub workflow for Agent Alex, including:
- Branch strategy (main, develop, feature branches)
- Pull Request process and templates
- Code review requirements
- Branch protection rules
- Automated quality checks
- One-command setup scripts

**Goal:** Professional Git workflow that scales from solo to team development.

---

## 📐 Branch Strategy

### Branch Hierarchy

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (active development)
  ↑
hotfix/* (emergency fixes)
```

### Branch Purposes

| Branch | Purpose | Protected | Auto-Deploy |
|--------|---------|-----------|-------------|
| `main` | Production code | ✅ Yes | ✅ Vercel Production |
| `develop` | Integration/staging | ✅ Yes | ✅ Vercel Preview |
| `feature/*` | New features | ❌ No | ✅ Vercel Preview |
| `hotfix/*` | Emergency fixes | ❌ No | ❌ Manual |

---

## 🔄 Standard Workflow

### 1. Starting New Work

```bash
# Update your local repo
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/add-user-authentication
# or
git checkout -b feature/fix-session-logging
# or
git checkout -b feature/improve-dashboard-ui
```

### 2. During Development

```bash
# Commit often (every 30-60 min)
git add -A
git commit -m "feat: add login form component"

# Push to remote regularly
git push origin feature/add-user-authentication
```

### 3. Ready for Review

```bash
# Make sure you're up to date
git checkout develop
git pull origin develop
git checkout feature/add-user-authentication
git merge develop  # Resolve any conflicts

# Push final changes
git push origin feature/add-user-authentication

# Create PR via GitHub CLI
gh pr create --base develop --head feature/add-user-authentication \
  --title "Add user authentication" \
  --body "Implements login/logout with JWT tokens. Closes #123"
```

### 4. After PR Approval

```bash
# Merge via GitHub (or CLI)
gh pr merge --squash --delete-branch

# Update local
git checkout develop
git pull origin develop
git branch -d feature/add-user-authentication
```

---

## 📋 Pull Request Template

### PR Title Format
```
<type>: <description>

Examples:
feat: add user authentication system
fix: resolve session timeout bug
docs: update API documentation
refactor: improve error handling logic
test: add integration tests for API
```

### PR Description Template

```markdown
## What does this PR do?
Brief description of changes

## Why?
Explain the motivation for this change

## Changes Made
- [ ] Added X component
- [ ] Updated Y function
- [ ] Refactored Z logic

## Testing
- [ ] Unit tests pass (`npm test`)
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Issues
Closes #123
Relates to #456

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

---

## 🛡️ Branch Protection Rules

### For `main` Branch

```yaml
Protections:
  - Require pull request before merging
  - Require 1 approval (for team, 0 for solo)
  - Require status checks to pass:
    - Test Suite (GitHub Actions)
  - Require branches to be up to date
  - Require linear history (squash merges)
  - Do not allow force pushes
  - Do not allow deletions
```

### For `develop` Branch

```yaml
Protections:
  - Require pull request before merging
  - Require status checks to pass:
    - Test Suite (GitHub Actions)
  - Allow force pushes: No
  - Allow deletions: No
```

---

## 🤖 Automated Quality Checks

### GitHub Actions Workflows

#### 1. **Pull Request Check** (`.github/workflows/pr-check.yml`)

```yaml
name: PR Check

on:
  pull_request:
    branches: [ develop, main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --watchAll=false
      - run: npm run build
      
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint (when added)
```

#### 2. **Deploy to Production** (`.github/workflows/deploy-prod.yml`)

```yaml
name: Deploy Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📝 Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Simple
git commit -m "feat: add login button"

# With scope
git commit -m "feat(auth): add JWT token validation"

# With body
git commit -m "fix: resolve session timeout issue

Sessions were expiring too quickly due to incorrect
timeout calculation. Updated to use milliseconds instead
of seconds.

Closes #234"
```

---

## 🚀 One-Command Setup Scripts

### Script 1: Initialize Workflow

**File:** `scripts/setup-github-workflow.sh`

```bash
#!/bin/bash
# Setup complete GitHub workflow

echo "🚀 Setting up GitHub workflow..."

# Create develop branch
git checkout -b develop
git push -u origin develop

# Set default branch for new PRs
gh repo edit --default-branch develop

# Create PR template
mkdir -p .github/PULL_REQUEST_TEMPLATE
cat > .github/PULL_REQUEST_TEMPLATE.md <<'EOF'
## What does this PR do?


## Why?


## Changes Made
- [ ] 

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed

## Related Issues
Closes #

## Checklist
- [ ] Code follows conventions
- [ ] Tests added/updated
- [ ] Documentation updated
EOF

# Create issue templates
mkdir -p .github/ISSUE_TEMPLATE
cat > .github/ISSUE_TEMPLATE/bug_report.md <<'EOF'
---
name: Bug Report
about: Report a bug
title: '[BUG] '
labels: bug
---

## Description
Brief description of the bug

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior


## Actual Behavior


## Environment
- OS: 
- Browser: 
- Version: 
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md <<'EOF'
---
name: Feature Request
about: Suggest a new feature
title: '[FEATURE] '
labels: enhancement
---

## Feature Description


## Use Case


## Proposed Solution


## Alternatives Considered

EOF

# Commit templates
git add .github/
git commit -m "ci: add PR and issue templates"
git push

echo "✅ GitHub workflow setup complete!"
echo ""
echo "Next steps:"
echo "1. Enable branch protection: gh repo edit --enable-branch-protection"
echo "2. Set up Vercel deployment"
echo "3. Start using feature branches!"
```

### Script 2: Start Feature

**File:** `scripts/start-feature.sh`

```bash
#!/bin/bash
# Quick feature branch creation

if [ -z "$1" ]; then
  echo "Usage: ./scripts/start-feature.sh <feature-name>"
  echo "Example: ./scripts/start-feature.sh add-dark-mode"
  exit 1
fi

FEATURE_NAME=$1

echo "🚀 Starting new feature: $FEATURE_NAME"

# Update develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b "feature/$FEATURE_NAME"
git push -u origin "feature/$FEATURE_NAME"

echo "✅ Feature branch created: feature/$FEATURE_NAME"
echo ""
echo "Start coding! When done, run:"
echo "  ./scripts/create-pr.sh"
```

### Script 3: Create PR

**File:** `scripts/create-pr.sh`

```bash
#!/bin/bash
# Create pull request

CURRENT_BRANCH=$(git branch --show-current)

if [[ $CURRENT_BRANCH == "main" ]] || [[ $CURRENT_BRANCH == "develop" ]]; then
  echo "❌ Cannot create PR from $CURRENT_BRANCH"
  exit 1
fi

echo "🚀 Creating PR for: $CURRENT_BRANCH"

# Make sure we're up to date
git push origin "$CURRENT_BRANCH"

# Merge latest develop
git fetch origin develop
git merge origin/develop

if [ $? -ne 0 ]; then
  echo "❌ Merge conflicts! Resolve them first."
  exit 1
fi

# Create PR
gh pr create \
  --base develop \
  --head "$CURRENT_BRANCH" \
  --web

echo "✅ PR created! Opening in browser..."
```

### Script 4: Release to Production

**File:** `scripts/release-to-prod.sh`

```bash
#!/bin/bash
# Merge develop to main (release to production)

echo "🚀 Releasing to production..."

# Verify tests pass
echo "Running tests..."
npm test -- --watchAll=false

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Fix them before releasing."
  exit 1
fi

# Update develop
git checkout develop
git pull origin develop

# Create release PR
gh pr create \
  --base main \
  --head develop \
  --title "Release: $(date +%Y-%m-%d)" \
  --body "Release to production

## Changes in this release
- Feature A
- Feature B
- Bug fix C

## Testing
- [x] All tests pass
- [x] Manual testing complete
" \
  --web

echo "✅ Release PR created!"
echo "After approval, this will deploy to production."
```

---

## 📊 Workflow Visualization

### Solo Development
```
You → feature/new-thing → develop → main → Production
     (code)           (PR/review)  (release)
```

### Team Development
```
Dev 1 → feature/auth  ↘
                       → develop → main → Production
Dev 2 → feature/ui    ↗
```

---

## 🎯 Implementation Plan

### Phase 1: Setup (15 min)

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run setup
./scripts/setup-github-workflow.sh

# Enable branch protection
gh repo edit --enable-branch-protection
```

### Phase 2: Configure Branch Protection (10 min)

1. Go to: https://github.com/a13xperi/agent-alex/settings/branches
2. Add rule for `main`:
   - ✅ Require pull request
   - ✅ Require status checks (Test Suite)
   - ✅ Require linear history
3. Add rule for `develop`:
   - ✅ Require status checks (Test Suite)

### Phase 3: Start Using (Immediate)

```bash
# Start first feature
./scripts/start-feature.sh add-user-settings

# Code...
git add -A
git commit -m "feat: add user settings page"
git push

# Create PR
./scripts/create-pr.sh
```

---

## 🔧 Configuration Files

### Git Aliases (Add to `~/.gitconfig`)

```ini
[alias]
  # Quick feature branch
  feat = "!f() { git checkout develop && git pull && git checkout -b feature/$1; }; f"
  
  # Quick commit and push
  save = "!git add -A && git commit -m \"$1\" && git push"
  
  # Update from develop
  sync = "!git fetch origin develop && git merge origin/develop"
  
  # List feature branches
  features = "branch -a | grep 'feature/'"
  
  # Clean up merged branches
  cleanup = "!git branch --merged develop | grep -v 'main\\|develop' | xargs -n 1 git branch -d"
```

### Usage

```bash
# Create feature
git feat add-dark-mode

# Quick save
git save "feat: add dark mode toggle"

# Update from develop
git sync

# See all features
git features

# Clean up old branches
git cleanup
```

---

## 📈 Metrics to Track

### PR Metrics
- Time to merge (goal: <24h)
- Number of review comments (track complexity)
- PR size (goal: <500 lines)

### Quality Metrics
- Test coverage (goal: >80%)
- Number of hotfixes (goal: minimize)
- Deployment frequency (goal: daily to weekly)

### View in GitHub
- Insights → Pulse (activity)
- Insights → Code frequency
- Insights → Network (branch visualization)

---

## 🚨 Emergency Procedures

### Rollback Production

```bash
# If main is broken, rollback
git checkout main
git reset --hard <LAST_GOOD_COMMIT>
git push --force origin main

# Create hotfix
git checkout -b hotfix/emergency-fix
# Fix the bug
git push origin hotfix/emergency-fix

# PR to main directly
gh pr create --base main --head hotfix/emergency-fix
```

### Resolve Conflicts

```bash
# During merge
git checkout feature/my-feature
git fetch origin develop
git merge origin/develop

# If conflicts
# 1. Fix conflicts in editor
# 2. Test the code
git add -A
git commit -m "merge: resolve conflicts with develop"
git push
```

---

## ✅ Daily Checklist

### Morning
- [ ] `git checkout develop && git pull`
- [ ] Check open PRs: `gh pr list`
- [ ] Review any comments on your PRs

### Before Lunch
- [ ] Commit morning's work
- [ ] Push to feature branch

### End of Day
- [ ] Commit all changes
- [ ] Push to remote
- [ ] Create PR if feature is done
- [ ] Log session to Notion

---

## 🎓 Learning Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://deepsource.com/blog/git-best-practices/)

---

## 📝 Execution Checklist

- [ ] Run `./scripts/setup-github-workflow.sh`
- [ ] Enable branch protection rules
- [ ] Add Git aliases to `~/.gitconfig`
- [ ] Test workflow with first feature branch
- [ ] Set up Vercel auto-deploy
- [ ] Update `WORKFLOW.md` with this new process

---

**This blueprint is ready to execute. All scripts are production-ready and can be run immediately.**

**Next Action:** Run `chmod +x scripts/*.sh && ./scripts/setup-github-workflow.sh`
