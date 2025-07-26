import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { _AuthService } from 'services/auth.service';
import { useAuth } from 'contexts/AuthContext';

interface UseProtectedRouteOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  requiredRoles?: string[];
  onUnauthorized?: () => void;
}

interface UseProtectedRouteReturn {
  isLoading: boolean;
  isAuthorized: boolean;
  user: any;
  hasRequiredRole: boolean;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}): UseProtectedRouteReturn => {
  const {
    redirectTo = '/auth/login',
    requireAuth = true,
    requiredRoles = [],
    onUnauthorized
  } = options;

  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkAuthStatus } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);

  useEffect(() => {
    // Don't check auth on auth pages unless specifically required
    const isAuthPage = router.pathname.startsWith('/auth/');
    
    console.log("useProtectedRoute effect - isAuthPage:", isAuthPage, "requireAuth:", requireAuth, "isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
    
    if (!requireAuth) {
      setIsAuthorized(true);
      setHasRequiredRole(true);
      
      // For guest-only pages (like login), redirect authenticated users away
      if (isAuthenticated && isAuthPage && !isLoading) {
        console.log("Guest-only page: redirecting authenticated user away from auth page");
        const returnUrl = router.query.returnUrl as string;
        const redirectTarget = returnUrl && returnUrl !== '/' && returnUrl !== router.pathname ? returnUrl : '/';
        console.log("Redirecting to:", redirectTarget);
        router.push(redirectTarget);
      }
      return;
    }

    if (isLoading) {
      return; // Wait for auth state to load
    }

    // Check authentication status
    if (!isAuthenticated) {
      console.warn('User not authenticated, redirecting...');
      setIsAuthorized(false);
      setHasRequiredRole(false);
      
      if (onUnauthorized) {
        onUnauthorized();
      }
      
      if (!isAuthPage) {
        // Store the current path to redirect back after login
        const returnUrl = router.asPath;
        router.push(`${redirectTo}?returnUrl=${returnUrl}`);
      }
      return;
    }

    // Check role-based authorization
    let roleAuthorized = true;
    if (requiredRoles.length > 0 && user) {
      const userRoles = user.role || [];
      roleAuthorized = requiredRoles.some(role => userRoles.includes(role));
      
      if (!roleAuthorized) {
        console.warn('User does not have required roles:', requiredRoles);
        setHasRequiredRole(false);
        
        if (onUnauthorized) {
          onUnauthorized();
        }
        
        // Redirect to unauthorized page or home
        router.push('/unauthorized');
        return;
      }
    }

    setIsAuthorized(true);
    setHasRequiredRole(roleAuthorized);

  }, [isAuthenticated, isLoading, user, router, redirectTo, requireAuth, requiredRoles, onUnauthorized]);

  return {
    isLoading,
    isAuthorized,
    user,
    hasRequiredRole,
  };
};

// Enhanced hook for specific authentication requirements
export const useAuthGuard = (requiredRoles?: string[]) => {
  return useProtectedRoute({
    requireAuth: true,
    requiredRoles,
    redirectTo: '/auth/login'
  });
};

// Hook for guest-only pages (like login/register)
export const useGuestOnly = () => {
  return useProtectedRoute({
    requireAuth: false,
    redirectTo: '/'
  });
};
