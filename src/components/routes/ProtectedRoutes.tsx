
import { useAuthStore } from '@/app/auth/store/auth.store';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus, usertype } = useAuthStore();
  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') return <Navigate to="/" />;
  if (usertype === 'admin') return <Navigate to="/admin" />;

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus, usertype, userId } = useAuthStore();
  if (authStatus === 'checking') return null;

  if (authStatus === 'authenticated' && usertype === 'admin') {
    return <Navigate to="/admin" />;
  }
  if (authStatus === 'authenticated' && usertype === 'user' && userId) {
    return <Navigate to={`/user/${encodeURIComponent(userId)}`} />;
  }

  return children;
};

export const AdminAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus, isAdmin, userId } = useAuthStore();
  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') return <Navigate to="/" />;

  if (!isAdmin()) {
    return <Navigate to={userId ? `/user/${encodeURIComponent(userId)}` : "/"} />;
  }

  return children;
};
