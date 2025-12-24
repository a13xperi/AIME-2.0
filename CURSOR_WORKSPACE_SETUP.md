# Cursor Workspace Setup for AIME-2.0

## Current Situation
- **Repository Location:** `/Users/alex/KAA app/AIME-2.0`
- **GitHub Remote:** `git@github.com:a13xperi/AIME-2.0.git`
- **Current Branch:** `feat/migrate-aime-golf-ai`
- **Status:** All Phase 0 work committed and pushed ✅

## Problem
Cursor is currently using `/Users/alex/KAA app/KAA app` as the workspace root, but all AIME-2.0 work is in `/Users/alex/KAA app/AIME-2.0`.

## Solution: Change Cursor Workspace

### Option 1: Open Folder in Cursor (Recommended)
1. In Cursor, go to **File > Open Folder...** (or `Cmd+O` on Mac)
2. Navigate to: `/Users/alex/KAA app/AIME-2.0`
3. Click "Open"
4. Cursor will now use AIME-2.0 as the workspace root

### Option 2: Use Command Palette
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Open Folder"
3. Select "File: Open Folder..."
4. Navigate to `/Users/alex/KAA app/AIME-2.0`
5. Click "Open"

### Option 3: Drag and Drop
1. Open Finder (Mac) or File Explorer (Windows)
2. Navigate to `/Users/alex/KAA app/AIME-2.0`
3. Drag the `AIME-2.0` folder onto the Cursor window
4. Cursor will ask if you want to open it as a workspace - click "Yes"

## Verify Workspace
After opening the folder, verify:
1. Check the bottom-left corner of Cursor - it should show `AIME-2.0` or the folder name
2. Open the terminal in Cursor (`Ctrl+`` or View > Terminal)
3. Run: `pwd` - should show `/Users/alex/KAA app/AIME-2.0`
4. Run: `git status` - should show you're on `feat/migrate-aime-golf-ai` branch

## Workspace Structure
Once set up correctly, you should see:
```
AIME-2.0/                    ← Workspace root
├── backend/                 ← Python FastAPI backend
├── contracts/               ← Phase 0 contracts
├── course_data/             ← DTM registry
├── docs/                    ← Documentation
├── putt-solver-service/     ← PuttSolver service
├── server/                  ← Express backend
├── src/                     ← React frontend
├── package.json
├── README.md
└── ...
```

## Benefits of Correct Workspace
- ✅ File paths in Cursor will be relative to AIME-2.0
- ✅ Terminal will start in the correct directory
- ✅ Git operations will work correctly
- ✅ File search will be scoped to AIME-2.0
- ✅ IntelliSense will work properly

## Note
The repository location and GitHub remote remain unchanged. Only the Cursor workspace root changes.

