# 🚀 Deploy Agent Alex to Vercel

Complete guide to deploy Agent Alex to Vercel for production use.

---

## 📋 Prerequisites

- ✅ Vercel account (free tier works!)
- ✅ GitHub repository for Agent Alex
- ✅ Notion integration and database IDs

---

## 🎯 Quick Deploy (5 minutes)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy from Project Directory

```bash
cd "/Users/alex/Agent Alex/agent-alex"
vercel
```

**Follow the prompts:**
- Link to existing project? **N** (first time)
- What's your project's name? **agent-alex**
- In which directory is your code located? **./** 
- Want to override settings? **N**

### Step 4: Add Environment Variables

After initial deploy, add your environment variables:

```bash
vercel env add NOTION_API_KEY
# Paste your Notion token: ntn_n10731298373dCAxoia8Tp2pao1YNuBHq3UEeokJURb1xb

vercel env add NOTION_PROJECTS_DATABASE_ID
# Paste: 29003ff6a96d8145a70ec5bf0898d695

vercel env add NOTION_SESSIONS_DATABASE_ID
# Paste: 29003ff6a96d81fd870fc3680b9a7439
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

🎉 **Done!** Your app will be live at `https://agent-alex.vercel.app` (or similar)

---

## 🌐 Alternative: Deploy via Vercel Dashboard

### 1. Push to GitHub

```bash
cd "/Users/alex/Agent Alex/agent-alex"
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `agent-alex` repository
4. Vercel will auto-detect Create React App
5. Click **"Deploy"**

### 3. Add Environment Variables (Dashboard)

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   - `NOTION_API_KEY` = `ntn_n10731298373dCAxoia8Tp2pao1YNuBHq3UEeokJURb1xb`
   - `NOTION_PROJECTS_DATABASE_ID` = `29003ff6a96d8145a70ec5bf0898d695`
   - `NOTION_SESSIONS_DATABASE_ID` = `29003ff6a96d81fd870fc3680b9a7439`
4. Click **"Save"**
5. Redeploy from **Deployments** tab

---

## 🔧 Configuration Files

### vercel.json (Already Created)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    }
  ]
}
```

### api/index.js (Serverless Function)

✅ Already created - handles all API routes as a Vercel serverless function

---

## 📊 What Gets Deployed

### Frontend (React App)
- Static files served from `/build`
- Optimized production build
- Automatic HTTPS
- Global CDN distribution

### Backend (Serverless API)
- `/api/*` routes handled by serverless function
- Auto-scales with traffic
- Cold start ~100-300ms
- No server management needed

---

## 🧪 Testing Deployment

After deployment, test these URLs:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Get projects
curl https://your-app.vercel.app/api/projects

# Frontend
open https://your-app.vercel.app
```

---

## 🔄 Continuous Deployment

Once connected to GitHub:

1. **Push to `main` branch** → Auto-deploys to production
2. **Push to other branches** → Creates preview deployment
3. **Pull requests** → Automatic preview URLs

---

## 🎯 Post-Deployment

### Update Frontend API URL

The app will automatically use the production API when deployed.

### Monitor Your App

- View logs: `vercel logs`
- View analytics in Vercel dashboard
- Set up custom domain (optional)

---

## 💡 Pro Tips

### Custom Domain

```bash
vercel domains add agent-alex.yourdomain.com
```

### View Logs

```bash
vercel logs agent-alex --follow
```

### Rollback Deployment

```bash
vercel rollback
```

### Environment Variables by Environment

```bash
# Production only
vercel env add NOTION_API_KEY production

# Development only
vercel env add NOTION_API_KEY development

# Preview only
vercel env add NOTION_API_KEY preview
```

---

## 🆘 Troubleshooting

### Issue: "Build Failed"

**Fix:** Ensure all dependencies are in `package.json`:
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: "API Routes 404"

**Fix:** Check `vercel.json` rewrites and ensure `api/index.js` exists

### Issue: "Environment Variables Not Working"

**Fix:** 
1. Redeploy after adding env vars
2. Check env vars are set for correct environment (production/preview/development)

### Issue: "Notion API Errors"

**Fix:**
1. Verify Notion token is valid
2. Check database IDs are correct
3. Ensure Notion integration has access to databases

---

## 📈 Performance

**Expected Performance:**
- Frontend (Static): < 100ms response time
- API (Serverless): 100-500ms response time
- Global CDN: Users worldwide get fast access

**Cost:**
- Free tier: 100GB bandwidth, unlimited requests
- More than enough for personal/small team use

---

## 🎉 Success!

Your Agent Alex is now:
- ✅ Deployed to production
- ✅ Auto-scaling
- ✅ Globally distributed
- ✅ HTTPS enabled
- ✅ Connected to Notion

**Share your app URL with your team!** 🚀

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Your Deployment: Check Vercel dashboard after deploy

---

**Next Steps:**
1. Deploy using one of the methods above
2. Test the production URL
3. (Optional) Set up custom domain
4. Start using Agent Alex from anywhere!


