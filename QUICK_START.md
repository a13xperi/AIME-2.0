# ⚡ Agent Alex - Quick Start

**Get up and running in 5 minutes!**

---

## 🎯 What is Agent Alex?

Agent Alex is your personal AI work session tracker. It helps you:
- 📊 Track all your projects in one place
- 📝 Log AI work sessions with context
- 🔄 Resume projects exactly where you left off
- 🗄️ Store everything in your Notion workspace

---

## 🚀 Quick Setup (First Time)

### 1. Install Dependencies (1 min)

```bash
cd "/Users/alex/Agent Alex/agent-alex"
npm install
```

### 2. Set Up Notion (3 min)

**Create Integration:**
1. Go to https://www.notion.so/my-integrations
2. Create "Agent Alex" integration
3. Copy the token

**Create Databases:**
1. Create "Projects" database in Notion
2. Create "Sessions" database in Notion
3. Share both with your integration
4. Copy both database IDs

**Full details:** [NOTION_DATABASE_SETUP.md](./NOTION_DATABASE_SETUP.md)

### 3. Configure Environment (30 sec)

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

Paste your Notion token and database IDs.

### 4. Run the App (30 sec)

```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## 🔄 Daily Usage

### Start Agent Alex

```bash
cd "/Users/alex/Agent Alex/agent-alex"
npm run dev
```

Then open http://localhost:3000

### Log a Work Session

1. Click **"📝 Log Session"**
2. Fill in what you worked on
3. Add files modified, next steps
4. Save to Notion

### Resume a Project

1. Find your project on dashboard
2. Click **"Resume"**
3. See full context:
   - Where you left off
   - Last session notes
   - Next steps
   - Files in progress

---

## 📚 Key Features

### Dashboard
- View all projects at a glance
- See statistics (total projects, hours logged)
- Quick access to any project

### Session Logging
- Track what you accomplished
- Note files modified
- Document blockers
- Set next steps

### Context Preservation
- Never lose track of where you were
- Full project history
- Resume with complete context

### Notion Integration
- All data stored in your Notion
- Use Notion's powerful views
- Access from anywhere

---

## 🎯 Typical Workflow

### Starting a New Project

1. **Create in Notion** or via Agent Alex
2. Set project details (name, type, tech stack)
3. Add initial context
4. Start first session

### Working on a Project

1. **Open Agent Alex dashboard**
2. Click project to see context
3. Work on your project
4. **Log session** when done:
   - What you accomplished
   - Files you changed
   - What's next

### Resuming Later

1. **Open Agent Alex**
2. Find the project
3. Click **"Resume"**
4. Read the context
5. Jump right back in!

---

## 💡 Pro Tips

### Use Sessions Effectively

**Good session note:**
```
"Implemented user authentication:
- Added JWT token generation
- Created login/signup endpoints
- Updated User model with password hashing
- Files: auth.ts, user.model.ts, routes.ts

Next: Test authentication flow and add refresh tokens"
```

**Why this is good:**
- Clear what was done
- Lists specific files
- Has clear next step

### Keep Context Updated

Update "Current Context" on your project:
- What phase you're in
- What's working vs. blocked
- Architecture decisions made

### Use Tags

Tag your sessions:
- `frontend`, `backend`, `database`
- `bug-fix`, `new-feature`
- `refactor`, `testing`

Makes it easy to find related work later!

---

## 📱 Access Anywhere

Since Agent Alex uses Notion:

1. **Mobile:** View projects in Notion mobile app
2. **Web:** Access your Notion workspace
3. **Desktop:** Use Agent Alex locally

Your data is always available!

---

## 🆘 Troubleshooting

### "Cannot connect to server"

```bash
# Make sure server is running
npm run server:dev
```

### "Notion integration failed"

1. Check `.env` has correct token
2. Verify databases are shared with integration
3. Restart server after changing `.env`

### "Database not found"

Double-check database IDs in `.env` match your Notion database URLs.

---

## 📚 More Help

- **Full setup:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Notion setup:** [NOTION_DATABASE_SETUP.md](./NOTION_DATABASE_SETUP.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **GitHub:** [GITHUB_SETUP.md](./GITHUB_SETUP.md)

---

## ✅ You're Ready!

That's it! You now have a powerful tool to track all your AI work sessions.

**Benefits:**
- ✅ Never lose context on a project
- ✅ Resume work instantly
- ✅ Track your productivity
- ✅ Organized project portfolio

**Happy tracking!** 🤖🚀

---

**Created:** October 17, 2025  
**Project:** Agent Alex v1.0

