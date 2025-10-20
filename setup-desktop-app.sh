#!/bin/bash

# Agent Alex Desktop App Setup Script
echo "🤖 Setting up Agent Alex Desktop App..."

# Get the current directory
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESKTOP_APP="$CURRENT_DIR/desktop-app.html"

# Create desktop shortcut on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Detected macOS - Creating desktop shortcut..."
    
    # Create a simple app bundle
    APP_NAME="Agent Alex"
    APP_DIR="$HOME/Desktop/$APP_NAME.app"
    
    # Remove existing app if it exists
    if [ -d "$APP_DIR" ]; then
        rm -rf "$APP_DIR"
    fi
    
    # Create app bundle structure
    mkdir -p "$APP_DIR/Contents/MacOS"
    mkdir -p "$APP_DIR/Contents/Resources"
    
    # Create Info.plist
    cat > "$APP_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>Agent Alex</string>
    <key>CFBundleIdentifier</key>
    <string>com.agentalex.app</string>
    <key>CFBundleName</key>
    <string>Agent Alex</string>
    <key>CFBundleVersion</key>
    <string>2.0</string>
    <key>CFBundleShortVersionString</key>
    <string>2.0</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.14</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

    # Create executable script
    cat > "$APP_DIR/Contents/MacOS/Agent Alex" << EOF
#!/bin/bash
open "$DESKTOP_APP"
EOF

    # Make executable
    chmod +x "$APP_DIR/Contents/MacOS/Agent Alex"
    
    echo "✅ Desktop app created at: $APP_DIR"
    echo "🎯 You can now double-click 'Agent Alex' on your desktop to launch!"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected Linux - Creating desktop shortcut..."
    
    # Create .desktop file
    DESKTOP_FILE="$HOME/Desktop/agent-alex.desktop"
    
    cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Agent Alex
Comment=AI Work Session & Project Tracker
Exec=xdg-open "$DESKTOP_APP"
Icon=applications-development
Terminal=false
Categories=Development;Productivity;
EOF

    chmod +x "$DESKTOP_FILE"
    
    echo "✅ Desktop shortcut created at: $DESKTOP_FILE"
    echo "🎯 You can now double-click 'Agent Alex' on your desktop to launch!"
    
else
    echo "❓ Unsupported OS. Please manually open: $DESKTOP_APP"
fi

echo ""
echo "🚀 Agent Alex Desktop App Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Double-click the 'Agent Alex' icon on your desktop"
echo "2. Click '🚀 Launch Agent Alex' to open the production version"
echo "3. Or click '💻 Local Development' for local development"
echo ""
echo "🔗 Production URL: https://agent-alex-xyz.vercel.app"
echo "💻 Local URL: http://localhost:3001"
echo ""
echo "✨ Enjoy tracking your AI work sessions!"
