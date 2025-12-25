#!/bin/bash

# Agent Alex - Vercel Deployment Script
# This script helps you deploy Agent Alex to Vercel

set -e

echo "🚀 Agent Alex Deployment Helper"
echo "================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with:"
    echo "   npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 You need to log in to Vercel first:"
    vercel login
    echo ""
fi

echo "✅ Logged in to Vercel"
echo ""

# Remind about environment variables
echo "⚠️  IMPORTANT: Before deploying, make sure you've set these in Vercel dashboard:"
echo ""
echo "   Go to: https://vercel.com/alex-perls-projects/agent-alex/settings/environment-variables"
echo ""
echo "   Required variables:"
echo "   - NOTION_TOKEN"
echo "   - NOTION_PROJECTS_DATABASE_ID"
echo "   - NOTION_SESSIONS_DATABASE_ID"
echo "   - ALLOWED_ORIGINS (e.g., https://agent-alex.vercel.app)"
echo ""
read -p "Have you set all environment variables? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please set environment variables first, then run this script again."
    exit 1
fi

echo ""
echo "📦 Building locally to check for errors..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful"
echo ""

# Ask about deployment environment
echo "Which environment do you want to deploy to?"
echo "  1) Production (agent-alex.vercel.app)"
echo "  2) Preview (temporary URL for testing)"
read -p "Enter choice (1 or 2): " -n 1 -r
echo ""

if [[ $REPLY == "1" ]]; then
    echo ""
    echo "🚀 Deploying to PRODUCTION..."
    vercel --prod
elif [[ $REPLY == "2" ]]; then
    echo ""
    echo "🚀 Deploying to PREVIEW..."
    vercel
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Test your deployment:"
echo "     curl https://your-url.vercel.app/health"
echo ""
echo "  2. If frontend can't reach API, update REACT_APP_API_URL in Vercel:"
echo "     https://vercel.com/alex-perls-projects/agent-alex/settings/environment-variables"
echo ""
echo "  3. Open your app in browser and test the dashboard"
echo ""
