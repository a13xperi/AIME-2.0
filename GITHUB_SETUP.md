# 🐙 GitHub Repository Setup

Follow these steps to create your GitHub repository for Agent Alex.

---

## 📋 Option 1: Create via GitHub Website (Easiest)

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name:** `agent-alex`
   - **Description:** "AI Work Session & Project Tracker - Track all projects and resume work with full context"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click **"Create repository"**

### Step 2: Connect Your Local Repository

GitHub will show you instructions. Run these commands in your terminal:

```bash
# Navigate to your project
cd "/Users/alex/Agent Alex/agent-alex"

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/agent-alex.git

# Push your code
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 📋 Option 2: Create via GitHub CLI (Advanced)

If you have GitHub CLI installed:

```bash
# Navigate to your project
cd "/Users/alex/Agent Alex/agent-alex"

# Create repository and push
gh repo create agent-alex --public --source=. --remote=origin --push

# Or for private repository
gh repo create agent-alex --private --source=. --remote=origin --push
```

---

## ✅ Verify Repository Setup

After pushing, verify everything worked:

### Check GitHub

1. Visit: `https://github.com/YOUR_USERNAME/agent-alex`
2. You should see all your files
3. README.md should display on the repository page

### Check Local Connection

```bash
# Check remote is connected
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/agent-alex.git (fetch)
# origin  https://github.com/YOUR_USERNAME/agent-alex.git (push)
```

---

## 🎯 Next Steps

### Add Repository Secrets (for Deployment)

If you plan to deploy with GitHub Actions:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `NOTION_API_KEY` - Your Notion integration token
   - `NOTION_PROJECTS_DATABASE_ID` - Your projects database ID
   - `NOTION_SESSIONS_DATABASE_ID` - Your sessions database ID

### Add Topics

Make your repository more discoverable:

1. Go to your repository
2. Click the gear icon next to "About"
3. Add topics:
   - `notion`
   - `notion-api`
   - `project-management`
   - `ai-tools`
   - `session-tracking`
   - `react`
   - `typescript`

### Update README

Update the repository URL in your README.md:

```bash
# Edit README.md and replace YOUR_USERNAME with your actual username
```

---

## 🔗 Clone on Another Machine

To work on Agent Alex from another computer:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/agent-alex.git

# Navigate into it
cd agent-alex

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Notion credentials
nano .env

# Start the app
npm run dev
```

---

## 📝 Git Workflow

### Making Changes

```bash
# Make your changes to the code

# Stage changes
git add .

# Commit with a descriptive message
git commit -m "Add feature: session filtering"

# Push to GitHub
git push
```

### Checking Status

```bash
# See what files have changed
git status

# See commit history
git log --oneline
```

---

## 🎉 Repository Created!

Your Agent Alex project is now on GitHub! 🚀

**Repository URL:** `https://github.com/YOUR_USERNAME/agent-alex`

You can now:
- ✅ Share it with others
- ✅ Clone it on other machines  
- ✅ Set up automatic deployments
- ✅ Track issues and features
- ✅ Collaborate with others

---

**Next:** Continue with [SETUP_GUIDE.md](./SETUP_GUIDE.md) to run the application!

