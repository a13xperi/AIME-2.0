# Browser Testing - Step-by-Step Guide

## Prerequisites
- All 4 services running:
  - Express Backend: http://localhost:3001
  - FastAPI Backend: http://localhost:8000
  - PuttSolver Service: http://localhost:8081
  - Frontend: http://localhost:3000

## Step 1: Open Frontend
1. Open browser
2. Navigate to: http://localhost:3000/golf
3. Verify page loads without errors

## Step 2: Start AI Session
1. Click the control button (center of screen)
2. Wait for connection status to show "connected"
3. Verify microphone permission is granted

## Step 3: Test solve_putt Tool
1. Type or speak: "Solve a putt for Riverside Country Club hole 1"
2. Provide coordinates when prompted:
   - Ball: 40.268240, -111.659520
   - Cup: 40.268250, -111.659530
   - Stimp: 10.5

## Step 4: Verify Response
1. Check for instruction text
2. Verify aim line and speed are displayed
3. Check plot points are in response

## Step 5: Test Error Handling
1. Try invalid course/hole
2. Verify error message is displayed

