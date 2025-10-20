#!/bin/bash
# Deploy to Vercel using token

echo "🚀 Deploying Agent Alex to Vercel..."
echo ""

# Check if token is set
if [ -z "$VERCEL_TOKEN" ]; then
  echo "📝 Vercel token not found."
  echo ""
  echo "To get your token:"
  echo "1. Open: https://vercel.com/account/tokens"
  echo "2. Create a new token (name it 'Agent Alex CLI')"
  echo "3. Copy the token"
  echo ""
  read -p "Paste your Vercel token: " VERCEL_TOKEN
  
  if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
  fi
  
  # Save token for future use
  export VERCEL_TOKEN
  echo "export VERCEL_TOKEN=\"$VERCEL_TOKEN\"" >> ~/.zshrc
  echo "✅ Token saved to ~/.zshrc"
fi

echo ""
echo "🔨 Building and deploying..."
echo ""

# Deploy to production
vercel --token=$VERCEL_TOKEN --prod --yes

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment successful!"
  echo ""
  echo "🎉 Your app is live!"
  echo ""
  echo "Next steps:"
  echo "  - Check deployment: vercel ls --token=$VERCEL_TOKEN"
  echo "  - View logs: vercel logs --token=$VERCEL_TOKEN"
else
  echo ""
  echo "❌ Deployment failed!"
  echo "Check the error message above for details."
  exit 1
fi
