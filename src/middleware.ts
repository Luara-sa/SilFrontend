import { NextRequest, NextResponse } from "next/server";
import { JwtUtils } from "utils/jwtUtils";

// Define protected and public routes
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forget-password',
  '/auth/reset-password',
  '/auth/verfiy-account',
  '/contact-us',
  '/privacy-policy',
  '/terms-of-service',
  '/courses',
];

const protectedRoutes = [
  '/profile',
  '/checkout',
  '/placement-test',
  '/test',
];

const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forget-password',
  '/auth/reset-password',
  '/auth/verfiy-account',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Construct the base URL properly
  const protocol = request.nextUrl.protocol || 'http:';
  const host = request.headers.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}//${host}`;
  
  // Get token from cookies (preferred) or localStorage (fallback)
  const cookieToken = request.cookies.get("token")?.value;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Handle API routes - skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Handle static files and assets - skip middleware
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Token validation function
  const isValidToken = (token: string | undefined): boolean => {
    if (!token) return false;
    
    try {
      // Check token format
      if (!JwtUtils.isValidTokenFormat(token)) {
        return false;
      }
      
      // Check if token is expired
      if (JwtUtils.isTokenExpired(token)) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const hasValidToken = isValidToken(cookieToken);
  
  // Handle locale-prefixed routes
  const localeRegex = /^\/(en|ar)(\/|$)/;
  const localeMatch = pathname.match(localeRegex);
  const pathWithoutLocale = localeMatch ? pathname.replace(localeRegex, '/') : pathname;
  
  // Update route checks to use path without locale
  const isProtectedRouteActual = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route) || pathname.startsWith(route)
  );
  
  const isAuthRouteActual = authRoutes.some(route => 
    pathWithoutLocale.startsWith(route) || pathname.startsWith(route)
  );
  
  const isPublicRouteActual = publicRoutes.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route) ||
    pathname === route || pathname.startsWith(route)
  );
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware debug:', {
      pathname,
      pathWithoutLocale,
      baseUrl,
      hasToken: !!cookieToken,
      hasValidToken,
      isProtectedRoute: isProtectedRouteActual,
      isAuthRoute: isAuthRouteActual,
      isPublicRoute: isPublicRouteActual,
      locale: localeMatch?.[1]
    });
  }

  // Handle protected routes  
  if (isProtectedRouteActual) {
    // TEMPORARY DEV BYPASS: In development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    
    if (!hasValidToken) {
      // Store only the pathname (not full URL) to redirect back after login
      const returnPath = pathname + (request.nextUrl.search || '');
      const loginUrl = new URL('/auth/login', baseUrl);
      loginUrl.searchParams.set('returnUrl', returnPath);
      
      return NextResponse.redirect(loginUrl);
    }
    
    // Token is valid, allow access
    return NextResponse.next();
  }

  // Handle auth routes - redirect authenticated users away from auth pages
  if (isAuthRouteActual) {
    if (hasValidToken) {
      // Check if there's a return URL
      const returnUrl = request.nextUrl.searchParams.get('returnUrl');
      if (returnUrl) {
        try {
          // returnUrl is now just a path, so validate it's a safe internal path
          if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
            return NextResponse.redirect(new URL(returnUrl, baseUrl));
          }
        } catch (error) {
          console.error('Invalid return URL:', error);
        }
      }
      
      // Default redirect to home
      return NextResponse.redirect(new URL('/', baseUrl));
    }
    
    // User not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRouteActual) {
    return NextResponse.next();
  }

  // Default behavior for unspecified routes
  // You might want to treat unknown routes as protected or public based on your needs
  if (!hasValidToken) {
    // Treat unknown routes as protected by default
    const returnPath = pathname + (request.nextUrl.search || '');
    const loginUrl = new URL('/auth/login', baseUrl);
    loginUrl.searchParams.set('returnUrl', returnPath);
    
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};
