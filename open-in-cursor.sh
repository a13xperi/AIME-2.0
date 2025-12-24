#!/bin/bash
# Script to open AIME-2.0 in Cursor

AIME_DIR="/Users/alex/KAA app/AIME-2.0"

echo "Opening AIME-2.0 in Cursor..."
echo "Directory: $AIME_DIR"

# Try to open with Cursor (if cursor command exists)
if command -v cursor &> /dev/null; then
    cursor "$AIME_DIR"
    echo "✅ Opened in Cursor via command line"
elif command -v code &> /dev/null; then
    code "$AIME_DIR"
    echo "✅ Opened in VS Code (Cursor may use 'code' command)"
else
    # Open in Finder and provide instructions
    open "$AIME_DIR"
    echo ""
    echo "📋 Manual steps:"
    echo "1. In Cursor, go to: File > Open Folder..."
    echo "2. Navigate to: $AIME_DIR"
    echo "3. Click 'Open'"
fi
