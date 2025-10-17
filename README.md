# 🤖 Agent Alex

**Your AI Work Session & Project Tracker**

Agent Alex is a comprehensive project management and AI session tracking application that helps you keep track of all your projects and pick up exactly where you left off.

---

## 🎯 Vision

Agent Alex extends your Notion AI Work Space by providing:
- **Project Tracking** - Track all projects you're working on
- **Session Logging** - Log AI work sessions with context
- **Context Preservation** - Pick up projects exactly where you left off
- **Multi-Workspace Support** - Manage projects across different Notion workspaces
- **Smart Dashboards** - Visual overview of all your work

---

## 🚀 Features

### Phase 1: MVP (In Progress)
- [ ] Project dashboard - View all active projects
- [ ] Session logger - Log AI work sessions
- [ ] Notion integration - Sync with your AI Work Space
- [ ] Project details view - See full project context
- [ ] Quick resume - One-click to get project context

### Phase 2: Enhanced Tracking
- [ ] Time tracking per project
- [ ] File change tracking
- [ ] Milestone tracking
- [ ] Project status workflow
- [ ] Tags and categories

### Phase 3: Intelligence
- [ ] Smart project recommendations
- [ ] Context summarization
- [ ] Related project detection
- [ ] Work pattern analysis
- [ ] Automated session notes

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 19+ with TypeScript
- **Backend:** Node.js + Express
- **Database:** Notion (via API)
- **Deployment:** Vercel
- **Testing:** Jest + React Testing Library

### Data Model

**Projects Database:**
- Project Name
- Description
- Status (Active, Paused, Complete, Archived)
- Workspace (KAA, Personal, etc.)
- Started Date
- Last Updated
- Current Context
- Related Sessions
- Files/Repositories
- Backlog Items

**Sessions Database:**
- Session Title
- Date/Time
- Duration
- Related Project
- Summary
- What Was Accomplished
- Files Modified
- Next Steps
- AI Agent Used
- Workspace

---

## 📁 Project Structure

```
agent-alex/
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard/     # Main dashboard
│   │   ├── ProjectCard/   # Project display
│   │   ├── SessionLogger/ # Session logging
│   │   └── ProjectView/   # Project details
│   ├── api/               # API clients
│   │   └── notionApi.ts   # Notion integration
│   ├── types/             # TypeScript types
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions
├── server/                # Backend server
│   └── index.ts           # Express server
├── public/                # Static assets
└── docs/                  # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Notion account with API integration

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/agent-alex.git
cd agent-alex

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Notion API key

# Start development server
npm start

# In another terminal, start backend
npm run server
```

### Environment Variables

```env
# Notion Integration
NOTION_API_KEY=your_notion_integration_token_here

# Frontend
REACT_APP_API_URL=http://localhost:3001

# Server
PORT=3001
```

---

## 📊 Development Roadmap

### Week 1: Foundation
- [x] Project setup
- [ ] Basic UI components
- [ ] Notion API integration
- [ ] Project dashboard

### Week 2: Core Features
- [ ] Session logging
- [ ] Project details view
- [ ] Context management
- [ ] Quick resume feature

### Week 3: Enhancement
- [ ] Search and filter
- [ ] Mobile responsive
- [ ] Dark mode
- [ ] Testing

### Week 4: Polish & Deploy
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment setup
- [ ] User guide

---

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

---

## 📝 License

MIT License - Feel free to use and modify for your own needs.

---

## 🙏 Acknowledgments

Built with inspiration from:
- KAA App project (Notion workspace viewer)
- Personal need for better project tracking
- AI-assisted development workflow

---

**Status:** 🚧 In Development  
**Started:** October 17, 2025  
**Maintainer:** Alex
