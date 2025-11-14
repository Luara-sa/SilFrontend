import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/AuthContext';

/**
 * Hook to check if user's email is verified
 * Redirects unverified users to verification page
 * Only applies to students with guard="student"
 */
export const useVerificationCheck = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Don't check if still loading
    if (isLoading) {
      return;
    }

    // Don't check if not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    // Only check verification for students
    const isStudent = user.guard === 'student' || user.user_type === 'student';
    if (!isStudent) {
      return;
    }

    // Check if user is on verification page (allow access to this page)
    const isOnVerificationPage = router.pathname.startsWith('/auth/verfiy-account');
    
    // Check if user is on auth pages (login, signup, etc)
    const isOnAuthPage = router.pathname.startsWith('/auth/');

    // Check if email is verified
    const isVerified = user.is_verify === 1 || user.is_verify === true;

    // If user is NOT verified
    if (!isVerified) {
      // Allow access to verification page only
      if (!isOnVerificationPage && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        const email = user.email || localStorage.getItem('verification_email') || '';
        
        console.log('User email not verified, redirecting to verification page');
        
        // Redirect to verification page
        router.replace(`/auth/verfiy-account/${encodeURIComponent(email)}`);
      }
    } else {
      // User is verified
      // If they're on the verification page, redirect to home
      if (isOnVerificationPage && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace('/');
      }
    }

    // Reset redirect flag when pathname changes
    return () => {
      hasRedirectedRef.current = false;
    };
  }, [isLoading, isAuthenticated, user, router.pathname]);

  return {
    isVerified: user?.is_verify === 1 || user?.is_verify === true,
    isStudent: user?.guard === 'student' || user?.user_type === 'student',
  };
};

