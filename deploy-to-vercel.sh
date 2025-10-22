#!/bin/bash

# Agent Alex - Vercel Deployment Script
echo "🚀 Deploying Agent Alex to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Navigate to project directory
cd "$(dirname "$0")"

echo "🔐 Logging into Vercel..."
vercel login

echo "📁 Deploying project..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Copy your Vercel URL from the output above"
echo "2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
echo "3. Add these environment variables:"
echo ""
echo "   NOTION_TOKEN=ntn_n10731298373dCAxoia8Tp2pao1YNuBHq3UEeokJURb1xb"
echo "   NOTION_PROJECTS_DATABASE_ID=29003ff6a96d8145a70ec5bf0898d695"
echo "   NOTION_SESSIONS_DATABASE_ID=29003ff6a96d81fd870fc3680b9a7439"
echo "   NODE_ENV=production"
echo "   REACT_APP_API_URL=https://your-app.vercel.app"
echo ""
echo "4. Update REACT_APP_API_URL with your actual Vercel URL"
echo "5. Redeploy: vercel --prod"
echo ""
echo "🎉 Your Agent Alex app will be live!"


