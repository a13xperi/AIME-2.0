# 🚀 Agent Alex - Complete Setup Guide

**Welcome to Agent Alex!** Follow this guide to get everything set up from scratch.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Install Dependencies](#install-dependencies)
4. [Set Up Notion](#set-up-notion)
5. [Configure Environment](#configure-environment)
6. [Run the Application](#run-the-application)
7. [Next Steps](#next-steps)

---

## ✅ Prerequisites

Before you begin, make sure you have:

- **Node.js** 16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Notion account** ([Sign up](https://notion.so))
- **Git** installed ([Download](https://git-scm.com/))
- **Text editor** (VS Code recommended)

---

## 📥 Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/agent-alex.git

# Navigate into the project
cd agent-alex
```

---

## 📦 Install Dependencies

```bash
# Install all npm packages
npm install

# This installs both frontend and backend dependencies
```

Expected output:
```
added 1397 packages in 45s
```

---

## 🗄️ Set Up Notion

Follow the detailed **[Notion Database Setup Guide](./NOTION_DATABASE_SETUP.md)** to:

1. ✅ Create Notion integration
2. ✅ Set up Projects database
3. ✅ Set up Sessions database
4. ✅ Share databases with integration
5. ✅ Get database IDs

**This is the most important step!** Take your time here.

---

## ⚙️ Configure Environment

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   ```bash
   # On Mac/Linux
   nano .env
   
   # Or open in your text editor
   code .env
   ```

3. **Fill in your values:**
   ```env
   # From Notion integration page
   NOTION_API_KEY=secret_YOUR_INTEGRATION_TOKEN_HERE
   
   # From your Projects database URL
   NOTION_PROJECTS_DATABASE_ID=your_projects_database_id
   
   # From your Sessions database URL
   NOTION_SESSIONS_DATABASE_ID=your_sessions_database_id
   
   # Keep these defaults for local development
   REACT_APP_API_URL=http://localhost:3001
   PORT=3001
   NODE_ENV=development
   ```

4. **Save the file** (Ctrl+O, Enter, Ctrl+X in nano)

---

## 🚀 Run the Application

### Development Mode (Recommended)

Run both frontend and backend together:

```bash
npm run dev
```

This starts:
- **Frontend** on http://localhost:3000 (React app)
- **Backend** on http://localhost:3001 (API server)

### Separate Terminals (Alternative)

**Terminal 1 - Frontend:**
```bash
npm start
```

**Terminal 2 - Backend:**
```bash
npm run server:dev
```

---

## 🎉 Access the Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the Agent Alex dashboard!

---

## ✅ Verify Everything Works

### Test 1: Health Check

Visit: http://localhost:3001/health

Expected response:
```json
{
  "status": "ok",
  "message": "Agent Alex API is running"
}
```

### Test 2: Notion Connection

Check the server terminal output for:
```
🚀 Agent Alex API server running on port 3001
📊 Health check: http://localhost:3001/health
🔗 Notion integration: Configured
```

### Test 3: Dashboard Loads

The dashboard at http://localhost:3000 should show:
- "Agent Alex" header
- Dashboard statistics
- "New Project" and "Log Session" buttons
- Your projects (or empty state if none yet)

---

## 🎯 Next Steps

Now that Agent Alex is running:

### 1. Create Your First Project

Click **"+ New Project"** and fill in:
- Project name (e.g., "KAA App")
- Description
- Status (Active)
- Type (Web Application)
- Tech stack

### 2. Log Your First Session

Click **"📝 Log Session"** and fill in:
- Session title (e.g., "Initial setup")
- Project (select from list)
- What you accomplished
- Next steps

### 3. Explore Features

- View project details
- See session history
- Use the resume feature
- Filter and search projects

---

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run server:dev` | Start backend with auto-reload |
| `npm run dev` | Start both frontend and backend |
| `npm test` | Run tests |
| `npm run build` | Build for production |

---

## 📚 Additional Documentation

- **[README.md](./README.md)** - Project overview and features
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture
- **[NOTION_DATABASE_SETUP.md](./NOTION_DATABASE_SETUP.md)** - Detailed Notion setup

---

## 🆘 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Or change the port in package.json
```

### Issue: "Notion integration not working"

**Solution:**
1. Verify `.env` file exists and has correct values
2. Check that databases are shared with integration
3. Ensure database IDs are correct (no dashes, no extra characters)
4. Restart the server after changing `.env`

### Issue: "Dashboard shows empty"

**Solution:**
1. Check server is running (http://localhost:3001/health)
2. Check browser console for errors (F12)
3. Verify Notion databases have correct schema
4. Try creating a project manually in Notion first

---

## 🚀 Deployment (Optional)

When you're ready to deploy:

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Backend (Vercel Serverless)

The backend can also deploy to Vercel as serverless functions.
See [Vercel documentation](https://vercel.com/docs) for details.

---

## 🤝 Need Help?

- Check the [Architecture documentation](./ARCHITECTURE.md)
- Review the [Notion setup guide](./NOTION_DATABASE_SETUP.md)
- Check server logs for error messages
- Verify all prerequisites are installed

---

## ✅ Setup Complete!

You should now have:
- ✅ Agent Alex running locally
- ✅ Notion integration working
- ✅ Projects and Sessions databases set up
- ✅ Ability to track your AI work sessions

**Happy tracking!** 🤖

---

**Last Updated:** October 17, 2025  
**Version:** 1.0

