import { useRouter } from "next/router";
import { 
  getCourseMode as getCourseModeHelper,
  getCourseLevel as getCourseLevelHelper,
  getCourseLevelById as getCourseLevelByIdHelper,
  getLearningStructure as getLearningStructureHelper,
  getDeliveryMode as getDeliveryModeHelper
} from "helper/courseMappings";

/**
 * Hook to get translated course mode and level labels
 */
export const useCourseMappings = () => {
  const router = useRouter();
  const locale = router.locale || 'en';

  /**
   * Get translated course mode label
   * @param mode - Course mode value (hybrid, online, location)
   * @returns Translated mode label
   */
  const getCourseMode = (mode: string): string => {
    if (!mode) return '';
    return getCourseModeHelper(mode, locale);
  };

  /**
   * Get translated course level label
   * @param level - Course level name
   * @returns Translated level label
   */
  const getCourseLevel = (level: string): string => {
    if (!level) return '';
    return getCourseLevelHelper(level, locale);
  };

  /**
   * Get translated course level label by ID
   * @param levelId - Course level ID
   * @param levelName - Optional level name as fallback
   * @returns Translated level label
   */
  const getCourseLevelById = (levelId: number, levelName?: string): string => {
    return getCourseLevelByIdHelper(levelId, levelName || '', locale);
  };

  /**
   * Get translated learning structure label
   * @param structure - Learning structure value (structured, unstructured)
   * @returns Translated structure label
   */
  const getLearningStructure = (structure: string): string => {
    if (!structure) return '';
    return getLearningStructureHelper(structure, locale);
  };

  /**
   * Get translated delivery mode label
   * @param mode - Delivery mode value (synchronous, asynchronous)
   * @returns Translated mode label
   */
  const getDeliveryMode = (mode: string): string => {
    if (!mode) return '';
    return getDeliveryModeHelper(mode, locale);
  };

  return {
    getCourseMode,
    getCourseLevel,
    getCourseLevelById,
    getLearningStructure,
    getDeliveryMode,
  };
};

