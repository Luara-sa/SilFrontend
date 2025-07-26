import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { _AuthService } from "services/auth.service";
import { JwtUtils } from "utils/jwtUtils";
import { meStore, IMe } from "store/meStore";
import { useRouter } from "next/router";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
  refreshAuthStatus: () => void;
  tokenExpiration: Date | null;
  willExpireSoon: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);
  const [willExpireSoon, setWillExpireSoon] = useState<boolean>(false);

  const router = useRouter();
  const tokenCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const expirationWarningShown = useRef<boolean>(false);

  // Check authentication status
  const checkAuthStatus = useCallback((): boolean => {
    try {
      const token = _AuthService.getJwtToken();

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setTokenExpiration(null);
        setWillExpireSoon(false);
        return false;
      }

      // Validate token format
      if (!JwtUtils.isValidTokenFormat(token)) {
        console.warn("Invalid token format detected");
        logout();
        return false;
      }

      // Check if token is expired (only for JWT tokens, Sanctum tokens can't be checked client-side)
      if (JwtUtils.isJwtToken(token) && JwtUtils.isTokenExpired(token)) {
        console.warn("Token expired");
        logout();
        return false;
      }

      // Get token expiration (will be null for Sanctum tokens)
      const expiration = _AuthService.getTokenExpiration();
      setTokenExpiration(expiration);

      // Check if token will expire soon (only relevant for JWT tokens)
      const expiringSoon = _AuthService.willTokenExpireSoon(300);
      setWillExpireSoon(expiringSoon);

      // Get user data from store
      const meData = meStore.getState().me;
      if (meData?.user) {
        setUser(meData.user);
        setIsAuthenticated(true);
        return true;
      }

      // Try to get user data from localStorage if not in store
      try {
        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          if (userData.user) {
            setUser(userData.user);
            setIsAuthenticated(true);
            // Restore to store
            meStore.getState().setMe(userData);
            return true;
          }
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }

      // Token exists and is valid but no user data - this might be a problem
      console.warn("Valid token found but no user data available");
      setIsAuthenticated(true); // Still authenticated, but user data is missing
      return true;
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
      return false;
    }
  }, []);

  // Refresh authentication status
  const refreshAuthStatus = useCallback(() => {
    setIsLoading(true);
    const authStatus = checkAuthStatus();
    setIsLoading(false);
    return authStatus;
  }, [checkAuthStatus]);

  // Login function
  const login = useCallback((token: string, userData?: any) => {
    console.log("AuthContext: Login called with token:", !!token);
    console.log("AuthContext: Login called with userData:", !!userData);

    try {
      _AuthService.doLogin(token);

      if (userData) {
        setUser(userData.user || userData);
        meStore.getState().setMe(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));
        console.log("AuthContext: User data set and stored");
      }

      setIsAuthenticated(true);
      const expiration = _AuthService.getTokenExpiration();
      setTokenExpiration(expiration);
      setWillExpireSoon(_AuthService.willTokenExpireSoon(300));

      console.log("AuthContext: Authentication state updated");
      console.log("AuthContext: Token expiration:", expiration);
      console.log(
        "AuthContext: Final token check:",
        !!_AuthService.getJwtToken()
      );

      // Start token monitoring
      startTokenMonitoring();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setTokenExpiration(null);
    setWillExpireSoon(false);
    expirationWarningShown.current = false;

    // Stop token monitoring
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
      tokenCheckInterval.current = null;
    }

    // Clear auth service data
    _AuthService.doLogout();

    // Redirect to login if not already there
    const currentPath = router.pathname;
    if (!currentPath.startsWith("/auth/") && !currentPath.startsWith("/")) {
      router.push("/auth/login");
    }
  }, [router]);

  // Start token monitoring
  const startTokenMonitoring = useCallback(() => {
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }

    tokenCheckInterval.current = setInterval(() => {
      const token = _AuthService.getJwtToken();

      if (!token) {
        logout();
        return;
      }

      // Only check expiration for JWT tokens
      if (JwtUtils.isJwtToken(token)) {
        if (JwtUtils.isTokenExpired(token)) {
          console.warn("Token expired during monitoring");
          logout();
          return;
        }

        // Check if token will expire soon
        const expiringSoon = _AuthService.willTokenExpireSoon(300); // 5 minutes
        setWillExpireSoon(expiringSoon);

        // Show warning if token will expire in 2 minutes and we haven't shown it yet
        if (
          _AuthService.willTokenExpireSoon(120) &&
          !expirationWarningShown.current
        ) {
          expirationWarningShown.current = true;
          console.warn("Token will expire soon");
          // You can emit an event here to show a warning notification
          if (typeof window !== "undefined" && (window as any).eventEmitter) {
            (window as any).eventEmitter.emit("enqueueSnackbar", {
              message: "Your session will expire soon. Please save your work.",
              variant: "warning",
              autoHideDuration: 10000,
              preventDuplicate: true,
            });
          }
        }

        // Update expiration date
        const expiration = _AuthService.getTokenExpiration();
        setTokenExpiration(expiration);
      } else if (JwtUtils.isSanctumToken(token)) {
        // For Sanctum tokens, we can't check expiration client-side
        // We rely on the server to reject requests if the token is expired
        setWillExpireSoon(false);
        setTokenExpiration(null);
      } else {
        // Unknown token format, logout
        console.warn("Unknown token format during monitoring");
        logout();
        return;
      }
    }, 30000); // Check every 30 seconds
  }, [logout]);

  // Register logout callback with auth service
  useEffect(() => {
    const logoutCallback = () => {
      setIsAuthenticated(false);
      setUser(null);
      setTokenExpiration(null);
      setWillExpireSoon(false);
      expirationWarningShown.current = false;

      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
        tokenCheckInterval.current = null;
      }
    };

    _AuthService.addLogoutCallback(logoutCallback);

    return () => {
      _AuthService.removeLogoutCallback(logoutCallback);
    };
  }, []);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        const authStatus = checkAuthStatus();

        if (authStatus) {
          startTokenMonitoring();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
      }
    };
  }, [checkAuthStatus, startTokenMonitoring]);

  // Listen to meStore changes
  useEffect(() => {
    const unsubscribe = meStore.subscribe((state) => {
      if (state.me?.user && isAuthenticated) {
        setUser(state.me.user);
      } else if (!state.me?.user && isAuthenticated) {
        // User data cleared but still authenticated - might need to refetch
        checkAuthStatus();
      }
    });

    return unsubscribe;
  }, [isAuthenticated, checkAuthStatus]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus,
    refreshAuthStatus,
    tokenExpiration,
    willExpireSoon,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
