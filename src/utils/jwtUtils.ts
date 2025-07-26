interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export class JwtUtils {
  /**
   * Check if token is a JWT token (has 3 parts separated by dots)
   */
  static isJwtToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Check if token is a Laravel Sanctum token (has format "id|tokenValue")
   */
  static isSanctumToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    const parts = token.split('|');
    return parts.length === 2 && !isNaN(Number(parts[0]));
  }

  /**
   * Decode JWT token without verifying signature (client-side only)
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      if (!this.isJwtToken(token)) {
        console.warn('Attempting to decode non-JWT token');
        return null;
      }

      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * For Sanctum tokens, we can't check expiration client-side since they don't contain expiration info
   */
  static isTokenExpired(token: string): boolean {
    try {
      // For Sanctum tokens, assume they are valid (server will reject if expired)
      if (this.isSanctumToken(token)) {
        return false; // Can't determine expiration for Sanctum tokens client-side
      }

      if (!this.isJwtToken(token)) {
        return true; // Unknown token format, assume expired
      }

      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return true; // No expiration date means invalid token
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired on error
    }
  }

  /**
   * Get token expiration time in milliseconds
   * Returns null for Sanctum tokens since they don't contain expiration info
   */
  static getTokenExpiration(token: string): number | null {
    try {
      // Sanctum tokens don't have expiration info in the token itself
      if (this.isSanctumToken(token)) {
        return null;
      }

      if (!this.isJwtToken(token)) {
        return null;
      }

      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return null;
      }
      
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token will expire within the given time (in seconds)
   * For Sanctum tokens, always returns false since we can't check expiration client-side
   */
  static willTokenExpireSoon(token: string, bufferTimeSeconds: number = 300): boolean {
    try {
      // For Sanctum tokens, we can't check expiration client-side
      if (this.isSanctumToken(token)) {
        return false;
      }

      if (!this.isJwtToken(token)) {
        return true;
      }

      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < (currentTime + bufferTimeSeconds);
    } catch (error) {
      console.error('Error checking token expiration buffer:', error);
      return true;
    }
  }

  /**
   * Validate token format and structure
   * Now supports both JWT and Laravel Sanctum tokens
   */
  static isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    // Check if it's a valid JWT token
    if (this.isJwtToken(token)) {
      return true;
    }

    // Check if it's a valid Sanctum token
    if (this.isSanctumToken(token)) {
      return true;
    }

    return false;
  }

  /**
   * Get user ID from token payload
   * Only works for JWT tokens, returns null for Sanctum tokens
   */
  static getUserIdFromToken(token: string): string | null {
    try {
      if (!this.isJwtToken(token)) {
        return null; // Can't extract user ID from Sanctum tokens
      }

      const payload = this.decodeToken(token);
      return payload?.sub || payload?.user_id || payload?.id || null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  }

  /**
   * Get all claims from token
   * Only works for JWT tokens, returns null for Sanctum tokens
   */
  static getTokenClaims(token: string): JwtPayload | null {
    if (!this.isJwtToken(token)) {
      return null;
    }
    return this.decodeToken(token);
  }
} 