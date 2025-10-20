# 📋 Backlog & Plans Feature

## Overview
The **Backlog & Plans** section provides a comprehensive view of what's pending, what's next, and what's blocking progress for each project. This gives you complete visibility into the work queue before deploying.

---

## ✨ Features

### 1. **Next Steps** 🎯
- Numbered list of upcoming tasks
- Clear, actionable items
- Visual priority indicators
- Auto-parsed from Notion's "Next Steps" field

### 2. **Blockers** 🚧
- Warning-highlighted section
- Lists all current blockers
- Count badge shows number of blockers
- "Clear path ahead" message when no blockers

### 3. **Status Notes & Plans** 📝
- Current status and context
- Planning notes
- Progress updates
- Synced from Notion's "Status Notes" field

### 4. **Work Queue** 📦
- Future features and improvements
- Backlog items count
- Planning guidance
- Links to edit in Notion

### 5. **Quick Actions** ⚡
- **Log New Session** button (placeholder for future feature)
- **Edit in Notion** button (opens project in Notion)

---

## 📊 Data Sources

All data is fetched from your Notion Projects database:

| Field in UI | Notion Property | Type |
|-------------|----------------|------|
| Next Steps | `Next Steps` | Rich Text |
| Blockers | `Blockers` | Rich Text |
| Status Notes | `Status Notes` | Rich Text |
| Backlog Items | `Backlog Items` | Number |
| Tags | `Tags` | Multi-select |

---

## 🎨 Visual Design

- **Color-coded sections** - Each section has distinct styling
- **Warning indicators** - Blockers are highlighted in orange/amber
- **Success states** - Shows positive messages when no blockers
- **Numbered steps** - Next steps are numbered for clarity
- **Responsive layout** - 2-column grid on desktop, stacks on mobile

---

## 📍 Where to Find It

The **Backlog & Plans** section appears on every **Project Detail** page:

1. Navigate to any project from the dashboard
2. Scroll down below "Current Context"
3. See the full backlog section with all pending items

---

## ✏️ How to Update

All backlog data is managed in Notion:

1. Open your Notion workspace
2. Navigate to your Projects database
3. Edit the project page
4. Update these fields:
   - **Next Steps** - Add upcoming tasks (one per line or comma-separated)
   - **Blockers** - List any blocking issues
   - **Status Notes** - Add planning notes and context
   - **Backlog Items** - Number of items in backlog
5. Changes sync immediately to Agent Alex!

---

## 🔄 Parsing Logic

**Next Steps & Blockers** are auto-parsed:
- Supports **newline-separated** items
- Supports **comma-separated** items
- Automatically trims whitespace
- Filters out empty lines

Example in Notion:
```
Implement user authentication
Add password reset flow
Set up email verification
```

Or:
```
Implement user authentication, Add password reset flow, Set up email verification
```

Both formats work!

---

## 💡 Best Practices

1. **Keep Next Steps Small** - Break large tasks into bite-sized items
2. **Update Blockers Immediately** - Document blockers as they arise
3. **Regular Status Notes** - Update notes after each session
4. **Track Backlog Count** - Keep count updated for visibility
5. **Use Tags** - Tag projects for easy filtering (coming soon!)

---

## 🚀 Future Enhancements

- [ ] Live session logging from the UI
- [ ] Drag-and-drop to reorder next steps
- [ ] Mark items as complete directly in Agent Alex
- [ ] Backlog item detail pages
- [ ] Progress tracking and burndown charts
- [ ] Dependency mapping between items
- [ ] Time estimates for next steps

---

## 📸 Example

```
📋 Backlog & Plans
  5 items in backlog

🎯 Next Steps (3)
  1. Implement user authentication system
  2. Set up database migrations
  3. Create API documentation

🚧 Blockers (1)
  ⚠️ Waiting for API key from third-party service

📝 Status Notes & Plans
  Currently focusing on backend infrastructure.
  Planning to complete authentication by end of week.

📦 Work Queue
  Future features and improvements tracked in Notion.
```

---

Built with ❤️ for better project management


