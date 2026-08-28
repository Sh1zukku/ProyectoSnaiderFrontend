
import { useAuthStore } from '@/app/auth/store/auth.store';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') return <Navigate to="/" />;

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === 'checking') return null;

  if (authStatus === 'authenticated') return <Navigate to="/admin" />;

  return children;
};

