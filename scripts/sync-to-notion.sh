#!/bin/bash
# Sync current GitHub state to Notion
# Usage: ./scripts/sync-to-notion.sh [commit-message]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Syncing to Notion...${NC}"

# Get git info
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
COMMIT_MSG=$(git log -1 --pretty=%B 2>/dev/null || echo "No commit message")
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
REPO_URL=$(git config --get remote.origin.url 2>/dev/null || echo "unknown")

# Get changed files
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "No changes")
NEW_FILES=$(git ls-files --others --exclude-standard 2>/dev/null || echo "")

# Create summary
SUMMARY="## GitHub Sync - $(date '+%Y-%m-%d %H:%M:%S')

**Branch:** \`${BRANCH}\`
**Commit:** \`${COMMIT_HASH}\`
**Message:** ${COMMIT_MSG}

### Changed Files
\`\`\`
${CHANGED_FILES}
\`\`\`

### New Files
\`\`\`
${NEW_FILES}
\`\`\`

**Repository:** ${REPO_URL}
"

echo -e "${GREEN}✅ Git info collected${NC}"
echo ""
echo "Summary:"
echo "$SUMMARY"
echo ""
echo -e "${BLUE}💡 To update Notion manually:${NC}"
echo "1. Open your Notion workspace"
echo "2. Find the AIME project page"
echo "3. Add this summary as a new block"
echo ""
echo -e "${BLUE}💡 Or use Notion MCP in Cursor to update programmatically${NC}"

# Save to file for easy copy-paste
echo "$SUMMARY" > /tmp/notion-sync-summary.md
echo -e "${GREEN}✅ Summary saved to /tmp/notion-sync-summary.md${NC}"
echo -e "${BLUE}📋 You can copy this file content to Notion${NC}"

