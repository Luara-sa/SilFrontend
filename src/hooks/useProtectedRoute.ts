import { useEffect, useState, useRef } from 'react';
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Don't check auth on auth pages unless specifically required
    const isAuthPage = router.pathname.startsWith('/auth/');
    
    if (!requireAuth) {
      setIsAuthorized(true);
      setHasRequiredRole(true);
      
      // For guest-only pages (like login), redirect authenticated users away
      if (isAuthenticated && isAuthPage && !isLoading && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        const returnUrl = router.query.returnUrl as string;
        // Only redirect to returnUrl if it's not an auth page
        const isReturnUrlAuthPage = returnUrl?.startsWith('/auth/');
        const redirectTarget = returnUrl && !isReturnUrlAuthPage ? returnUrl : '/';
        
        // Use replace instead of push to avoid adding to history
        router.replace(redirectTarget);
      }
      return;
    }

    if (isLoading) {
      return; // Wait for auth state to load
    }

    // Check authentication status
    if (!isAuthenticated) {
      setIsAuthorized(false);
      setHasRequiredRole(false);
      
      if (!isAuthPage && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        
        if (onUnauthorized) {
          onUnauthorized();
        }
        
        // Store the current path to redirect back after login
        const returnUrl = router.asPath;
        router.replace(`${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
      return;
    }

    // Reset redirect flag when authenticated
    hasRedirectedRef.current = false;

    // Check role-based authorization
    let roleAuthorized = true;
    if (requiredRoles.length > 0 && user) {
      const userRoles = user.role || [];
      roleAuthorized = requiredRoles.some(role => userRoles.includes(role));
      
      if (!roleAuthorized) {
        setHasRequiredRole(false);
        
        if (onUnauthorized) {
          onUnauthorized();
        }
        
        // Redirect to unauthorized page or home
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.replace('/unauthorized');
        }
        return;
      }
    }

    setIsAuthorized(true);
    setHasRequiredRole(roleAuthorized);

  }, [isAuthenticated, isLoading, user, requireAuth, requiredRoles.length]);

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
