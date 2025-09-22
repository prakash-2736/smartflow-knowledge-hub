import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Forces back navigation to land on home and prevents navigating to /auth when logged in
export const BackGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Redirect authenticated users away from /auth
  useEffect(() => {
    if (user && location.pathname === '/auth') {
      navigate('/', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  // On browser back, always send to home if not already there
  useEffect(() => {
    const handlePop = () => {
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [location.pathname, navigate]);

  return null;
};


