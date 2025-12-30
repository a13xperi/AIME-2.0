# Agent Alex - Testing Guide

> Comprehensive guide for testing the Agent Alex application, including unit tests, integration tests, and end-to-end testing strategies.

## Table of Contents

- [Overview](#overview)
- [Test Stack](#test-stack)
- [Running Tests](#running-tests)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [API Testing](#api-testing)
- [Integration Testing](#integration-testing)
- [Test Patterns](#test-patterns)
- [Mocking](#mocking)
- [Coverage](#coverage)
- [CI/CD Integration](#cicd-integration)

---

## Overview

Agent Alex uses a comprehensive testing strategy:

| Test Type | Purpose | Tools |
|-----------|---------|-------|
| Unit | Test individual functions | Jest |
| Component | Test React components | Jest + React Testing Library |
| API | Test API client functions | Jest + fetch mocks |
| Integration | Test service integration | Jest + MSW |
| E2E | Test user workflows | Playwright (optional) |

---

## Test Stack

### Frontend Testing

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **MSW (Mock Service Worker)** - API mocking

### Backend Testing (Python)

- **pytest** - Test framework
- **pytest-asyncio** - Async test support
- **httpx** - Test client for FastAPI

---

## Running Tests

### Frontend Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run in watch mode (re-run on changes)
npm test -- --watch

# Run specific test file
npm test -- SessionLogger.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders"

# Run with verbose output
npm test -- --verbose

# Update snapshots
npm test -- --updateSnapshot
```

### Backend Tests (Python)

```bash
# Run all Python tests
cd backend
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_health.py

# Run with verbose output
pytest -v

# Run async tests
pytest -v tests/test_endpoints.py
```

---

## Unit Testing

### Testing Pure Functions

```typescript
// src/utils/formatters.ts
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// src/utils/__tests__/formatters.test.ts
import { formatDuration } from '../formatters';

describe('formatDuration', () => {
  it('formats minutes only', () => {
    expect(formatDuration(45)).toBe('45m');
  });

  it('formats hours only', () => {
    expect(formatDuration(120)).toBe('2h');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0m');
  });
});
```

### Testing with Types

```typescript
// src/utils/filters.ts
import { Project, ProjectFilters } from '../types';

export function filterProjects(
  projects: Project[],
  filters: ProjectFilters
): Project[] {
  return projects.filter(project => {
    if (filters.status?.length) {
      if (!filters.status.includes(project.status)) return false;
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!project.name.toLowerCase().includes(search)) return false;
    }
    return true;
  });
}

// src/utils/__tests__/filters.test.ts
import { filterProjects } from '../filters';
import { Project } from '../../types';

describe('filterProjects', () => {
  const mockProjects: Project[] = [
    { id: '1', name: 'Auth System', status: 'Active' } as Project,
    { id: '2', name: 'Dashboard', status: 'Paused' } as Project,
    { id: '3', name: 'API Gateway', status: 'Active' } as Project,
  ];

  it('filters by status', () => {
    const result = filterProjects(mockProjects, { status: ['Active'] });
    expect(result).toHaveLength(2);
    expect(result.map(p => p.name)).toEqual(['Auth System', 'API Gateway']);
  });

  it('filters by search term', () => {
    const result = filterProjects(mockProjects, { search: 'auth' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Auth System');
  });

  it('combines filters', () => {
    const result = filterProjects(mockProjects, {
      status: ['Active'],
      search: 'api'
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('API Gateway');
  });

  it('returns all when no filters', () => {
    const result = filterProjects(mockProjects, {});
    expect(result).toHaveLength(3);
  });
});
```

---

## Component Testing

### Basic Component Test

```tsx
// src/components/SessionStatusBadge/SessionStatusBadge.test.tsx
import { render, screen } from '@testing-library/react';
import SessionStatusBadge from './SessionStatusBadge';

describe('SessionStatusBadge', () => {
  it('renders the status text', () => {
    render(<SessionStatusBadge status="Completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('applies correct class for active status', () => {
    const { container } = render(<SessionStatusBadge status="Active" />);
    expect(container.firstChild).toHaveClass('status-active');
  });

  it('applies correct class for blocked status', () => {
    const { container } = render(<SessionStatusBadge status="Blocked" />);
    expect(container.firstChild).toHaveClass('status-blocked');
  });
});
```

### Testing User Interactions

```tsx
// src/components/ProjectCreator/ProjectCreator.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectCreator from './ProjectCreator';

describe('ProjectCreator', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open', () => {
    render(
      <ProjectCreator
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.getByText('Create New Project')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ProjectCreator
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    render(
      <ProjectCreator
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, project: { id: '1' } })
    });

    render(
      <ProjectCreator
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill form
    await userEvent.type(screen.getByLabelText(/name/i), 'Test Project');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test description');
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows error on failed submission', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));

    render(
      <ProjectCreator
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'Test');
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Async Components

```tsx
// src/components/ProjectsList/ProjectsList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectsList from './ProjectsList';
import * as api from '../../api/notionApi';

// Mock the API module
jest.mock('../../api/notionApi');
const mockedApi = api as jest.Mocked<typeof api>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProjectsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockedApi.fetchProjects.mockReturnValue(new Promise(() => {})); // Never resolves
    renderWithRouter(<ProjectsList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays projects when loaded', async () => {
    mockedApi.fetchProjects.mockResolvedValueOnce({
      success: true,
      data: [
        { id: '1', name: 'Project A', status: 'Active' },
        { id: '2', name: 'Project B', status: 'Paused' },
      ] as any
    });

    renderWithRouter(<ProjectsList />);

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    mockedApi.fetchProjects.mockResolvedValueOnce({
      success: false,
      error: 'Failed to load projects'
    });

    renderWithRouter(<ProjectsList />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});
```

---

## API Testing

### Testing API Functions

```typescript
// src/api/__tests__/notionApi.test.ts
import {
  fetchProjects,
  createProject,
  fetchSessions,
  createSession
} from '../notionApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('notionApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProjects', () => {
    it('fetches projects successfully', async () => {
      const mockProjects = [{ id: '1', name: 'Test' }];
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ projects: mockProjects })
      });

      const result = await fetchProjects();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProjects);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects')
      );
    });

    it('applies filters to query params', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ projects: [] })
      });

      await fetchProjects({ status: ['Active'], search: 'test' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/status=Active.*search=test|search=test.*status=Active/)
      );
    });

    it('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchProjects();

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('handles API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Unauthorized' })
      });

      const result = await fetchProjects();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('createProject', () => {
    it('creates project with correct payload', async () => {
      const projectData = { name: 'New Project', status: 'Active' };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, project: { id: '1', ...projectData } })
      });

      const result = await createProject(projectData);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
      );
    });
  });

  describe('createSession', () => {
    it('creates session successfully', async () => {
      const sessionData = {
        title: 'Test Session',
        projectId: 'project-1',
        duration: 60
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, session: { id: '1', ...sessionData } })
      });

      const result = await createSession(sessionData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Session logged successfully');
    });
  });
});
```

---

## Integration Testing

### Testing with MSW (Mock Service Worker)

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/projects', (req, res, ctx) => {
    return res(
      ctx.json({
        projects: [
          { id: '1', name: 'Project A', status: 'Active' },
          { id: '2', name: 'Project B', status: 'Paused' },
        ]
      })
    );
  }),

  rest.post('/api/projects', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.json({
        success: true,
        project: { id: '3', ...body }
      })
    );
  }),

  rest.get('/api/sessions', (req, res, ctx) => {
    return res(
      ctx.json({
        sessions: [
          { id: '1', title: 'Session 1', duration: 60 },
        ]
      })
    );
  }),
];

// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/setupTests.ts
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Full Integration Test

```tsx
// src/components/Dashboard/__tests__/Dashboard.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { server } from '../../mocks/server';
import { rest } from 'msw';
import Dashboard from '../Dashboard';

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Integration', () => {
  it('loads and displays projects and stats', async () => {
    renderDashboard();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
    });

    // Verify stats are displayed
    expect(screen.getByText(/total projects/i)).toBeInTheDocument();
  });

  it('handles API failure gracefully', async () => {
    // Override handler for this test
    server.use(
      rest.get('/api/projects', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

## Test Patterns

### AAA Pattern (Arrange, Act, Assert)

```typescript
it('filters active projects', () => {
  // Arrange
  const projects = [
    { id: '1', status: 'Active' },
    { id: '2', status: 'Paused' },
  ];
  
  // Act
  const result = filterByStatus(projects, 'Active');
  
  // Assert
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('1');
});
```

### Testing Error Cases

```typescript
describe('error handling', () => {
  it('throws on invalid input', () => {
    expect(() => processData(null)).toThrow('Invalid input');
  });

  it('returns error response on API failure', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network'));
    const result = await fetchData();
    expect(result.success).toBe(false);
    expect(result.error).toContain('Network');
  });
});
```

### Snapshot Testing

```tsx
import { render } from '@testing-library/react';
import ProjectCard from './ProjectCard';

it('matches snapshot', () => {
  const { asFragment } = render(
    <ProjectCard
      project={{
        id: '1',
        name: 'Test',
        status: 'Active',
        description: 'A test project'
      }}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});
```

---

## Mocking

### Mocking Modules

```typescript
// Mock entire module
jest.mock('../../api/notionApi');

// Mock specific exports
jest.mock('../../api/notionApi', () => ({
  fetchProjects: jest.fn(),
  createProject: jest.fn(),
}));

// Mock with implementation
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
}));
```

### Mocking Timers

```typescript
describe('SessionTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('increments time every second', () => {
    render(<SessionTimer />);
    
    expect(screen.getByText('0:00')).toBeInTheDocument();
    
    jest.advanceTimersByTime(1000);
    expect(screen.getByText('0:01')).toBeInTheDocument();
    
    jest.advanceTimersByTime(60000);
    expect(screen.getByText('1:01')).toBeInTheDocument();
  });
});
```

### Mocking Local Storage

```typescript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('storage utils', () => {
  it('saves data to localStorage', () => {
    saveData('key', { value: 1 });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'key',
      JSON.stringify({ value: 1 })
    );
  });
});
```

---

## Coverage

### Viewing Coverage Report

```bash
npm test -- --coverage
```

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Coverage Goals

| Category | Target |
|----------|--------|
| API functions | 90%+ |
| Utility functions | 90%+ |
| Components | 70%+ |
| Overall | 80%+ |

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test -- --watchAll=false --passWithNoTests
```

---

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Use descriptive test names** - `it('returns filtered projects when status filter applied')`
3. **Keep tests independent** - Each test should work in isolation
4. **Avoid testing implementation details** - Don't test internal state
5. **Mock at the boundaries** - Mock external dependencies, not internal modules
6. **Use factories for test data** - Create reusable test data generators
7. **Clean up after tests** - Reset mocks, clear state
8. **Test edge cases** - Empty arrays, null values, boundary conditions
