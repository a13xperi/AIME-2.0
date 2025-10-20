/**
 * Agent Alex - Backend Server
 * Express server for handling Notion API requests
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
import rateLimit from 'express-rate-limit';
import { logger } from '../src/utils/logger';

// Load environment variables
dotenv.config();

// Validate required environment variables at startup
const requiredEnvVars = [
  'NOTION_TOKEN',
  'NOTION_PROJECTS_DATABASE_ID',
  'NOTION_SESSIONS_DATABASE_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DATABASE_ID!;
const SESSIONS_DB_ID = process.env.NOTION_SESSIONS_DATABASE_ID!;

// Helper function to get full rich text content from Notion rich text arrays
const getFullRichText = (richTextArray: any[]) => {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map((rt: any) => rt.plain_text || '').join('');
};

// Configure CORS with restricted origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('Blocked CORS request from origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(express.json());

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Agent Alex API is running' });
});

// Get all projects with pagination
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const { search, status, workspace } = req.query;

    // Fetch ALL projects using pagination
    let allResults: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const response: any = await (notion.databases as any).query({
        database_id: PROJECTS_DB_ID,
        sorts: [
          {
            property: 'Last Updated',
            direction: 'descending',
          },
        ],
        start_cursor: startCursor,
      });

      allResults = allResults.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    logger.info(`Fetched ${allResults.length} total projects from Notion`);

    const projects = allResults.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        name: props.Name?.title?.[0]?.plain_text || 'Untitled',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        status: props.Status?.select?.name || 'Active',
        priority: props.Priority?.select?.name || 'Medium',
        type: props['Tech Stack']?.multi_select?.[0]?.name || 'General',
        workspace: props['Local Path']?.rich_text?.[0]?.plain_text || '',
        startedDate: props.Started?.date?.start || '',
        lastUpdated: props['Last Updated']?.date?.start || '',
        currentContext: props['Current Context']?.rich_text?.[0]?.plain_text || '',
        repository: props.Repository?.url || '',
        techStack: props['Tech Stack']?.multi_select?.map((t: any) => t.name) || [],
        backlogItems: props['Backlog Items']?.number || 0,
        statusNotes: props['Status Notes']?.rich_text?.[0]?.plain_text || '',
        nextSteps: props['Next Steps']?.rich_text?.[0]?.plain_text || '',
        blockers: props.Blockers?.rich_text?.[0]?.plain_text || '',
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
      };
    });

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    logger.error('Error fetching projects:', error);
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

    const response = await (notion.databases as any).query({
      database_id: PROJECTS_DB_ID,
      filter: {
        property: 'Name',
        title: {
          is_not_empty: true,
        },
      },
    });

    const page = response.results.find((p: any) => p.id === id || p.id.replace(/-/g, '') === id);

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    const props = page.properties;
    const project = {
      id: page.id,
      name: props.Name?.title?.[0]?.plain_text || 'Untitled',
      description: props.Description?.rich_text?.[0]?.plain_text || '',
      status: props.Status?.select?.name || 'Active',
      priority: props.Priority?.select?.name || 'Medium',
      type: props['Tech Stack']?.multi_select?.[0]?.name || 'General',
      workspace: props['Local Path']?.rich_text?.[0]?.plain_text || '',
      startedDate: props.Started?.date?.start || '',
      lastUpdated: props['Last Updated']?.date?.start || '',
      currentContext: props['Current Context']?.rich_text?.[0]?.plain_text || '',
      repository: props.Repository?.url || '',
      techStack: props['Tech Stack']?.multi_select?.map((t: any) => t.name) || [],
      backlogItems: props['Backlog Items']?.number || 0,
      statusNotes: props['Status Notes']?.rich_text?.[0]?.plain_text || '',
      nextSteps: props['Next Steps']?.rich_text?.[0]?.plain_text || '',
      blockers: props.Blockers?.rich_text?.[0]?.plain_text || '',
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
    };

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    logger.error('Error fetching project:', error);
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
    console.log('🚀 Creating new project:', projectData.name);

    // Build properties object for Notion
    const properties: any = {
      Name: {
        title: [
          {
            text: {
              content: projectData.name || 'Untitled Project',
            },
          },
        ],
      },
      Status: {
        select: {
          name: projectData.status || 'Active',
        },
      },
      Priority: {
        select: {
          name: projectData.priority || 'Medium',
        },
      },
    };

    // Add optional fields
    if (projectData.description) {
      properties.Description = {
        rich_text: [{ text: { content: projectData.description } }],
      };
    }

    if (projectData.type) {
      properties['Tech Stack'] = {
        multi_select: [{ name: projectData.type }],
      };
    }

    if (projectData.workspace) {
      properties['Local Workspace'] = {
        rich_text: [{ text: { content: projectData.workspace } }],
      };
    }

    if (projectData.repository) {
      properties.Repository = {
        url: projectData.repository,
      };
    }

    if (projectData.currentContext) {
      properties['Current Context'] = {
        rich_text: [{ text: { content: projectData.currentContext } }],
      };
    }

    if (projectData.nextSteps) {
      properties['Next Steps'] = {
        rich_text: [{ text: { content: projectData.nextSteps } }],
      };
    }

    if (projectData.techStack) {
      const techArray = projectData.techStack
        .split(',')
        .map((tech: string) => tech.trim())
        .filter((tech: string) => tech.length > 0);
      
      if (techArray.length > 0) {
        properties['Tech Stack'] = {
          multi_select: techArray.map((tech: string) => ({ name: tech })),
        };
      }
    }

    // Add Started date (today)
    properties.Started = {
      date: {
        start: new Date().toISOString().split('T')[0],
      },
    };

    // Create the page in Notion
    const response = await (notion.pages as any).create({
      parent: { database_id: PROJECTS_DB_ID },
      properties: properties,
    });

    console.log('✅ Successfully created project in Notion:', response.id);

    res.json({
      success: true,
      project: {
        id: response.id,
        ...projectData,
      },
      message: 'Project created successfully!',
    });
  } catch (error) {
    logger.error('Error creating project:', error);
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
    logger.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
    });
  }
});

// Get all sessions with pagination
app.get('/api/sessions', async (req: Request, res: Response) => {
  try {
    const { projectId, search, status } = req.query;

    // Fetch ALL sessions using pagination
    let allResults: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const response: any = await (notion.databases as any).query({
        database_id: SESSIONS_DB_ID,
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
        start_cursor: startCursor,
      });

      allResults = allResults.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    logger.info(`Fetched ${allResults.length} total sessions from Notion (complete history)`);

    let sessions = allResults.map((page: any) => {
      const props = page.properties;
      
      // Extract project name from title (common pattern: "A103 - Project Name" or "Project Name Session")
      const title = props.Name?.title?.[0]?.plain_text || 'Untitled Session';
      let projectName = '';
      
      // Try to extract project from title patterns like "A103 - GB Cannabis Documentation"
      if (title.includes(' - ')) {
        projectName = title.split(' - ').slice(1).join(' - '); // Everything after first " - "
      } else if (title.toLowerCase().includes('session')) {
        // If title has "session", extract the project part
        projectName = title.replace(/session/gi, '').trim();
      } else {
        // Use the title as project name
        projectName = title;
      }
      
      // Clean up project name if it's too long
      if (projectName.length > 50) {
        projectName = projectName.substring(0, 50) + '...';
      }
      
      return {
        id: page.id,
        title: title,
        date: props.Date?.date?.start || '',
        duration: props.Duration?.number || 0,
        status: props.Status?.select?.name || 'Completed',
        summary: getFullRichText(props.Notes?.rich_text),
        filesModified: getFullRichText(props['Files Modified']?.rich_text),
        aiAgent: props['Agent Type']?.select?.name || '',
        projectId: props['Project/Initiative']?.relation?.[0]?.id || '',
        projectName: projectName,
        nextSteps: getFullRichText(props['Next Steps']?.rich_text),
        blockers: getFullRichText(props.Blockers?.rich_text),
        workspace: props['Workspace Used']?.select?.name || '',
        type: props['Primary Focus']?.select?.name || 'General',
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
        
        // Extended fields - fetching ALL content from Notion
        keyDecisions: getFullRichText(props['Key Decisions']?.rich_text),
        challenges: getFullRichText(props.Challenges?.rich_text),
        solutions: getFullRichText(props.Solutions?.rich_text),
        codeChanges: getFullRichText(props['Code Changes']?.rich_text),
        technologiesUsed: props['Technologies Used']?.multi_select?.map((t: any) => t.name) || [],
        links: getFullRichText(props.Links?.rich_text),
        notes: getFullRichText(props.Notes?.rich_text),
        outcomes: getFullRichText(props.Outcomes?.rich_text),
        learnings: getFullRichText(props.Learnings?.rich_text),
        context: getFullRichText(props.Context?.rich_text),
        toolsUsed: getFullRichText(props['Tools Used']?.rich_text),
      };
    });

    // Filter by projectId if provided (we'll match by project name in title for now)
    if (projectId && typeof projectId === 'string') {
      // This is a simple filter - you might want to add a proper relation in Notion
      sessions = sessions.filter((s: any) => 
        s.title.toLowerCase().includes(projectId.toLowerCase())
      );
    }

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    logger.error('Error fetching sessions:', error);
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

    // Build properties object for Notion (matching actual database schema)
    const properties: any = {
      Name: {
        title: [
          {
            text: {
              content: sessionData.title || 'Untitled Session',
            },
          },
        ],
      },
      Date: {
        date: {
          start: new Date().toISOString().split('T')[0], // Today's date
        },
      },
      User: {
        select: {
          name: 'Alex', // Default user
        },
      },
    };

    // Add optional fields that actually exist in the database
    if (sessionData.aiAgent) {
      properties['Agent Type'] = {
        select: { name: sessionData.aiAgent },
      };
    }

    if (sessionData.workspace) {
      properties['Workspace Used'] = {
        select: { name: sessionData.workspace },
      };
    }

    if (sessionData.sessionType) {
      properties['Primary Focus'] = {
        select: { name: sessionData.sessionType },
      };
    }

    // Combine all additional content into Notes field since other fields don't exist
    let notesContent = sessionData.summary || '';
    
    if (sessionData.filesModified) { 
      notesContent += `\n\nFiles Modified:\n${sessionData.filesModified}`; 
    }
    if (sessionData.nextSteps) { 
      notesContent += `\n\nNext Steps:\n${sessionData.nextSteps}`; 
    }
    if (sessionData.blockers) { 
      notesContent += `\n\nBlockers:\n${sessionData.blockers}`; 
    }
    if (sessionData.keyDecisions) { 
      notesContent += `\n\nKey Decisions:\n${sessionData.keyDecisions}`; 
    }
    if (sessionData.challenges) { 
      notesContent += `\n\nChallenges:\n${sessionData.challenges}`; 
    }
    if (sessionData.solutions) { 
      notesContent += `\n\nSolutions:\n${sessionData.solutions}`; 
    }
    if (sessionData.codeChanges) { 
      notesContent += `\n\nCode Changes:\n${sessionData.codeChanges}`; 
    }
    if (sessionData.outcomes) { 
      notesContent += `\n\nOutcomes:\n${sessionData.outcomes}`; 
    }
    if (sessionData.learnings) { 
      notesContent += `\n\nLearnings:\n${sessionData.learnings}`; 
    }
    
    if (notesContent) {
      properties.Notes = {
        rich_text: [{ text: { content: notesContent } }],
      };
    }

    // Add project relation if provided
    if (sessionData.projectId) {
      properties['Project/Initiative'] = {
        relation: [{ id: sessionData.projectId }],
      };
    }

    // Create the page in Notion
    const response = await (notion.pages as any).create({
      parent: { database_id: SESSIONS_DB_ID },
      properties: properties,
    });

    logger.info('Successfully created session in Notion:', response.id);

    res.json({
      success: true,
      session: {
        id: response.id,
        ...sessionData,
      },
      message: 'Session logged successfully!',
    });
  } catch (error) {
    logger.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
    });
  }
});

// Helper function to map Notion session data to our interface
const mapNotionSessionToInterface = (pageData: any) => {
  const props = pageData.properties;
  
  // Extract project name from session title
  let projectName = '';
  const title = props.Name?.title?.[0]?.plain_text || 'Untitled Session';
  const titleMatch = title.match(/^[A-Z]\d+\s*-\s*(.+?)(?:\s+Session|$)/i);
  if (titleMatch) {
    projectName = titleMatch[1].trim();
  } else {
    // Fallback: remove common session keywords
    projectName = title
      .replace(/\s*(session|log|work|meeting)\s*/gi, ' ')
      .replace(/^[A-Z]\d+\s*-\s*/i, '')
      .trim();
  }

  return {
    id: pageData.id,
    title: title,
    date: props.Date?.date?.start || new Date().toISOString().split('T')[0],
    duration: 0, // Default duration
    projectId: props['Project/Initiative']?.relation?.[0]?.id || '',
    projectName: projectName,
    status: 'completed' as const,
    summary: getFullRichText(props.Notes?.rich_text || []),
    filesModified: getFullRichText(props['Files Modified']?.rich_text || []),
    nextSteps: getFullRichText(props['Next Steps']?.rich_text || []),
    blockers: getFullRichText(props.Blockers?.rich_text || []),
    aiAgent: props['Agent Type']?.select?.name || '',
    workspace: props['Workspace Used']?.select?.name || '',
    type: props['Primary Focus']?.select?.name || 'Documentation',
    tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
    keyDecisions: getFullRichText(props['Key Decisions']?.rich_text || []),
    challenges: getFullRichText(props.Challenges?.rich_text || []),
    solutions: getFullRichText(props.Solutions?.rich_text || []),
    codeChanges: getFullRichText(props['Code Changes']?.rich_text || []),
    technologiesUsed: props['Technologies Used']?.multi_select?.map((t: any) => t.name) || [],
    links: getFullRichText(props.Links?.rich_text || []),
    notes: getFullRichText(props.Notes?.rich_text || []),
    outcomes: getFullRichText(props.Outcomes?.rich_text || []),
    learnings: getFullRichText(props.Learnings?.rich_text || []),
    context: getFullRichText(props.Context?.rich_text || []),
    toolsUsed: getFullRichText(props['Tools Used']?.rich_text || []),
  };
};

// Get single session by ID
app.get('/api/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching session: ${id}`);

    // Get the page directly by ID
    const pageData: any = await notion.pages.retrieve({
      page_id: id
    });

    // Get the page properties
    const session = mapNotionSessionToInterface(pageData);

    logger.info(`Successfully fetched session: ${session.title}`);

    res.json({
      success: true,
      session: session
    });
  } catch (error) {
    logger.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session'
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
    logger.error('Error fetching project context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project context',
    });
  }
});

// Get category statistics
app.get('/api/dashboard/categories', async (req: Request, res: Response) => {
  try {
    // Fetch ALL projects with pagination
    let allProjects: any[] = [];
    let hasMoreProjects = true;
    let projectsCursor: string | undefined = undefined;

    while (hasMoreProjects) {
      const response: any = await (notion.databases as any).query({
        database_id: PROJECTS_DB_ID,
        start_cursor: projectsCursor,
      });
      allProjects = allProjects.concat(response.results);
      hasMoreProjects = response.has_more;
      projectsCursor = response.next_cursor;
    }

    // Fetch ALL sessions with pagination
    let allSessions: any[] = [];
    let hasMoreSessions = true;
    let sessionsCursor: string | undefined = undefined;

    while (hasMoreSessions) {
      const response: any = await (notion.databases as any).query({
        database_id: SESSIONS_DB_ID,
        start_cursor: sessionsCursor,
      });
      allSessions = allSessions.concat(response.results);
      hasMoreSessions = response.has_more;
      sessionsCursor = response.next_cursor;
    }

    // Group projects by category/type
    const categoryMap = new Map<string, {
      name: string;
      projectCount: number;
      activeProjects: number;
      sessionCount: number;
      totalMinutes: number;
      projectNames: string[];
    }>();

    // Process projects
    allProjects.forEach((project: any) => {
      const props = project.properties;
      const types = props['Tech Stack']?.multi_select || [];
      const status = props.Status?.select?.name || 'Active';
      const projectName = props.Name?.title?.[0]?.plain_text || 'Untitled';

      // Use first tech stack item as category, or "General" if none
      const category = types.length > 0 ? types[0].name : 'General';

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          projectCount: 0,
          activeProjects: 0,
          sessionCount: 0,
          totalMinutes: 0,
          projectNames: [],
        });
      }

      const catData = categoryMap.get(category)!;
      catData.projectCount++;
      if (status === 'Active') {
        catData.activeProjects++;
      }
      catData.projectNames.push(projectName);
    });

    // Match sessions to projects and categories
    allSessions.forEach((session: any) => {
      const props = session.properties;
      const sessionTitle = props.Name?.title?.[0]?.plain_text || '';
      const duration = props.Duration?.number || 0;

      // Extract keywords from session title (remove emojis, session IDs, etc.)
      const sessionKeywords = sessionTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove emojis and special chars
        .replace(/\b(a\d+|session|log|work)\b/gi, '') // Remove session IDs and common words
        .replace(/\s+/g, ' ')
        .trim()
        .split(/[-\s]+/)
        .filter((word: string) => word.length > 2); // Keep words longer than 2 chars

      // Try to match session to a project by finding common keywords
      for (const [category, data] of categoryMap.entries()) {
        const matchedProject = data.projectNames.find(pName => {
          const projectKeywords = pName
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .split(/[-\s]+/)
            .filter((word: string) => word.length > 2);

          // Check if there are 2+ common keywords (good match)
          const commonKeywords = sessionKeywords.filter((sk: string) => 
            projectKeywords.some((pk: string) => pk.includes(sk) || sk.includes(pk))
          );

          return commonKeywords.length >= 2 || 
                 // Or if project name is directly mentioned
                 sessionTitle.toLowerCase().includes(pName.toLowerCase().substring(0, 15)) ||
                 pName.toLowerCase().includes(sessionTitle.toLowerCase().substring(0, 15));
        });

        if (matchedProject) {
          data.sessionCount++;
          data.totalMinutes += duration;
          break; // Only count session once
        }
      }
    });

    // Convert map to array and calculate hours
    const categories = Array.from(categoryMap.values()).map(cat => ({
      name: cat.name,
      projectCount: cat.projectCount,
      activeProjects: cat.activeProjects,
      sessionCount: cat.sessionCount,
      totalHours: Math.round(cat.totalMinutes / 60 * 10) / 10, // Round to 1 decimal
    })).sort((a, b) => b.projectCount - a.projectCount); // Sort by project count

    logger.info(`Found ${categories.length} categories`);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    logger.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category stats',
    });
  }
});

// Get dashboard statistics with complete history
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  try {
    // Fetch ALL projects with pagination
    let allProjects: any[] = [];
    let hasMoreProjects = true;
    let projectsCursor: string | undefined = undefined;

    while (hasMoreProjects) {
      const response: any = await (notion.databases as any).query({
        database_id: PROJECTS_DB_ID,
        start_cursor: projectsCursor,
      });
      allProjects = allProjects.concat(response.results);
      hasMoreProjects = response.has_more;
      projectsCursor = response.next_cursor;
    }

    // Fetch ALL sessions with pagination
    let allSessions: any[] = [];
    let hasMoreSessions = true;
    let sessionsCursor: string | undefined = undefined;

    while (hasMoreSessions) {
      const response: any = await (notion.databases as any).query({
        database_id: SESSIONS_DB_ID,
        start_cursor: sessionsCursor,
      });
      allSessions = allSessions.concat(response.results);
      hasMoreSessions = response.has_more;
      sessionsCursor = response.next_cursor;
    }

    logger.info(`Stats from complete history: ${allProjects.length} projects, ${allSessions.length} sessions`);

    // Calculate stats from complete history
    const activeProjects = allProjects.filter((p: any) => 
      p.properties.Status?.select?.name === 'Active'
    ).length;

    // Calculate total minutes and convert to hours
    const totalMinutes = allSessions.reduce((total: number, s: any) => {
      const duration = s.properties.Duration?.number || 0;
      return total + duration;
    }, 0);
    
    const totalHours = Math.round(totalMinutes / 60);

    // Count sessions with outcomes (completed work)
    const completedSessions = allSessions.filter((s: any) => {
      const outcomes = s.properties.Outcomes?.rich_text || [];
      const codeChanges = s.properties['Code Changes']?.rich_text || [];
      return outcomes.length > 0 || codeChanges.length > 0;
    }).length;

    // Collect all unique technologies used
    const allTechnologies = new Set<string>();
    allSessions.forEach((s: any) => {
      const techs = s.properties['Technologies Used']?.multi_select || [];
      techs.forEach((tech: any) => {
        if (tech.name) allTechnologies.add(tech.name);
      });
    });

    // Count files modified (sessions that have files listed)
    const sessionsWithFiles = allSessions.filter((s: any) => {
      const files = s.properties['Files Modified']?.rich_text || [];
      return files.length > 0;
    }).length;

    res.json({
      success: true,
      stats: {
        totalProjects: allProjects.length,
        activeProjects,
        totalSessions: allSessions.length,
        totalHours,
        completedSessions,
        technologiesCount: allTechnologies.size,
        sessionsWithFiles,
      },
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });
  }
});

// Start server
app.listen(PORT, () => {
  logger.info(`Agent Alex API server running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Notion integration: Configured ✅`);
  logger.info(`Projects DB: Set ✅`);
  logger.info(`Sessions DB: Set ✅`);
});

export default app;

