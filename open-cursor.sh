#!/bin/bash
# Script to open AIME-2.0 workspace in Cursor

WORKSPACE_FILE="/Users/alex/A13x/AIME/AIME-2.0/AIME-2.0.code-workspace"
WORKSPACE_DIR="/Users/alex/A13x/AIME/AIME-2.0"

echo "Opening AIME-2.0 workspace in Cursor..."

# Try different methods
if command -v cursor &> /dev/null; then
    cursor "$WORKSPACE_DIR"
    echo "✅ Opened via 'cursor' command"
elif [ -d "/Applications/Cursor.app" ]; then
    open -a Cursor "$WORKSPACE_FILE" 2>/dev/null || open -a Cursor "$WORKSPACE_DIR"
    echo "✅ Opened via 'open' command"
else
    # Find Cursor app
    CURSOR_APP=$(mdfind -name "Cursor.app" 2>/dev/null | head -1)
    if [ -n "$CURSOR_APP" ]; then
        open -a "$CURSOR_APP" "$WORKSPACE_FILE" 2>/dev/null || open -a "$CURSOR_APP" "$WORKSPACE_DIR"
        echo "✅ Opened Cursor at: $CURSOR_APP"
    else
        echo "⚠️  Cursor not found. Please open manually:"
        echo "   1. Open Cursor"
        echo "   2. File > Open Folder..."
        echo "   3. Navigate to: $WORKSPACE_DIR"
        echo ""
        echo "Or double-click: $WORKSPACE_FILE"
    fi
fi
