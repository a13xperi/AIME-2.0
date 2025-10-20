# 🚀 Agent Alex - Vercel Deployment Guide

## Prerequisites
- [Vercel Account](https://vercel.com/signup) (free tier works great!)
- Git repository pushed to GitHub
- Notion API token and database IDs

---

## Step 1: Prepare Your Repository

Make sure all changes are committed and pushed to GitHub:

```bash
cd "/Users/alex/Agent Alex/agent-alex"
git add .
git commit -m "Add Quick Resume feature and Vercel deployment configuration"
git push origin main
```

---

## Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your `agent-alex` repository from GitHub
4. Vercel will auto-detect it's a React app

---

## Step 3: Configure Build Settings

Vercel should auto-configure, but verify these settings:

- **Framework Preset**: `Create React App`
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

---

## Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

### Required Variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `NOTION_TOKEN` | `ntn_n10731298373dCAxoia8Tp2pao1YNuBHq3UEeokJURb1xb` | Your Notion API token |
| `NOTION_PROJECTS_DATABASE_ID` | `29003ff6a96d8145a70ec5bf0898d695` | Projects database ID |
| `NOTION_SESSIONS_DATABASE_ID` | `29003ff6a96d81fd870fc3680b9a7439` | Sessions database ID |
| `NODE_ENV` | `production` | Production environment |
| `REACT_APP_API_URL` | `https://your-app.vercel.app` | Will be your Vercel URL |

**Note:** For `REACT_APP_API_URL`, first deploy without it (leave as https://localhost:3001), then update it with your actual Vercel URL after the first deployment.

---

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Vercel will give you a URL like: `https://agent-alex-xyz.vercel.app`

---

## Step 6: Update API URL

After your first deployment:

1. Copy your Vercel app URL
2. Go to **Settings** → **Environment Variables**
3. Edit `REACT_APP_API_URL` to your actual Vercel URL
4. Redeploy the app (Vercel will auto-redeploy when you save)

---

## Step 7: Test Your Production App

Visit your Vercel URL and verify:
- ✅ Dashboard loads with all projects
- ✅ Click on a project to see details
- ✅ Click "Resume" button to open Quick Resume modal
- ✅ Stats are accurate
- ✅ Sessions list works

---

## Troubleshooting

### Issue: Blank page or "Failed to load"
**Solution**: Check environment variables are set correctly in Vercel dashboard

### Issue: API errors (500/404)
**Solution**: 
1. Check Vercel function logs (Dashboard → Project → Deployments → Latest → Functions)
2. Verify `NOTION_TOKEN` has access to both databases
3. Make sure database IDs are correct

### Issue: CORS errors
**Solution**: The server is already configured for CORS. If you see errors, check the browser console for specific details.

---

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration steps

---

## Continuous Deployment

Vercel automatically redeploys when you push to your main branch! 🎉

Every `git push` will trigger a new deployment.

---

## Environment Variables Reference

You can update these anytime in Vercel:

```bash
# Backend API Configuration
NOTION_TOKEN=ntn_n10731298373dCAxoia8Tp2pao1YNuBHq3UEeokJURb1xb
NOTION_PROJECTS_DATABASE_ID=29003ff6a96d8145a70ec5bf0898d695
NOTION_SESSIONS_DATABASE_ID=29003ff6a96d81fd870fc3680b9a7439

# Frontend Configuration
REACT_APP_API_URL=https://your-app.vercel.app

# Environment
NODE_ENV=production
PORT=3001
```

---

## Success! 🎉

Your Agent Alex app is now live and accessible from anywhere!

**Next Steps:**
- Share the URL with your team
- Add more projects via Notion
- Use Quick Resume to jump back into any project
- Track all your AI coding sessions

---

## Need Help?

- Check [Vercel Documentation](https://vercel.com/docs)
- View deployment logs in Vercel dashboard
- Check Notion API status at [status.notion.so](https://status.notion.so)


