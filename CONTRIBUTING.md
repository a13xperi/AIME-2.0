# Contributing to Agent Alex

Thank you for your interest in contributing to Agent Alex! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Git
- npm or yarn

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/agent-alex.git
cd agent-alex
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/agent-alex.git
```

### Setup Development Environment

```bash
# Install frontend dependencies
npm install

# Install Python dependencies
pip install -r backend/requirements.txt
pip install -r putt-solver-service/requirements.txt

# Copy environment files
cp .env.example .env
# Edit .env with your configuration
```

### Verify Setup

```bash
# Run tests
npm test

# Start development servers
npm run dev        # Frontend
npm run server     # Backend
```

---

## Development Workflow

### Branch Naming

Create branches with descriptive names:

```bash
# Features
git checkout -b feature/add-user-authentication
git checkout -b feature/improve-dashboard-charts

# Bug fixes
git checkout -b fix/session-timer-overflow
git checkout -b fix/api-error-handling

# Documentation
git checkout -b docs/update-api-reference
git checkout -b docs/add-component-examples

# Refactoring
git checkout -b refactor/extract-api-client
git checkout -b refactor/simplify-state-management
```

### Keeping Up to Date

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your branch
git checkout main
git rebase upstream/main

# Update your feature branch
git checkout feature/your-feature
git rebase main
```

---

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public functions

```typescript
/**
 * Fetches all projects from the API.
 * 
 * @param filters - Optional filters to apply
 * @returns Promise with API response containing projects
 * 
 * @example
 * const response = await fetchProjects({ status: ['Active'] });
 */
export const fetchProjects = async (
  filters?: ProjectFilters
): Promise<ApiResponse<Project[]>> => {
  // Implementation
};
```

### React Components

- Use functional components with hooks
- Define prop types with TypeScript interfaces
- Co-locate styles with components
- Keep components focused and small

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

### Python

- Follow PEP 8 style guidelines
- Use type hints for function parameters and returns
- Add docstrings for all public functions

```python
def calculate_trajectory(
    ball_pos: tuple[float, float],
    cup_pos: tuple[float, float],
    stimp: float
) -> list[PlotPoint]:
    """
    Calculate the ball trajectory from ball to cup.
    
    Args:
        ball_pos: Ball position as (x, y) in meters
        cup_pos: Cup position as (x, y) in meters
        stimp: Stimpmeter reading (6.0-15.0)
    
    Returns:
        List of PlotPoint objects representing the trajectory
    
    Example:
        >>> trajectory = calculate_trajectory((10.0, 8.0), (10.0, 11.0), 10.5)
        >>> len(trajectory)
        21
    """
    # Implementation
```

### CSS

- Use CSS variables for colors and spacing
- Follow BEM naming convention
- Keep selectors specific but not overly nested

```css
/* Variables */
:root {
  --primary-color: #3498db;
  --spacing-md: 1rem;
}

/* BEM naming */
.project-card {
  padding: var(--spacing-md);
}

.project-card__title {
  font-size: 1.25rem;
}

.project-card--active {
  border-color: var(--primary-color);
}
```

---

## Commit Guidelines

### Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```bash
# Feature
git commit -m "feat(auth): add Google OAuth login"

# Bug fix
git commit -m "fix(timer): prevent negative duration values"

# Documentation
git commit -m "docs(api): add examples to fetchProjects"

# Refactoring
git commit -m "refactor(dashboard): extract stats into component"
```

### Body Guidelines

- Use imperative mood ("add" not "added")
- Reference issues when applicable
- Explain the "why" not just "what"

```bash
git commit -m "fix(session): handle empty project list gracefully

Previously, the session logger would crash when no projects
were available. This change adds a fallback message and
disables the submit button.

Fixes #123"
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests** and ensure they pass

```bash
npm test
npm run lint
```

3. **Update documentation** if needed

4. **Self-review** your changes

### PR Description Template

```markdown
## Summary
Brief description of changes (1-3 sentences)

## Changes
- Added X feature
- Fixed Y bug
- Updated Z documentation

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Documentation updated

## Screenshots (if applicable)
Include screenshots for UI changes

## Related Issues
Fixes #123
Related to #456
```

### Review Process

1. Submit your PR
2. Wait for CI checks to pass
3. Address reviewer feedback
4. Once approved, a maintainer will merge

### What We Look For

- Code follows project standards
- Tests are included for new features
- Documentation is updated
- Commit messages are clear
- Changes are focused and reviewable

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/SessionLogger/SessionLogger.test.tsx

# Run in watch mode
npm test -- --watch
```

### Writing Tests

#### Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={() => {}} disabled />);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

#### API Tests

```typescript
import { fetchProjects } from '../api/notionApi';

global.fetch = jest.fn();

describe('fetchProjects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns projects on success', async () => {
    const mockProjects = [{ id: '1', name: 'Test' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: mockProjects })
    });

    const result = await fetchProjects();
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockProjects);
  });
});
```

### Test Coverage Goals

- Aim for 80%+ coverage on new code
- All public API functions should have tests
- All components should have basic rendering tests

---

## Documentation

### Where to Document

| Type | Location |
|------|----------|
| API endpoints | `docs/API_DOCUMENTATION.md` |
| Components | `docs/COMPONENT_REFERENCE.md` |
| Types | `docs/TYPES_REFERENCE.md` |
| Guides | `docs/DEVELOPER_GUIDE.md` |
| README | `README.md` |

### Documentation Style

- Use clear, concise language
- Include code examples
- Keep examples runnable
- Update docs with code changes

### JSDoc/Docstrings

All public functions should have documentation:

**TypeScript:**
```typescript
/**
 * Brief description.
 * 
 * @param paramName - Parameter description
 * @returns Return value description
 * 
 * @example
 * const result = functionName(arg);
 */
```

**Python:**
```python
def function_name(param: str) -> int:
    """
    Brief description.
    
    Args:
        param: Parameter description
    
    Returns:
        Return value description
    
    Example:
        >>> result = function_name("test")
        >>> print(result)
        42
    """
```

---

## Questions?

- Check existing issues and discussions
- Open a new issue for bugs or feature requests
- Start a discussion for questions

Thank you for contributing to Agent Alex! 🚀
