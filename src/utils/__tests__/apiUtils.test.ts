import { ApiUtils } from '../apiUtils';
import { meStore } from 'store/meStore';

// Mock the meStore
jest.mock('store/meStore', () => ({
  meStore: {
    getState: jest.fn(),
  },
}));

describe('ApiUtils', () => {
  const mockGetState = meStore.getState as jest.MockedFunction<typeof meStore.getState>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getApiPrefix', () => {
    it('should return "student" by default when no user data', () => {
      mockGetState.mockReturnValue({ me: undefined });
      expect(ApiUtils.getApiPrefix()).toBe('student');
    });

    it('should return "company" when user_type is company', () => {
      mockGetState.mockReturnValue({
        me: {
          user: { user_type: 'company' },
          role: ['company'],
          info_system: {},
        },
      });
      expect(ApiUtils.getApiPrefix()).toBe('company');
    });

    it('should return "student" when user_type is student', () => {
      mockGetState.mockReturnValue({
        me: {
          user: { user_type: 'student' },
          role: ['student'],
          info_system: {},
        },
      });
      expect(ApiUtils.getApiPrefix()).toBe('student');
    });

    it('should fallback to role array when user_type is not available', () => {
      mockGetState.mockReturnValue({
        me: {
          user: {},
          role: ['company'],
          info_system: {},
        },
      });
      expect(ApiUtils.getApiPrefix()).toBe('company');
    });

    it('should return "student" when error occurs', () => {
      mockGetState.mockImplementation(() => {
        throw new Error('Store error');
      });
      expect(ApiUtils.getApiPrefix()).toBe('student');
    });
  });

  describe('buildEndpoint', () => {
    it('should build student endpoint correctly', () => {
      mockGetState.mockReturnValue({
        me: {
          user: { user_type: 'student' },
          role: ['student'],
          info_system: {},
        },
      });
      expect(ApiUtils.buildEndpoint('courses')).toBe('student/courses');
    });

    it('should build company endpoint correctly', () => {
      mockGetState.mockReturnValue({
        me: {
          user: { user_type: 'company' },
          role: ['company'],
          info_system: {},
        },
      });
      expect(ApiUtils.buildEndpoint('courses')).toBe('company/courses');
    });
  });

  describe('utility methods', () => {
    it('should correctly identify company user', () => {
      mockGetState.mockReturnValue({
        me: {
          user: { user_type: 'company' },
          role: ['company'],
          info_system: {},
        },
      });
      expect(ApiUtils.isCompanyUser()).toBe(true);
      expect(ApiUtils.isStudentUser()).toBe(false);
      expect(ApiUtils.getUserTypeDisplay()).toBe('Company');
    });

    it('should correctly identify student user', () => {
      mockGetState.mockReturnValue({
        me: {
          user: { user_type: 'student' },
          role: ['student'],
          info_system: {},
        },
      });
      expect(ApiUtils.isCompanyUser()).toBe(false);
      expect(ApiUtils.isStudentUser()).toBe(true);
      expect(ApiUtils.getUserTypeDisplay()).toBe('Student');
    });
  });
});
