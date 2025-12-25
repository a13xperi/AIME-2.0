# AIME 3.0 - Complete App Structure from Figma

Based on analysis of the Figma design file, here's the complete app structure:

## App Flow Overview

The app is a comprehensive golf round tracking and AI guidance system with the following main sections:

### 🚀 Launch Section (3 Screens)
- **Splash Screen** (node-id: 3:24) - Dark green background with AIME logo
  - ✅ **Already Implemented** at `/splash`

### ⚙️ Round Setup Section (5 Screens)
- **My Bag** (node-id: 3:22) - Club management screen
  - Add/edit golf clubs with carry distances
  - Sections: Woods, Irons, Wedges, Putter
  - Options: "Use Suggested Distances", "Import from Previous Round"
  - Save button

### 🏌️ Hole Start Section (15+ Screens)
- Initial hole setup and preparation screens
- Various hole start configurations

### 🎯 Shot Guidance Loop Section (7 Screens)
- **Shot Guidance Screen** (node-id: 5:9) - Main shot tracking interface
  - Golf course map with GPS positioning
  - Distance to target display (e.g., "162 yds to center of green")
  - Shot condition selection: Tee, Fairway, Rough, Bunker, Penalty
  - Position correction options: "I'm somewhere else" / "Use GPS"
  - Step indicator: "Step 1 of 4"
  - "Confirm Position" button

### 🟢 Green Transition Section (4 Screens)
- **Precision Putting Setup** (node-id: 5:36) - Robo puck deployment
  - Title: "You're on the green!"
  - Subtitle: "Get ready for cm-accurate putt lines"
  - 3D puck visualization
  - Instructions for deploying Robo puck:
    1. Get puck from bag/pocket
    2. Power on (LED indicates status)
    3. Place behind ball 2-3 inches
  - Puck status: "Last connected: RoboPuck 007", Battery: 89%
  - "I have my puck →" button
  - Options: "Skip RTK mode", "Learn more tutorial", "Buy a puck"

### 🎱 Putting Guidance Section (7 Screens)
- **Puck Placement** (node-id: 5:43) - Detailed puck setup
  - Header: "Putt 1 • Hole 7" with distance "18 ft"
  - Instruction: "Place puck directly behind your ball"
  - Visual diagram showing puck placement (2-3 inches behind ball)
  - Puck Status section:
    - ✓ Puck connected
    - Battery: 85%
    - Waiting for position... (with signal icon)
  - Quick Tips:
    - Keep puck flat on green
    - Avoid standing over puck
    - Don't move until reading complete
  - "Puck Placed →" button
  - "Returning user? Skip instructions for quick place"

### ✅ Hole Complete Section (3 Screens)
- **Hole Stats** (node-id: 5:52) - Performance summary
  - Score display (e.g., "5 (Bogey)")
  - Par information: "Par 4", "3 + 2 putts"
  - Performance metrics in cards:
    - Fairway: Hit
    - Putts: 2 (Avg: 1.8) ↓
    - GIR: Yes ✓
    - Penalties: 0
  - Longest drive: "267 yds!"
  - "View 4 shots" link
  - Average score comparison: "Your avg on this hole: 5.2" with trend
  - "Continue →" button

### 🔄 Next Hole Section (3 Screens)
- Transition screens between holes

### 🏆 End Round Section (4 Screens)
- **Round Complete** (node-id: 5:65) - Final round summary
  - Total score: "86" with "+14" over par
  - Location and date: "Pebble Beach, Dec 10, 2025"
  - Highlights section:
    - Best Hole: #5 (Birdie!)
    - Longest Drive: 267 yds
    - Fewest Putts: Hole 8 (1)
    - Back 9: 43 (+7)
  - Key Stats:
    - Fairways: 8/14 (57%)
    - GIR: 6/18 (33%)
    - Putts: 34 total
    - Penalties: 2
  - Scoring Breakdown (bar chart):
    - Eagles: 0
    - Birds: 7
    - Bogeys: 8
    - Doubles+: 2
  - "View Detailed Stats →" button
  - Links: "Share Results", "Return to Home"

## Design System Notes

### Color Scheme
- **Primary Green**: Dark green (#1a4d3a) for backgrounds
- **Accent Green**: Bright green for buttons and highlights
- **Dark Theme**: Dark backgrounds with white text
- **Status Colors**: 
  - Green for positive metrics
  - Yellow/Red for warnings
  - Gray for neutral states

### Typography
- Clean, sans-serif font (system fonts)
- Large numbers for distances and scores
- Clear hierarchy with titles and subtitles

### UI Patterns
- Card-based layouts for stats
- Step indicators for multi-step processes
- Map integration for course visualization
- Status indicators with icons
- Progress bars and charts for statistics

## Implementation Priority

1. ✅ **Splash Screen** - Already implemented
2. **Round Setup** - My Bag screen (high priority for user onboarding)
3. **Shot Guidance Loop** - Core functionality with map integration
4. **Putting Guidance** - Robo puck integration screens
5. **Stats & Summary** - Hole and round completion screens

## Key Features to Implement

1. **Club Management** - My Bag screen with distance tracking
2. **GPS Integration** - Course map with positioning
3. **Shot Tracking** - Multi-step shot guidance flow
4. **Robo Puck Integration** - Bluetooth connection and status
5. **Statistics Dashboard** - Performance tracking and analytics
6. **Round Management** - Complete round flow from start to finish

## Next Steps

1. Review all screens in detail
2. Create component structure matching the design system
3. Implement navigation flow between sections
4. Integrate with existing AIME Golf AI backend
5. Add GPS and Robo puck hardware integration

