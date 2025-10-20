/**
 * Tests for Notion API Client
 */

import { fetchProjects, fetchProject, fetchSessions, createSession } from '../notionApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('Notion API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', status: 'Active' },
        { id: '2', name: 'Project 2', status: 'Completed' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, projects: mockProjects }),
      });

      const result = await fetchProjects();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProjects);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects')
      );
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      });

      const result = await fetchProjects();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await fetchProjects();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('fetchProject', () => {
    it('should fetch a single project by ID', async () => {
      const mockProject = { id: '1', name: 'Project 1', status: 'Active' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, project: mockProject }),
      });

      const result = await fetchProject('1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProject);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects/1')
      );
    });
  });

  describe('fetchSessions', () => {
    it('should fetch sessions successfully', async () => {
      const mockSessions = [
        { id: '1', title: 'Session 1', date: '2025-01-01' },
        { id: '2', title: 'Session 2', date: '2025-01-02' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, sessions: mockSessions }),
      });

      const result = await fetchSessions();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSessions);
    });

    it('should apply filters when provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, sessions: [] }),
      });

      await fetchSessions({ projectId: 'proj-123' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('projectId=proj-123')
      );
    });
  });

  describe('createSession', () => {
    it('should create a session successfully', async () => {
      const newSession = {
        title: 'New Session',
        duration: 60,
        summary: 'Test summary',
      };

      const mockResponse = {
        id: '1',
        ...newSession,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, session: mockResponse }),
      });

      const result = await createSession(newSession);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/sessions'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSession),
        })
      );
    });
  });
});
