#!/bin/bash
# Quick feature branch creation

if [ -z "$1" ]; then
  echo "Usage: ./scripts/start-feature.sh <feature-name>"
  echo ""
  echo "Examples:"
  echo "  ./scripts/start-feature.sh add-dark-mode"
  echo "  ./scripts/start-feature.sh fix-login-bug"
  echo "  ./scripts/start-feature.sh improve-dashboard"
  exit 1
fi

FEATURE_NAME=$1

echo "🚀 Starting new feature: $FEATURE_NAME"
echo ""

# Update develop
echo "Updating develop branch..."
git checkout develop
git pull origin develop

# Create feature branch
echo "Creating feature/$FEATURE_NAME..."
git checkout -b "feature/$FEATURE_NAME"
git push -u origin "feature/$FEATURE_NAME"

echo ""
echo "✅ Feature branch created: feature/$FEATURE_NAME"
echo ""
echo "📝 Next steps:"
echo "  1. Start coding!"
echo "  2. Commit often: git add -A && git commit -m 'message'"
echo "  3. Push regularly: git push"
echo "  4. When done: ./scripts/create-pr.sh"
