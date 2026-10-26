import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent-400" />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export function InstructorRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInstructor, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!isInstructor && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, isInstructor, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isInstructor) return <Navigate to="/instructor" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
