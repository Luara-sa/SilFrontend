import { useMemo } from "react";
import { ApiUtils } from "utils/apiUtils";
import { useAuth } from "contexts/AuthContext";

/**
 * Hook to determine what features the current user can access
 */
export const useUserAccess = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  const userType = useMemo(() => {
    if (isLoading || !isAuthenticated) return "student"; // Default to student while loading
    return ApiUtils.getApiPrefix();
  }, [isLoading, isAuthenticated, user]);

  const isStudent = useMemo(() => {
    if (isLoading || !isAuthenticated) return true; // Default to student while loading
    return ApiUtils.isStudentUser();
  }, [isLoading, isAuthenticated, user]);

  const isCompany = useMemo(() => {
    if (isLoading || !isAuthenticated) return false; // Default to not company while loading
    return ApiUtils.isCompanyUser();
  }, [isLoading, isAuthenticated, user]);

  const canAccess = useMemo(
    () => ({
      // Course features
      courseEnrollment: isStudent,
      myCourses: isStudent,
      courseCurriculum: isStudent,
      courseContent: isStudent,
      courseReviews: isStudent,
      courseInterest: isStudent,

      // Learning features
      categories: isStudent,
      placementTests: isStudent,
      quizzes: isStudent,
      certificates: isStudent,
      progress: isStudent,

      // Company features
      studentManagement: isCompany,
      courseViewing: true, // Both can view courses

      // Common features
      profile: true,
      notifications: true,

      // Navigation items
      dashboard: true,
      courses: true,
      students: isCompany,
      tests: isStudent,
      paths: isStudent,
      checkout: isStudent,
    }),
    [isStudent, isCompany]
  );

  const navigationItems = useMemo(
    () => ({
      // Student navigation
      student: [
        { key: "dashboard", label: "Dashboard", path: "/dashboard" },
        { key: "courses", label: "Courses", path: "/courses" },
        { key: "my-courses", label: "My Courses", path: "/profile/my-courses" },
        { key: "categories", label: "Categories", path: "/categories" },
        { key: "tests", label: "Tests", path: "/tests" },
        {
          key: "certificates",
          label: "Certificates",
          path: "/profile/certificates",
        },
        { key: "profile", label: "Profile", path: "/profile" },
      ],
      // Company navigation
      company: [
        { key: "dashboard", label: "Dashboard", path: "/company" },
        { key: "courses", label: "Courses", path: "/courses" },
        { key: "students", label: "Students", path: "/company/students" },
        { key: "profile", label: "Profile", path: "/profile" },
      ],
    }),
    []
  );

  const currentNavigation = useMemo(() => {
    return navigationItems[userType] || navigationItems.student;
  }, [userType, navigationItems]);

  return {
    userType,
    isStudent,
    isCompany,
    canAccess,
    navigationItems: currentNavigation,
    isLoading,

    // Utility methods
    canAccessEndpoint: (endpoint: string) => {
      if (isLoading) return true; // Allow during loading to prevent errors
      return ApiUtils.isEndpointAvailable(endpoint);
    },
    shouldShowFeature: (feature: keyof typeof canAccess) => canAccess[feature],
  };
};
