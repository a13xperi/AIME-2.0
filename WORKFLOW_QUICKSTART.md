# GitHub Workflow - Quick Start

**Ready to execute in 3 commands!**

---

## 🚀 Initial Setup (One Time - 5 minutes)

```bash
# 1. Run the setup script
cd "/Users/alex/Agent Alex/agent-alex"
./scripts/setup-github-workflow.sh

# 2. Configure branch protection (manual)
# Visit: https://github.com/a13xperi/agent-alex/settings/branches
# Add rules for 'main' and 'develop' (see GITHUB_WORKFLOW_BLUEPRINT.md)

# Done! You're ready to start using the workflow.
```

---

## 📋 Daily Usage (3 commands)

### Starting New Work

```bash
# Create and switch to feature branch
./scripts/start-feature.sh add-dark-mode
```

### While Coding

```bash
# Commit often (every 30-60 min)
git add -A && git commit -m "feat: add dark mode toggle"
git push
```

### Finished Feature

```bash
# Create pull request
./scripts/create-pr.sh
```

**That's it!** Approve the PR on GitHub and merge.

---

## 🎯 Workflow Cheat Sheet

| Task | Command |
|------|---------|
| Start feature | `./scripts/start-feature.sh my-feature` |
| Commit changes | `git add -A && git commit -m "message"` |
| Push changes | `git push` |
| Create PR | `./scripts/create-pr.sh` |
| Release to prod | `./scripts/release-to-prod.sh` |
| Check PRs | `gh pr list` |
| Update from develop | `git fetch origin develop && git merge origin/develop` |

---

## 🌿 Branch Flow

```
main (production)
  ↑
  PR + approval
  ↑
develop (staging)
  ↑
  PR + tests pass
  ↑  
feature/my-feature (your work)
```

---

## 📝 Commit Message Format

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
test: add tests
refactor: improve code
```

---

## 🎬 Example: Build a Complete Feature

```bash
# 1. Start
./scripts/start-feature.sh user-authentication

# 2. Code
# ... make changes ...

# 3. Commit
git add -A
git commit -m "feat: add login form"
git push

# 4. More work
# ... more changes ...
git add -A
git commit -m "feat: add JWT token handling"
git push

# 5. Create PR
./scripts/create-pr.sh

# 6. Review & merge on GitHub
# Feature is now in develop!

# 7. Release to production (when ready)
./scripts/release-to-prod.sh
```

---

## 🚨 Common Scenarios

### I have merge conflicts

```bash
# Fix conflicts in your editor
git add -A
git commit -m "merge: resolve conflicts"
git push
./scripts/create-pr.sh  # Try again
```

### I want to update my feature from develop

```bash
git fetch origin develop
git merge origin/develop
git push
```

### I need to rollback production

```bash
git checkout main
git reset --hard <GOOD_COMMIT_HASH>
git push --force origin main
```

---

## 📚 Full Documentation

- **Blueprint:** `GITHUB_WORKFLOW_BLUEPRINT.md` - Complete workflow specification
- **Workflow:** `WORKFLOW.md` - General development workflow
- **Scripts:** `scripts/` - All automation scripts

---

## ✅ You're Ready!

**Next action:** Run `./scripts/setup-github-workflow.sh` to get started.

Then start your first feature with:
```bash
./scripts/start-feature.sh my-first-feature
```
