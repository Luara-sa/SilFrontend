import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "contexts/AuthContext";

interface UseAuthRequiredOptions {
  redirectTo?: string;
  requiredRoles?: string[];
  onUnauthorized?: () => void;
  showLoadingComponent?: boolean;
}

interface UseAuthRequiredReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  hasRequiredRole: boolean;
  tokenExpiration: Date | null;
  willExpireSoon: boolean;
  logout: () => void;
  refreshAuthStatus: () => void;
}

export const useAuthRequired = (
  options: UseAuthRequiredOptions = {}
): UseAuthRequiredReturn => {
  const {
    redirectTo = "/auth/login",
    requiredRoles = [],
    onUnauthorized,
    showLoadingComponent = true,
  } = options;

  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    user,
    tokenExpiration,
    willExpireSoon,
    logout,
    refreshAuthStatus,
  } = useAuth();

  const hasRequiredRole =
    requiredRoles.length === 0 ||
    (user?.role && requiredRoles.some((role) => user.role.includes(role)));

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    if (!isAuthenticated) {
      console.warn("User not authenticated, redirecting to login...");

      if (onUnauthorized) {
        onUnauthorized();
      }

      // Store current path for return after login
      const returnUrl = router.asPath;
      router.push(`${redirectTo}?returnUrl=${returnUrl}`);
      return;
    }

    if (!hasRequiredRole) {
      console.warn("User does not have required roles:", requiredRoles);

      if (onUnauthorized) {
        onUnauthorized();
      }

      router.push("/unauthorized");
      return;
    }

    // Show warning if token will expire soon
    if (willExpireSoon) {
      console.warn("Token will expire soon");
      // You can trigger a notification here
    }
  }, [
    isAuthenticated,
    isLoading,
    hasRequiredRole,
    router,
    redirectTo,
    requiredRoles,
    onUnauthorized,
    willExpireSoon,
  ]);

  return {
    isLoading: showLoadingComponent ? isLoading : false,
    isAuthenticated,
    user,
    hasRequiredRole,
    tokenExpiration,
    willExpireSoon,
    logout,
    refreshAuthStatus,
  };
};

// Convenience hook for student-only features
export const useStudentAuth = () => {
  return useAuthRequired({
    requiredRoles: ["student"],
    redirectTo: "/auth/login",
  });
};

// Convenience hook for delegate-only features
export const useDelegateAuth = () => {
  return useAuthRequired({
    requiredRoles: ["delegate"],
    redirectTo: "/auth/login",
  });
};

// Convenience hook for company-only features
export const useCompanyAuth = () => {
  return useAuthRequired({
    requiredRoles: ["company"],
    redirectTo: "/auth/login",
  });
};
