# Deploy Agent Alex - Quick Start

## What's Been Fixed
The deployment was using **deprecated Vercel config from 2020**. It's now fixed and ready to deploy.

## Deploy in 3 Steps

### 1️⃣ Set Environment Variables (One Time)
Open: https://vercel.com/alex-perls-projects/agent-alex/settings/environment-variables

Add these 4 variables for **all environments** (Production, Preview, Development):

```bash
# Copy values from your local .env file
NOTION_TOKEN=<your_token>
NOTION_PROJECTS_DATABASE_ID=<your_db_id>
NOTION_SESSIONS_DATABASE_ID=<your_db_id>
ALLOWED_ORIGINS=https://agent-alex.vercel.app,http://localhost:3000
```

To see your local values:
```bash
cat .env
```

### 2️⃣ Deploy
```bash
./scripts/deploy.sh
```

Or manually:
```bash
vercel --prod
```

### 3️⃣ Test
```bash
# Replace with your actual URL from deployment output
curl https://agent-alex.vercel.app/health
```

Should return:
```json
{"status":"ok","message":"Agent Alex API is running"}
```

## That's It!

Your app will be live at: **https://agent-alex.vercel.app**

## If Something Goes Wrong

### "Missing environment variable"
→ Check Vercel dashboard, make sure all 4 vars are set

### "CORS error"
→ Add your Vercel URL to `ALLOWED_ORIGINS` in Vercel settings

### "Can't connect to API"
→ Add `REACT_APP_API_URL=https://agent-alex.vercel.app` to Vercel env vars

### Still not working?
→ Check deployment logs: `vercel logs`

---

**Questions?** Read `DEPLOYMENT.md` for full details.
