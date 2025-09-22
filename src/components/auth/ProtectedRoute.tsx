import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedDepartments?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, allowedDepartments, redirectTo = '/auth' }) => {
  const { user, loading, hasRole, inDepartment } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Authenticating..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if ((allowedRoles && allowedRoles.length && !hasRole(...allowedRoles)) ||
      (allowedDepartments && allowedDepartments.length && !inDepartment(...allowedDepartments))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};