# Step-by-Step End-to-End Testing Guide

## Overview
This guide walks through testing the complete AIME PuttSolver integration flow step-by-step.

## Prerequisites
- All 4 services running
- Frontend accessible at http://localhost:3000
- Backend APIs accessible

## Testing Steps

### Step 1: Verify All Services Are Running ✅
- [ ] Express Backend (3001)
- [ ] FastAPI Backend (8000)
- [ ] PuttSolver Service (8081)
- [ ] Frontend (3000)

### Step 2: Test PuttSolver Service Directly
- [ ] Health check
- [ ] Get datasets
- [ ] Solve putt (direct call)

### Step 3: Test FastAPI Backend
- [ ] Health check
- [ ] Solve putt (WGS84 input)

### Step 4: Test Express Backend
- [ ] Health check
- [ ] Token endpoint (if configured)

### Step 5: Test Frontend
- [ ] Load frontend
- [ ] Navigate to golf page
- [ ] Test solve_putt tool in AI chat

### Step 6: End-to-End Flow
- [ ] Frontend → Express → FastAPI → PuttSolver
- [ ] Verify response format
- [ ] Check plot points display

