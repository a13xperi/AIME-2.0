# Deployment Guide for Agent Alex

## The Problem (Fixed)

The previous deployment setup was using **deprecated Vercel configuration** that hasn't worked since ~2021. This has been completely rebuilt.

## What Changed

1. **Fixed vercel.json** - Removed deprecated `builds` and `routes`, using modern `rewrites` and `headers`
2. **Created /api directory** - Vercel requires serverless functions in `/api`
3. **Proper Express wrapper** - `/api/index.ts` exports the Express app correctly for Vercel

## One-Time Setup (Do This Once)

### 1. Set Environment Variables in Vercel Dashboard

Go to: https://vercel.com/alex-perls-projects/agent-alex/settings/environment-variables

Add these variables (for **Production**, **Preview**, and **Development**):

```
NOTION_TOKEN=secret_...your_token...
NOTION_PROJECTS_DATABASE_ID=...your_db_id...
NOTION_SESSIONS_DATABASE_ID=...your_db_id...
ALLOWED_ORIGINS=https://agent-alex.vercel.app,http://localhost:3000
```

**Where to get these values:**
- Check your local `.env` file
- Or run: `cat .env` (if you have it)

### 2. Deploy

```bash
# Make sure you're logged in
vercel login

# Deploy to production
vercel --prod
```

That's it. Vercel will:
1. Build the React frontend → `/build`
2. Bundle the Express backend → `/api`
3. Serve everything from one domain

## How It Works Now

**URLs:**
- Frontend: `https://your-app.vercel.app` (static React app)
- Backend: `https://your-app.vercel.app/api/*` (serverless Express)
- Health check: `https://your-app.vercel.app/health`

**File Structure:**
```
/api/index.ts           → Serverless function (wraps Express)
/server/index.ts        → Your Express app
/build/                 → React production build
vercel.json             → Modern Vercel config
```

## Testing After Deployment

```bash
# Get your deployment URL
vercel ls

# Test health endpoint
curl https://your-app.vercel.app/health

# Test API
curl https://your-app.vercel.app/api/projects
```

## Common Issues

### "DEPLOYMENT_NOT_FOUND"
- You haven't deployed yet, or the deployment was deleted
- Solution: Run `vercel --prod`

### "Missing environment variable"
- Check Vercel dashboard → Settings → Environment Variables
- All 3 Notion variables must be set for Production

### Frontend can't reach API
- Update `REACT_APP_API_URL` in Vercel to your deployment URL
- Example: `https://agent-alex.vercel.app`

### CORS errors
- Update `ALLOWED_ORIGINS` in Vercel to include your deployment URL
- Example: `https://agent-alex.vercel.app,http://localhost:3000`

## Local Development (Unchanged)

```bash
# Still works the same
npm run dev
```

## Questions?

1. **Do I need to change my code?** No, the Express app is untouched
2. **Will local dev still work?** Yes, `npm run dev` works exactly the same
3. **What about the old config?** Completely replaced, the old way doesn't work anymore

## Quick Deploy Checklist

- [ ] Set 3 environment variables in Vercel dashboard
- [ ] Run `vercel --prod`
- [ ] Test `https://your-app.vercel.app/health`
- [ ] Update frontend env var `REACT_APP_API_URL` to your deployment URL
- [ ] Test the dashboard in browser
