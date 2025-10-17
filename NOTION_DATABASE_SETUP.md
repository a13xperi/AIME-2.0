# 🗄️ Notion Database Setup Guide

Follow these steps to set up your Notion databases for Agent Alex.

---

## 📋 Step 1: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name it: **"Agent Alex"**
4. Select your workspace
5. Click **"Submit"**
6. Copy the **Internal Integration Token** (starts with `secret_`)
7. Save it - you'll need this for your `.env` file

---

## 📊 Step 2: Create Projects Database

### Create the Database

1. In your Notion workspace, create a new page called **"Agent Alex - Projects"**
2. Type `/database` and select **"Database - Full page"**
3. Name the database: **"Projects"**

### Add Properties

Add these properties to your Projects database:

| Property Name | Type | Options |
|--------------|------|---------|
| **Name** | Title | (default) |
| **Description** | Text | - |
| **Status** | Select | Active, Paused, Complete, Archived |
| **Priority** | Select | Critical, High, Medium, Low |
| **Workspace** | Select | KAA, Personal, Client Work, Research, etc. |
| **Type** | Select | Web Application, Mobile App, API/Backend, Infrastructure, Documentation, Library/Package |
| **Started** | Date | - |
| **Last Updated** | Date | - |
| **Current Context** | Text | (Long text enabled) |
| **Repository** | URL | - |
| **Local Path** | Text | - |
| **Deployment URL** | URL | - |
| **Backlog Items** | Number | Format: Number |
| **Status Notes** | Text | (Long text enabled) |
| **Next Steps** | Text | (Long text enabled) |
| **Blockers** | Text | (Long text enabled) |
| **Tech Stack** | Multi-select | React, TypeScript, Node.js, Python, etc. |
| **Tags** | Multi-select | Custom tags |

### Select Options Setup

**Status:**
- 🟢 Active (Green)
- ⏸️ Paused (Yellow)
- ✅ Complete (Blue)
- 📦 Archived (Gray)

**Priority:**
- 🔴 Critical (Red)
- 🟠 High (Orange)
- 🟡 Medium (Yellow)
- 🟢 Low (Green)

---

## 📝 Step 3: Create Sessions Database

### Create the Database

1. In your Notion workspace, create a new page called **"Agent Alex - Sessions"**
2. Type `/database` and select **"Database - Full page"**
3. Name the database: **"Sessions"**

### Add Properties

Add these properties to your Sessions database:

| Property Name | Type | Options |
|--------------|------|---------|
| **Title** | Title | (default) |
| **Date** | Date | Include time |
| **Duration** | Number | Format: Number (minutes) |
| **Project** | Relation | → Projects database |
| **Status** | Select | In Progress, Completed, Paused |
| **Summary** | Text | (Long text enabled) |
| **Files Modified** | Text | (Long text enabled) |
| **Next Steps** | Text | (Long text enabled) |
| **Blockers** | Text | (Long text enabled) |
| **AI Agent** | Text | - |
| **Workspace** | Select | Same as Projects |
| **Type** | Select | Feature Development, Bug Fix, Refactoring, Documentation, Planning, Testing, Deployment |
| **Tags** | Multi-select | Custom tags |

### Select Options Setup

**Status:**
- 🔄 In Progress (Yellow)
- ✅ Completed (Green)
- ⏸️ Paused (Gray)

**Type:**
- ✨ Feature Development (Purple)
- 🐛 Bug Fix (Red)
- 🔧 Refactoring (Blue)
- 📄 Documentation (Green)
- 🎯 Planning (Orange)
- 🧪 Testing (Pink)
- 🚀 Deployment (Teal)

---

## 🔗 Step 4: Set Up Relation

1. In the **Sessions** database, the **Project** property should be a relation
2. Click on the **Project** property settings
3. Select **"Projects"** database as the target
4. Enable **"Show on Projects"** to see sessions on project pages

---

## 🔐 Step 5: Share Databases with Integration

For **both** databases (Projects and Sessions):

1. Open the database page
2. Click **"Share"** in the top right
3. Click **"Invite"**
4. Search for **"Agent Alex"** (your integration name)
5. Click **"Invite"**
6. Ensure it has **"Can edit"** permissions

---

## 📝 Step 6: Get Database IDs

### For Projects Database:

1. Open your Projects database page
2. Copy the URL from your browser
3. The database ID is the part after the last `/` and before the `?`
4. Example: `https://notion.so/YOUR_WORKSPACE/1234567890abcdef?v=...`
5. Database ID: `1234567890abcdef`

### For Sessions Database:

1. Repeat the same process for your Sessions database
2. Copy the database ID

---

## ⚙️ Step 7: Configure Environment Variables

1. Navigate to your Agent Alex project folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and fill in your values:
   ```env
   # Your Notion integration token
   NOTION_API_KEY=secret_YOUR_TOKEN_HERE
   
   # Your Projects database ID (without dashes is fine)
   NOTION_PROJECTS_DATABASE_ID=1234567890abcdef
   
   # Your Sessions database ID (without dashes is fine)
   NOTION_SESSIONS_DATABASE_ID=abcdef1234567890
   
   # API URL (keep default for local development)
   REACT_APP_API_URL=http://localhost:3001
   
   # Server port (keep default)
   PORT=3001
   ```

4. Save the file

---

## ✅ Step 8: Verify Setup

Run this test to verify your Notion integration works:

```bash
# Navigate to your project
cd "/Users/alex/Agent Alex/agent-alex"

# Start the server
npm run server
```

You should see:
```
🚀 Agent Alex API server running on port 3001
📊 Health check: http://localhost:3001/health
🔗 Notion integration: Configured
```

---

## 🎨 Optional: Create Template Pages

### Project Template

Create a template in your Projects database with:
- Default status: "Active"
- Default priority: "Medium"
- Pre-filled sections for context, next steps, blockers

### Session Template

Create a template in your Sessions database with:
- Date pre-filled with today
- Status: "In Progress"
- Prompt sections for summary and next steps

---

## 🚀 You're Ready!

Once you've completed all steps:

1. Your Notion databases are set up ✅
2. Your integration has access ✅
3. Your environment variables are configured ✅
4. You can start using Agent Alex! ✅

**Next steps:**
```bash
# Start both frontend and backend
npm run dev
```

Then open http://localhost:3000 in your browser!

---

## 🆘 Troubleshooting

### "Notion integration not configured"
- Check that your `NOTION_API_KEY` is set in `.env`
- Make sure it starts with `secret_`

### "Database not found"
- Verify database IDs are correct in `.env`
- Ensure you shared the databases with your integration
- Check that integration has "Can edit" permissions

### "Failed to fetch projects"
- Make sure the server is running (`npm run server`)
- Check that database schema matches the guide
- Verify all required properties exist

---

**Setup Complete!** 🎉

