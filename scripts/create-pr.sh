#!/bin/bash
# Create pull request

CURRENT_BRANCH=$(git branch --show-current)

if [[ $CURRENT_BRANCH == "main" ]] || [[ $CURRENT_BRANCH == "develop" ]]; then
  echo "❌ Cannot create PR from $CURRENT_BRANCH"
  echo "Create a feature branch first: ./scripts/start-feature.sh my-feature"
  exit 1
fi

echo "🚀 Creating PR for: $CURRENT_BRANCH"
echo ""

# Make sure we're up to date
echo "Pushing latest changes..."
git push origin "$CURRENT_BRANCH"

# Merge latest develop
echo "Syncing with develop..."
git fetch origin develop
git merge origin/develop --no-edit

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Merge conflicts detected!"
  echo "Please resolve conflicts, then run:"
  echo "  git add -A"
  echo "  git commit -m 'merge: resolve conflicts with develop'"
  echo "  git push"
  echo "  ./scripts/create-pr.sh"
  exit 1
fi

# Push merge
git push origin "$CURRENT_BRANCH"

# Create PR
echo ""
echo "Creating pull request..."
gh pr create \
  --base develop \
  --head "$CURRENT_BRANCH" \
  --web

echo ""
echo "✅ PR created! Opening in browser..."
