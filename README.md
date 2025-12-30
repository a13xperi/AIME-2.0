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

## 📚 Documentation

Comprehensive documentation is available for all APIs, components, and utilities:

- **[Documentation Index](./docs/DOCUMENTATION_INDEX.md)** - Start here for complete overview
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Full REST API reference (FastAPI + Express)
- **[Components Documentation](./docs/COMPONENTS_DOCUMENTATION.md)** - All React components with examples
- **[Utilities Documentation](./docs/UTILITIES_DOCUMENTATION.md)** - Utility functions and type definitions

### Quick Links

- [Setup Guide](./SETUP_GUIDE.md) - Detailed installation and configuration
- [Quick Start](./QUICK_START.md) - Get running in 5 minutes
- [Architecture](./ARCHITECTURE.md) - System architecture overview
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn
- Notion account with API integration

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/agent-alex.git
cd agent-alex

# Install dependencies
npm install
pip install -r backend/requirements.txt

# Set up environment variables
cp .env.example .env.development
# Edit .env.development with your Notion credentials

# Start development servers
npm run dev                    # Frontend + Express backend (Terminal 1)
python backend/main.py         # FastAPI backend (Terminal 2)
```

### Environment Variables

```env
# Notion Integration (Required)
NOTION_TOKEN=secret_your_integration_token_here
NOTION_PROJECTS_DATABASE_ID=your_projects_database_id
NOTION_SESSIONS_DATABASE_ID=your_sessions_database_id

# Frontend
VITE_API_URL=http://localhost:3001

# Express Backend
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# FastAPI Backend
PUTTSOLVER_SERVICE_URL=http://localhost:8081
AIME_TRANSFORM_MODE=mock
```

### Quick API Test

```bash
# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:8000/api/health

# Get projects
curl http://localhost:3001/api/projects

# Get courses
curl http://localhost:8000/api/courses
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

## 🧩 Key Features

### Dual Backend Architecture
- **FastAPI Backend (Python)** - Golf putt solver with DLL integration
- **Express Backend (TypeScript)** - Notion integration for projects and sessions

### Comprehensive Component Library
- **40+ React Components** - Fully documented with TypeScript
- **Project Management** - Complete CRUD operations
- **Session Tracking** - Detailed work session logging
- **Analytics Dashboard** - Productivity insights and metrics
- **CRM Integration** - Customer relationship management
- **Workflow Automation** - Custom workflow builder

### Developer Experience
- **Full TypeScript** - Type-safe throughout the stack
- **Comprehensive Documentation** - Every API, component, and function documented
- **Error Handling** - Consistent error patterns
- **Rate Limiting** - Built-in API protection
- **CORS Configuration** - Secure cross-origin requests
- **Offline Mode** - Works when Notion is unavailable

---

## 📖 Usage Examples

### Create a Project

```typescript
import { createProject } from './api/notionApi';

const response = await createProject({
  name: 'My New Project',
  status: 'Active',
  priority: 'High',
  type: 'Web Application',
  description: 'Building something awesome',
  techStack: ['React', 'TypeScript', 'Node.js']
});

if (response.success) {
  console.log('Project created:', response.data);
}
```

### Log a Work Session

```tsx
import SessionLogger from './components/SessionLogger/SessionLogger';

<SessionLogger
  isOpen={true}
  onClose={() => setShowLogger(false)}
  onSuccess={() => refreshData()}
  projects={projects}
/>
```

### Solve a Golf Putt

```typescript
const response = await fetch('/api/solve_putt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    course_id: 'riverside_country_club',
    hole_id: 1,
    ball_wgs84: { lat: 37.774929, lon: -122.419416 },
    cup_wgs84: { lat: 37.77485, lon: -122.4193 },
    stimp: 10.5
  })
});

const data = await response.json();
console.log(data.instruction_text); // "Aim 2.5 degrees left..."
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Test specific component
npm test -- SessionLogger
```

---

## 🤝 Contributing

Contributions are welcome! When adding features:

1. Follow existing code patterns
2. Use TypeScript for type safety
3. Write tests for new functionality
4. Update relevant documentation:
   - API changes → `docs/API_DOCUMENTATION.md`
   - Component changes → `docs/COMPONENTS_DOCUMENTATION.md`
   - Utility changes → `docs/UTILITIES_DOCUMENTATION.md`

See [Contributing Guide](./CONTRIBUTING.md) for more details.

---

## 📝 License

MIT License - Feel free to use and modify for your own needs.

---

## 🙏 Acknowledgments

Built with inspiration from:
- KAA App project (Notion workspace viewer)
- Personal need for better project tracking
- AI-assisted development workflow
- Modern React and TypeScript best practices

---

## 📞 Support

- **Documentation:** [docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/agent-alex/issues)
- **Quick Start:** [QUICK_START.md](./QUICK_START.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Status:** ✅ Fully Documented  
**Version:** 0.1.0  
**Started:** October 17, 2025  
**Documentation Completed:** December 30, 2024  
**Maintainer:** Alex
