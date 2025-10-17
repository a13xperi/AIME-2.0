/**
 * Agent Alex - Backend Server
 * Express server for handling Notion API requests
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Agent Alex API is running' });
});

// Get all projects
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const { search, status, workspace } = req.query;

    // TODO: Implement Notion database query
    // For now, return mock data
    res.json({
      success: true,
      projects: [],
      message: 'Projects endpoint - to be implemented',
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
});

// Get single project
app.get('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Implement Notion page query
    res.json({
      success: true,
      project: null,
      message: 'Single project endpoint - to be implemented',
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

// Create new project
app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const projectData = req.body;

    // TODO: Implement Notion page creation
    res.json({
      success: true,
      project: null,
      message: 'Create project endpoint - to be implemented',
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
    });
  }
});

// Update project
app.patch('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // TODO: Implement Notion page update
    res.json({
      success: true,
      project: null,
      message: 'Update project endpoint - to be implemented',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
    });
  }
});

// Get all sessions
app.get('/api/sessions', async (req: Request, res: Response) => {
  try {
    const { projectId, search, status } = req.query;

    // TODO: Implement Notion database query
    res.json({
      success: true,
      sessions: [],
      message: 'Sessions endpoint - to be implemented',
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions',
    });
  }
});

// Create new session
app.post('/api/sessions', async (req: Request, res: Response) => {
  try {
    const sessionData = req.body;

    // TODO: Implement Notion page creation
    res.json({
      success: true,
      session: null,
      message: 'Create session endpoint - to be implemented',
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
    });
  }
});

// Get project context for resuming
app.get('/api/projects/:id/context', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Implement context retrieval
    res.json({
      success: true,
      context: null,
      message: 'Project context endpoint - to be implemented',
    });
  } catch (error) {
    console.error('Error fetching project context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project context',
    });
  }
});

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  try {
    // TODO: Implement stats calculation
    res.json({
      success: true,
      stats: {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalSessions: 0,
        totalHours: 0,
        thisWeekSessions: 0,
        thisWeekHours: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Agent Alex API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Notion integration: ${process.env.NOTION_API_KEY ? 'Configured' : 'Not configured'}`);
});

export default app;

