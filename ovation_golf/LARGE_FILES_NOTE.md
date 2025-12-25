# Large Files Note

## Files Excluded from Git

The following large files are excluded from git due to GitHub's 100MB file size limit:

- `ovation_golf/builds/PathSolverPlusRTE.zip` (274.84 MB)
- `ovation_golf/builds/OvationGolfPython.zip` (size unknown)
- `ovation_golf/labview/*.zip` files

## Options for Handling Large Files

### Option 1: Git LFS (Recommended)
If you need these files in the repository:
```bash
git lfs install
git lfs track "*.zip"
git add .gitattributes
git add ovation_golf/builds/*.zip ovation_golf/labview/*.zip
git commit -m "Add large build files via Git LFS"
```

### Option 2: Store Separately
- Keep files locally
- Store in cloud storage (S3, Google Drive, etc.)
- Reference in documentation

### Option 3: Rebuild When Needed
- Keep source code in repo
- Rebuild zip files when needed
- Document build process

## Current Status

These files exist locally but are not tracked in git. They are available in:
- `/Users/alex/A13x/AIME/AIME-2.0/ovation_golf/builds/`
- `/Users/alex/A13x/AIME/AIME-2.0/ovation_golf/labview/`



