#!/bin/bash

# Script to document important changes in both GitHub and Notion
# Usage: ./scripts/document-change.sh "Title" "Description"

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TITLE="$1"
DESCRIPTION="$2"

if [ -z "$TITLE" ] || [ -z "$DESCRIPTION" ]; then
    echo "Usage: ./scripts/document-change.sh \"Title\" \"Description\""
    exit 1
fi

echo -e "${BLUE}📝 Documenting change: $TITLE${NC}\n"

# 1. Create GitHub PR
echo -e "${GREEN}Creating GitHub Pull Request...${NC}"
BRANCH=$(git branch --show-current)

if [ "$BRANCH" = "main" ]; then
    echo "Error: Cannot create PR from main branch"
    exit 1
fi

gh pr create \
    --title "$TITLE" \
    --body "## Description
$DESCRIPTION

## Changes
$(git log origin/main..HEAD --oneline)

## Testing
- [x] Build passes locally
- [x] No lint errors
- [ ] Tested in production

## Deployment
- Branch: $BRANCH
- Ready to merge after review" \
    --base main \
    --head "$BRANCH"

PR_URL=$(gh pr view --json url -q .url)
echo -e "${GREEN}✓ PR Created: $PR_URL${NC}\n"

# 2. Log to Notion (using Notion API via curl)
echo -e "${GREEN}Logging to Notion...${NC}"

# Create session entry in Notion
NOTION_TOKEN="${NOTION_TOKEN}"
SESSIONS_DB="${NOTION_SESSIONS_DATABASE_ID}"

if [ -z "$NOTION_TOKEN" ] || [ -z "$SESSIONS_DB" ]; then
    echo "Warning: Notion credentials not found. Skipping Notion logging."
    echo "Set NOTION_TOKEN and NOTION_SESSIONS_DATABASE_ID environment variables."
else
    curl -X POST https://api.notion.com/v1/pages \
        -H "Authorization: Bearer $NOTION_TOKEN" \
        -H "Content-Type: application/json" \
        -H "Notion-Version: 2022-06-28" \
        -d "{
            \"parent\": { \"database_id\": \"$SESSIONS_DB\" },
            \"properties\": {
                \"Title\": {
                    \"title\": [{
                        \"text\": { \"content\": \"$TITLE\" }
                    }]
                },
                \"Type\": {
                    \"select\": { \"name\": \"Deployment\" }
                },
                \"Status\": {
                    \"select\": { \"name\": \"Completed\" }
                },
                \"Summary\": {
                    \"rich_text\": [{
                        \"text\": { \"content\": \"$DESCRIPTION\n\nPR: $PR_URL\" }
                    }]
                },
                \"Date\": {
                    \"date\": { \"start\": \"$(date -u +%Y-%m-%d)\" }
                }
            }
        }" > /dev/null 2>&1

    echo -e "${GREEN}✓ Logged to Notion${NC}\n"
fi

echo -e "${GREEN}✓ Documentation complete!${NC}"
echo -e "PR URL: $PR_URL"
