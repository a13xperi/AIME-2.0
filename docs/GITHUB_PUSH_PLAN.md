# GitHub Push & Graphite Setup Plan

## Current Status
- Repository: a13xperi/AIME-2.0
- All testing complete
- Ready for commit and push

## Files to Commit

### Modified Files
1. `course_data/manifests/riverside_2023_20cm.json` - Fixed green_origin_projected_m
2. `backend/.env` - Changed AIME_TRANSFORM_MODE to "real"
3. `backend/routers/solve_putt.py` - Added debug logging

### New Files
1. `public/test-solve-putt.html` - Browser test page
2. `docs/COORDINATE_FIX_COMPLETE.md`
3. `docs/COMPREHENSIVE_TESTING.md`
4. `docs/TESTING_RESULTS.md`
5. `docs/BROWSER_TESTING_STEP_BY_STEP.md`
6. `docs/STEP_BY_STEP_TESTING.md`
7. `docs/NOTION_UPDATE_COMPLETE.md`
8. `docs/GITHUB_PUSH_PLAN.md` (this file)

## Commit Strategy

### Option 1: Single Commit (Simple)
```
feat: complete solve_putt end-to-end testing and coordinate fix

- Fix coordinate transformation (green_origin + real transforms)
- Add comprehensive test documentation
- Create browser test page
- Verify all services working correctly
```

### Option 2: Multiple Commits (Graphite-friendly)
1. `fix: correct green_origin_projected_m in Riverside manifest`
2. `feat: switch to real coordinate transforms`
3. `test: add comprehensive testing documentation`
4. `feat: add browser test page for solve_putt`
5. `docs: update Notion with testing results`

## Graphite Setup

Graphite is a tool for managing stacked PRs. To use it:

1. Install Graphite CLI: `npm install -g @graphite-cli/cli`
2. Initialize: `gt repo init`
3. Create stack: `gt stack create`
4. Create commits: `gt commit create`
5. Sync to GitHub: `gt stack sync`

## Next Steps

1. Review changed files
2. Stage and commit changes
3. Push to GitHub
4. Set up Graphite (optional)
5. Create PR if needed

