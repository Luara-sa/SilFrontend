import { meStore } from 'store/meStore';

/**
 * Utility functions for API endpoint management
 */
export class ApiUtils {
  // Define which endpoints are available for companies
  private static readonly COMPANY_AVAILABLE_ENDPOINTS = [
    'login',
    'logout', 
    'profile',
    'update-profile',
    'notifications',
    'courses',
    'students'
  ];

  // Define which endpoint patterns are available for companies
  private static readonly COMPANY_ENDPOINT_PATTERNS = [
    /^notifications\/read\/.+$/,
    /^notifications\/delete\/.+$/,
    /^notifications\/read-all$/,
    /^students\/\d+$/
  ];
  /**
   * Get the API prefix based on the current user's type
   * @returns 'student' | 'company' | 'student' (default fallback)
   */
  static getApiPrefix(): 'student' | 'company' {
    try {
      const meData = meStore.getState().me;
      
      // If no user data, default to student for public access
      if (!meData || !meData.user) {
        return 'student';
      }
      
      // Check user type from the user object
      if (meData.user.user_type) {
        return meData.user.user_type === 'company' ? 'company' : 'student';
      }
      
      // Check from role array (fallback)
      if (meData.role && Array.isArray(meData.role)) {
        const hasCompanyRole = meData.role.includes('company');
        const hasStudentRole = meData.role.includes('student');
        
        if (hasCompanyRole) {
          return 'company';
        } else if (hasStudentRole) {
          return 'student';
        }
      }
      
      // Default to student if unable to determine
      return 'student';
    } catch (error) {
      console.warn('Error determining user type, defaulting to student:', error);
      return 'student';
    }
  }

  /**
   * Check if an endpoint is available for the current user type
   * @param endpoint - The endpoint to check (e.g., 'courses', 'notifications/read/123')
   * @returns true if endpoint is available for current user type
   */
  static isEndpointAvailable(endpoint: string): boolean {
    const userType = this.getApiPrefix();
    
    if (userType === 'student') {
      // Students have access to all endpoints
      return true;
    }
    
    if (userType === 'company') {
      // Check if endpoint is in the allowed list
      if (this.COMPANY_AVAILABLE_ENDPOINTS.includes(endpoint)) {
        return true;
      }
      
      // Check if endpoint matches allowed patterns
      return this.COMPANY_ENDPOINT_PATTERNS.some(pattern => pattern.test(endpoint));
    }
    
    return false;
  }

  /**
   * Build a dynamic API endpoint with the correct prefix
   * @param endpoint - The endpoint without prefix (e.g., 'courses', 'profile')
   * @param skipAvailabilityCheck - Skip checking if endpoint is available (default: false)
   * @returns Full endpoint with prefix (e.g., 'student/courses', 'company/profile')
   * @throws Error if endpoint is not available for current user type
   */
  static buildEndpoint(endpoint: string, skipAvailabilityCheck: boolean = false): string {
    if (!skipAvailabilityCheck && !this.isEndpointAvailable(endpoint)) {
      const userType = this.getUserTypeDisplay();
      throw new Error(`Endpoint '${endpoint}' is not available for ${userType} users`);
    }
    
    const prefix = this.getApiPrefix();
    return `${prefix}/${endpoint}`;
  }

  /**
   * Build a shared API endpoint (works for both student and company)
   * @param endpoint - The shared endpoint (e.g., 'shared/contacts')
   * @returns Full endpoint with current user prefix
   */
  static buildSharedEndpoint(endpoint: string): string {
    const prefix = this.getApiPrefix();
    return `${prefix}/${endpoint}`;
  }

  /**
   * Check if current user is a company user
   */
  static isCompanyUser(): boolean {
    return this.getApiPrefix() === 'company';
  }

  /**
   * Check if current user is a student user
   * @param allowUnauthenticated - If true, returns true for unauthenticated users (default: false)
   */
  static isStudentUser(allowUnauthenticated: boolean = false): boolean {
    try {
      const meData = meStore.getState().me;
      
      // If no user data and we allow unauthenticated access
      if ((!meData || !meData.user) && allowUnauthenticated) {
        return true;
      }
      
      return this.getApiPrefix() === 'student';
    } catch (error) {
      // For unauthenticated access scenarios
      return allowUnauthenticated;
    }
  }

  /**
   * Get user type string for display purposes
   */
  static getUserTypeDisplay(): string {
    return this.isCompanyUser() ? 'Company' : 'Student';
  }
}
