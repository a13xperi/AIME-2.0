// Vercel Serverless Function for Agent Alex API
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const PROJECTS_DB = process.env.NOTION_PROJECTS_DATABASE_ID;
const SESSIONS_DB = process.env.NOTION_SESSIONS_DATABASE_ID;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper function to handle responses
const respond = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

// Main handler
module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  // Add CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  const { method, url } = req;
  const path = url.replace('/api', '');

  try {
    // Health check
    if (path === '/health') {
      return respond(res, 200, {
        status: 'ok',
        message: 'Agent Alex API is running',
        notion: PROJECTS_DB ? 'Configured' : 'Not configured',
      });
    }

    // Get all projects
    if (path === '/projects' && method === 'GET') {
      const response = await notion.databases.query({
        database_id: PROJECTS_DB,
        sorts: [
          {
            property: 'Last Updated',
            direction: 'descending',
          },
        ],
      });
      return respond(res, 200, { projects: response.results });
    }

    // Get project by ID
    if (path.startsWith('/projects/') && method === 'GET') {
      const projectId = path.split('/')[2];
      const project = await notion.pages.retrieve({ page_id: projectId });
      return respond(res, 200, { project });
    }

    // Create new project
    if (path === '/projects' && method === 'POST') {
      const { name, description, status, priority } = req.body;
      const response = await notion.pages.create({
        parent: { database_id: PROJECTS_DB },
        properties: {
          Name: {
            title: [{ text: { content: name } }],
          },
          Description: {
            rich_text: [{ text: { content: description || '' } }],
          },
          Status: {
            select: { name: status || '🟢 Active' },
          },
          Priority: {
            select: { name: priority || '🟡 Medium' },
          },
          Started: {
            date: { start: new Date().toISOString().split('T')[0] },
          },
          'Last Updated': {
            date: { start: new Date().toISOString().split('T')[0] },
          },
        },
      });
      return respond(res, 201, { project: response });
    }

    // Get all sessions
    if (path === '/sessions' && method === 'GET') {
      const response = await notion.databases.query({
        database_id: SESSIONS_DB,
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      });
      return respond(res, 200, { sessions: response.results });
    }

    // Create new session
    if (path === '/sessions' && method === 'POST') {
      const { title, projectId, summary, duration } = req.body;
      const response = await notion.pages.create({
        parent: { database_id: SESSIONS_DB },
        properties: {
          Title: {
            title: [{ text: { content: title } }],
          },
          Date: {
            date: { start: new Date().toISOString() },
          },
          Summary: {
            rich_text: [{ text: { content: summary || '' } }],
          },
          Duration: {
            number: duration || 0,
          },
          Status: {
            select: { name: '✅ Completed' },
          },
          'AI Agent': {
            rich_text: [{ text: { content: 'Claude (Cursor)' } }],
          },
        },
      });
      return respond(res, 201, { session: response });
    }

    // Route not found
    return respond(res, 404, { error: 'Route not found' });
  } catch (error) {
    console.error('API Error:', error);
    return respond(res, 500, {
      error: 'Internal server error',
      message: error.message,
    });
  }
};


