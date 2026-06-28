import React from 'react';
import { render, screen } from '@testing-library/react';
import * as authCtx from '../../context/auth-context';

// react-router-dom v7 does not resolve under CRA's Jest (see App.test.tsx), and
// Profile only needs useNavigate, so mock it rather than wrap in a real router.
jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

// eslint-disable-next-line import/first
import Profile from './Profile';

type AuthShape = ReturnType<typeof authCtx.useAuth>;

const mockAuth = (over: Partial<AuthShape>) =>
  jest.spyOn(authCtx, 'useAuth').mockReturnValue({
    user: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
    error: null,
    ...over,
  } as AuthShape);

describe('Profile account-upgrade card', () => {
  afterEach(() => jest.restoreAllMocks());

  it('offers to save the account for an anonymous user (no email)', () => {
    mockAuth({ user: { id: 'u1', name: 'Guest', email: '' } });
    render(<Profile />);
    expect(screen.getByText('Save your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('hides the upgrade card once the user has an email', () => {
    mockAuth({ user: { id: 'u1', name: 'Alex', email: 'alex@example.com' } });
    render(<Profile />);
    expect(screen.queryByText('Save your account')).toBeNull();
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
  });
});
