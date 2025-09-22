import { useAuth } from '@/contexts/AuthContext';

export const useAuthorization = () => {
  const { user, profile, hasRole, inDepartment, loading } = useAuth();

  const isAuthorized = (options?: { roles?: string[]; departments?: string[] }) => {
    if (!user || !profile) return false;
    const roleOk = options?.roles?.length ? hasRole(...options.roles) : true;
    const deptOk = options?.departments?.length ? inDepartment(...options.departments) : true;
    return roleOk && deptOk;
  };

  return {
    user,
    profile,
    hasRole,
    inDepartment,
    isAuthorized,
    loading,
  };
};


