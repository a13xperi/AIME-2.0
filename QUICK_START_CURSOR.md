# Quick Start: Open AIME-2.0 in Cursor

## 🚀 Fastest Method

### Option 1: Double-click Workspace File
1. In Finder, navigate to: `/Users/alex/KAA app/AIME-2.0`
2. Double-click: `AIME-2.0.code-workspace`
3. This should open the workspace in Cursor

### Option 2: Drag & Drop
1. Open Finder to: `/Users/alex/KAA app/AIME-2.0`
2. Drag the `AIME-2.0` folder onto the Cursor icon in your dock
3. Cursor will ask to open it - click "Yes"

### Option 3: File Menu
1. In Cursor: **File > Open Folder...** (or `Cmd+O`)
2. Navigate to: `/Users/alex/KAA app/AIME-2.0`
3. Click "Open"

### Option 4: Command Line (if cursor command exists)
```bash
cd "/Users/alex/KAA app/AIME-2.0"
cursor .
```

## ✅ Verify It Worked

After opening, check:
1. **Bottom-left corner** shows `AIME-2.0` or folder name
2. **File explorer** shows:
   - `backend/`
   - `contracts/`
   - `src/`
   - `putt-solver-service/`
   - etc.
3. **Terminal** (`Ctrl+``) shows:
   ```bash
   $ pwd
   /Users/alex/KAA app/AIME-2.0
   ```

## 📝 What This Changes

- ✅ Cursor workspace root → `/Users/alex/KAA app/AIME-2.0`
- ✅ File paths in Cursor → relative to AIME-2.0
- ✅ Terminal default directory → AIME-2.0
- ✅ Git operations → work correctly
- ❌ Repository location → **unchanged** (already correct)
- ❌ GitHub remote → **unchanged** (already correct)

## 🎯 Current Status

- **Branch:** `feat/migrate-aime-golf-ai`
- **Status:** All Phase 0 work committed and pushed ✅
- **Remote:** `git@github.com:a13xperi/AIME-2.0.git`
- **Location:** `/Users/alex/KAA app/AIME-2.0`

