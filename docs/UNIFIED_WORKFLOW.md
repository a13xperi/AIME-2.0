# 🔄 Unified Workflow: Notion ↔ GitHub ↔ Warp ↔ Cursor

**Single Source of Truth (SSOT) for AIME-2.0 Development**

This document defines how to keep Notion, GitHub, Warp, and Cursor all synchronized and working from the same place.

---

## 🎯 Core Principle: GitHub as SSOT

**GitHub is the single source of truth** for all code and documentation. All other tools sync from/to GitHub:

```
GitHub (SSOT)
    ↕
Notion (Documentation & Tasks)
    ↕
Warp (Terminal Commands)
    ↕
Cursor (Code Editor)
```

---

## 📋 Workflow Overview

### 1. **Development Flow** (Code Changes)

```
Cursor/Warp → Git Commit → GitHub → Notion Update
```

**Steps:**
1. Make changes in Cursor or Warp
2. Commit to git: `git add . && git commit -m "feat: description"`
3. Push to GitHub: `git push origin <branch>`
4. Update Notion with session/progress (optional but recommended)

### 2. **Documentation Flow** (Doc Updates)

```
GitHub Docs → Notion Sync → All Tools
```

**Steps:**
1. Update docs in GitHub (e.g., `docs/FIGMA_APP_STRUCTURE.md`)
2. Commit and push to GitHub
3. Update Notion page with summary/link to GitHub doc
4. All tools reference GitHub docs as SSOT

### 3. **Task Management Flow** (Notion ↔ GitHub)

```
Notion Tasks → GitHub Issues → Cursor/Warp
```

**Steps:**
1. Create task in Notion
2. Create corresponding GitHub issue (optional)
3. Work on task in Cursor/Warp
4. Update Notion task status when complete
5. Reference GitHub commit/PR in Notion

---

## 🛠️ Tool-Specific Workflows

### **Cursor (Code Editor)**

**Primary Use:**
- Code editing and development
- File navigation and search
- Git operations via UI
- MCP server integration (Notion, Figma)

**Sync Points:**
- Always pull latest from GitHub before starting work
- Commit frequently with descriptive messages
- Push to GitHub when feature complete
- Use MCP to update Notion after major milestones

**Commands:**
```bash
# Start work session
git pull origin main
git checkout -b feature/name

# During work
git add .
git commit -m "feat: description"

# End work session
git push origin feature/name
```

### **Warp (Terminal)**

**Primary Use:**
- Running services and scripts
- Git operations
- Testing and validation
- Deployment commands

**Sync Points:**
- Run `git status` before starting work
- Use scripts in `scripts/` directory
- Log sessions to Notion via API when complete

**Key Scripts:**
```bash
# Start all services
./start-services.sh

# Deploy to Vercel
./scripts/deploy-vercel.sh

# Create PR
./scripts/create-pr.sh
```

### **Notion (Documentation & Tasks)**

**Primary Use:**
- Project documentation
- Task tracking
- Session logging
- Progress updates

**Sync Points:**
- Update after each GitHub push
- Create tasks from GitHub issues
- Link to GitHub commits/PRs
- Reference GitHub docs as SSOT

**Update Frequency:**
- After major milestones
- End of work sessions
- Weekly progress summaries

### **GitHub (SSOT)**

**Primary Use:**
- Code repository
- Documentation (markdown files)
- Issue tracking
- Pull requests
- CI/CD

**Sync Points:**
- All code changes committed here
- All documentation lives here
- Issues created from Notion tasks
- PRs reference Notion pages

---

## 📝 Standard Work Session Flow

### **Start of Session**

1. **Pull Latest from GitHub**
   ```bash
   git pull origin main
   git checkout -b feature/name  # if new feature
   ```

2. **Check Notion for Current Tasks**
   - Review active tasks
   - Note blockers or dependencies

3. **Open in Cursor**
   - Open workspace
   - Check for linter errors
   - Review recent changes

### **During Session**

1. **Make Changes**
   - Code in Cursor
   - Test in Warp terminal
   - Commit frequently

2. **Update Local Docs** (if needed)
   - Update `docs/` files
   - Keep docs in sync with code

### **End of Session**

1. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin feature/name
   ```

2. **Update Notion**
   - Log session via API or manually
   - Update task status
   - Add progress notes
   - Link to GitHub commit

3. **Create PR** (if feature complete)
   ```bash
   ./scripts/create-pr.sh
   ```

---

## 🔄 Sync Scripts

### **Auto-Sync to Notion**

Create `scripts/sync-to-notion.sh`:

```bash
#!/bin/bash
# Syncs current GitHub state to Notion

# Get latest commit info
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)
BRANCH=$(git branch --show-current)

# Update Notion via API
# (Implementation depends on Notion API setup)
```

### **Auto-Sync from Notion**

Create `scripts/sync-from-notion.sh`:

```bash
#!/bin/bash
# Creates GitHub issues from Notion tasks

# Fetch tasks from Notion API
# Create GitHub issues for new tasks
# Update existing issues from Notion status
```

---

## 📚 Documentation Structure

### **GitHub Docs** (SSOT)
```
docs/
├── FIGMA_APP_STRUCTURE.md      # Figma design docs
├── UNIFIED_WORKFLOW.md         # This file
├── NOTION_TASKS.md             # Task tracking
├── SSOT_AIME_PUTTSOLVER.md     # Technical SSOT
└── ...
```

### **Notion Pages** (Summaries & Links)
- Link to GitHub docs
- High-level summaries
- Task tracking
- Session logs
- Progress updates

### **WARP.md** (Warp-specific)
- Terminal commands
- Service startup
- Development workflow

---

## ✅ Best Practices

### **1. Always Commit Before Switching Tools**
- Don't leave uncommitted work
- Commit messages should be descriptive
- Reference Notion tasks in commit messages

### **2. Keep Docs in GitHub**
- All technical docs in `docs/`
- Notion has summaries and links
- GitHub is the source of truth

### **3. Update Notion After Milestones**
- After completing features
- After pushing to GitHub
- Weekly progress summaries

### **4. Use Consistent Naming**
- Branch names: `feature/name`, `fix/name`, `docs/name`
- Commit messages: Conventional commits format
- Notion pages: Match GitHub doc names

### **5. Link Everything**
- Notion tasks → GitHub issues
- GitHub commits → Notion sessions
- Notion pages → GitHub docs

---

## 🚀 Quick Reference

### **Start New Feature**
```bash
# 1. GitHub
git pull origin main
git checkout -b feature/name

# 2. Notion
# Create task in Notion

# 3. Cursor
# Open workspace, start coding
```

### **Complete Feature**
```bash
# 1. GitHub
git add .
git commit -m "feat: description"
git push origin feature/name
./scripts/create-pr.sh

# 2. Notion
# Update task status
# Log session
# Link to PR
```

### **Update Documentation**
```bash
# 1. Edit docs in GitHub
# Edit files in docs/

# 2. Commit
git add docs/
git commit -m "docs: update documentation"
git push

# 3. Notion
# Update Notion page with summary/link
```

---

## 🔗 Integration Points

### **Notion MCP Server** (Cursor)
- Update pages programmatically
- Create tasks
- Log sessions
- Query databases

### **GitHub API** (All Tools)
- Create issues
- Reference commits
- Link PRs
- Track progress

### **Warp Scripts**
- Service management
- Deployment
- Testing
- Sync operations

---

## 📊 Status Tracking

### **Current State**
- ✅ GitHub: Active repository with all code/docs
- ✅ Notion: MCP server configured
- ✅ Warp: Scripts and workflows documented
- ✅ Cursor: MCP servers (Notion, Figma) configured

### **Sync Status**
- Code: GitHub ↔ Cursor/Warp ✅
- Docs: GitHub (SSOT) → Notion (summaries) ✅
- Tasks: Notion → GitHub issues (manual) ⚠️
- Sessions: Manual Notion updates ⚠️

---

## 🎯 Next Steps

1. ✅ Create unified workflow doc (this file)
2. ⏳ Create sync scripts for automation
3. ⏳ Set up GitHub Actions for auto-sync
4. ⏳ Create Notion templates matching GitHub structure
5. ⏳ Document all integration points

---

**Last Updated:** December 25, 2024  
**Maintained By:** Development Team  
**SSOT:** GitHub Repository

