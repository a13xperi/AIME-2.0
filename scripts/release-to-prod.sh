#!/bin/bash
# Merge develop to main (release to production)

echo "🚀 Preparing production release..."
echo ""

# Verify tests pass
echo "Running tests..."
npm test -- --watchAll=false --passWithNoTests

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Tests failed! Fix them before releasing."
  exit 1
fi

echo ""
echo "✅ Tests passed!"
echo ""

# Update develop
echo "Updating develop branch..."
git checkout develop
git pull origin develop

# Create release PR
echo "Creating release PR..."
gh pr create \
  --base main \
  --head develop \
  --title "Release: $(date +%Y-%m-%d)" \
  --body "## Production Release

### Changes in this release
<!-- List major features and fixes -->

### Testing
- [x] All tests pass
- [x] Manual testing complete

### Deployment
This PR will automatically deploy to production when merged.
" \
  --web

echo ""
echo "✅ Release PR created!"
echo ""
echo "📝 Next steps:"
echo "  1. Review the PR on GitHub"
echo "  2. Once approved and merged, it will auto-deploy to production"
echo "  3. Monitor https://github.com/a13xperi/agent-alex/actions for deployment status"
