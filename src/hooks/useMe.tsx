import { meStore } from "store/meStore";
import { _AuthService } from "../services/auth.service";
import { useAuth } from "contexts/AuthContext";

export const useMe = () => {
  const me = meStore((state) => state.me);

  // Use the new auth context if available, fallback to legacy method
  const authContext = useAuth();

  const isLogged = () => {
    // Prefer auth context authentication status
    if (authContext) {
      return authContext.isAuthenticated && authContext.user;
    }
    // Fallback to legacy method
    return _AuthService.isLoggedIn() && me?.user ? true : false;
  };

  const isThereIsToken = () => {
    // Prefer auth context token check
    if (authContext) {
      return authContext.isAuthenticated || _AuthService.hasToken();
    }
    // Fallback to legacy method
    return _AuthService.isLoggedIn();
  };

  const isLoading = () => {
    // Check auth context loading state first
    if (authContext && authContext.isLoading) {
      return true;
    }

    // Legacy loading check
    if (Boolean(me?.info_system)) return false;
    else return true;
  };

  const getUser = () => {
    // Prefer auth context user data
    if (authContext && authContext.user) {
      return authContext.user;
    }
    // Fallback to store data
    return !isLoading() && isLogged() ? me?.user : null;
  };

  const getRole = () => {
    // Get role from auth context or store
    const user = getUser();
    if (user && authContext) {
      return authContext.user?.role || me?.role || null;
    }
    return !isLoading() && isLogged() ? me?.role : null;
  };

  const role = getRole();

  return {
    me: getUser(),
    role: role,
    info_system: !isLoading() ? me?.info_system : null,
    loading: isLoading(),
    isLogged: isLogged(),
    isDelegate: isLogged() && role?.includes("delegate"),
    isStudent: isLogged() && role?.includes("student"),
    isCompany: isLogged() && role?.includes("company"),
    isThereIsToken: isThereIsToken(),
    // New auth context properties
    tokenExpiration: authContext?.tokenExpiration || null,
    willExpireSoon: authContext?.willExpireSoon || false,
    refreshAuthStatus: authContext?.refreshAuthStatus || (() => {}),
  };
};
