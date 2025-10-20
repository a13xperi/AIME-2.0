#!/bin/bash
# Setup complete GitHub workflow

echo "🚀 Setting up GitHub workflow..."

# Create develop branch
git checkout -b develop 2>/dev/null || git checkout develop
git push -u origin develop

# Set default branch for new PRs
gh repo edit --default-branch develop

# Create PR template directory
mkdir -p .github

cat > .github/pull_request_template.md <<'EOF'
## What does this PR do?


## Why?


## Changes Made
- [ ] 

## Testing
- [ ] Unit tests pass (`npm test`)
- [ ] Manual testing completed
- [ ] No console errors

## Related Issues
Closes #

## Checklist
- [ ] Code follows conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
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

echo ""
echo "✅ GitHub workflow setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure branch protection: https://github.com/a13xperi/agent-alex/settings/branches"
echo "2. Start your first feature: ./scripts/start-feature.sh my-feature-name"
