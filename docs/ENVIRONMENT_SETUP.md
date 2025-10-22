# Environment Configuration Guide

This guide explains how to set up and manage environment variables for Agent Alex.

---

## 📋 Quick Start

### 1. Copy the Example File
```bash
cp .env.example .env
```

### 2. Fill in Your Values
Edit `.env` and add your actual Notion credentials:
```bash
NOTION_TOKEN=secret_xxxxxxxxxxxxx
NOTION_PROJECTS_DATABASE_ID=xxxxxxxxxxxxxxxx
NOTION_SESSIONS_DATABASE_ID=xxxxxxxxxxxxxxxx
```

### 3. Validate Configuration
```bash
node scripts/validate-env.js
```

---

## 🔐 Required Variables

### Notion Integration
- **`NOTION_TOKEN`** - Your Notion integration token
  - Get it from: https://www.notion.so/my-integrations
  - Format: `secret_xxxxxxxxxxxxxxxxxxxxxxxxx`
  
- **`NOTION_PROJECTS_DATABASE_ID`** - Projects database ID
  - Find it in your Notion database URL
  - Format: 32-character hex string
  
- **`NOTION_SESSIONS_DATABASE_ID`** - Sessions database ID
  - Find it in your Notion database URL
  - Format: 32-character hex string

### API Configuration
- **`REACT_APP_API_URL`** - Backend API endpoint
  - Development: `http://localhost:3001`
  - Production: `https://your-app.vercel.app`

---

## ⚙️ Optional Variables

### Server Configuration
- **`PORT`** - Backend server port (default: 3001)
- **`NODE_ENV`** - Environment mode (development/production/test)

### CORS Configuration
- **`ALLOWED_ORIGINS`** - Comma-separated allowed origins
  - Development: `http://localhost:3000,http://localhost:3001`
  - Production: Add your Vercel domain

---

## 🌍 Environment-Specific Files

### `.env` (Local Development)
```bash
# Your personal .env file
# ❌ NEVER commit this to git!
NOTION_TOKEN=secret_your_real_token
NOTION_PROJECTS_DATABASE_ID=your_real_db_id
NOTION_SESSIONS_DATABASE_ID=your_real_db_id
REACT_APP_API_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### `.env.development` (Development Defaults)
```bash
# Committed to git
# Contains default values for development
# Real secrets still come from .env
REACT_APP_API_URL=http://localhost:3001
NODE_ENV=development
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### `.env.production` (Production Template)
```bash
# Committed to git
# Template for production configuration
# Real values set in Vercel dashboard
NODE_ENV=production
# Set these in Vercel environment variables:
# NOTION_TOKEN
# NOTION_PROJECTS_DATABASE_ID
# NOTION_SESSIONS_DATABASE_ID
# REACT_APP_API_URL
# ALLOWED_ORIGINS
```

---

## 🚀 Deployment (Vercel)

### Setting Environment Variables

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Settings → Environment Variables

2. **Add Variables**
   ```
   NOTION_TOKEN = secret_xxxxxxxxxxxxx
   NOTION_PROJECTS_DATABASE_ID = xxxxxxxxxxxxxxxx
   NOTION_SESSIONS_DATABASE_ID = xxxxxxxxxxxxxxxx
   NODE_ENV = production
   REACT_APP_API_URL = https://your-app.vercel.app
   ALLOWED_ORIGINS = https://your-app.vercel.app
   ```

3. **Select Environments**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Redeploy**
   - Vercel will use these variables on next deployment

---

## ✅ Validation Script

### Usage
```bash
# Validate all variables
node scripts/validate-env.js

# Validate only server variables
node scripts/validate-env.js server

# Validate only client variables
node scripts/validate-env.js client
```

### What It Checks
- ✅ All required variables are set
- ⚠️  Warns about missing optional variables
- ℹ️  Shows current configuration

### Example Output
```bash
✅ Environment validation passed!
   Environment: development
   Port: 3001
   Notion: Configured
   API URL: http://localhost:3001
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Use `.env` for local secrets
- Set production secrets in Vercel dashboard
- Use `.env.development` for non-sensitive defaults
- Validate environment before starting

### ❌ DON'T:
- Commit `.env` to git
- Put real secrets in `.env.example`
- Share your `NOTION_TOKEN`
- Use development URLs in production

---

## 🐛 Troubleshooting

### "Missing required environment variables"
**Solution:** Make sure your `.env` file exists and contains all required variables
```bash
cp .env.example .env
# Edit .env with your values
```

### "CORS error in development"
**Solution:** Make sure `ALLOWED_ORIGINS` includes localhost
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### "API requests fail in production"
**Solution:** Update `REACT_APP_API_URL` to your Vercel URL
```bash
REACT_APP_API_URL=https://your-app.vercel.app
```

### "Environment variables not updating"
**Solution:** Restart your dev server after changing `.env`
```bash
# Stop server (Ctrl+C)
npm run dev  # Restart
```

---

## 📚 Additional Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## 🔄 Environment File Priority

When you run the app, environment variables are loaded in this order (later overrides earlier):

1. `.env.development` / `.env.production` (defaults)
2. `.env` (your local secrets)
3. System environment variables
4. Command line

This means your `.env` file always wins over the committed defaults.
