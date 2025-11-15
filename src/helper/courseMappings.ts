/**
 * Course Mode Direct Mappings
 */
export type CourseMode = 'hybrid' | 'online' | 'location';

const COURSE_MODE_TRANSLATIONS: Record<CourseMode, { en: string; ar: string }> = {
  hybrid: { en: 'Hybrid', ar: 'هجين' },
  online: { en: 'Online', ar: 'أونلاين' },
  location: { en: 'In-Person', ar: 'حضوري' },
};

/**
 * Get course mode translation
 * @param mode - The course mode value from API
 * @param locale - Current locale ('en' or 'ar')
 * @returns Translated mode string
 */
export const getCourseMode = (mode: string, locale: string = 'en'): string => {
  const normalizedMode = mode.toLowerCase() as CourseMode;
  const translation = COURSE_MODE_TRANSLATIONS[normalizedMode];
  
  if (!translation) return mode.charAt(0).toUpperCase() + mode.slice(1);
  
  return locale === 'ar' ? translation.ar : translation.en;
};

/**
 * Course Level Direct Mappings
 */
export type CourseLevel = 
  | 'beginner' 
  | 'elementary' 
  | 'intermediate' 
  | 'upper intermediate' 
  | 'advanced' 
  | 'expert';

const COURSE_LEVEL_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  'beginner': { en: 'Beginner', ar: 'مبتدئ' },
  'elementary': { en: 'Elementary', ar: 'أساسي' },
  'intermediate': { en: 'Intermediate', ar: 'متوسط' },
  'upper intermediate': { en: 'Upper Intermediate', ar: 'فوق المتوسط' },
  'advanced': { en: 'Advanced', ar: 'متقدم' },
  'expert': { en: 'Expert', ar: 'خبير' },
};

/**
 * Get course level translation
 * @param level - The course level name from API (case-insensitive)
 * @param locale - Current locale ('en' or 'ar')
 * @returns Translated level string
 */
export const getCourseLevel = (level: string, locale: string = 'en'): string => {
  const normalizedLevel = level.toLowerCase();
  const translation = COURSE_LEVEL_TRANSLATIONS[normalizedLevel];
  
  if (!translation) return level;
  
  return locale === 'ar' ? translation.ar : translation.en;
};

/**
 * Get course level translation by ID
 * @param levelId - The course level ID
 * @param levelName - The course level name (fallback)
 * @param locale - Current locale ('en' or 'ar')
 * @returns Translated level string
 */
export const getCourseLevelById = (levelId: number, levelName: string = '', locale: string = 'en'): string => {
  const levelIdMap: Record<number, string> = {
    1: 'beginner',
    2: 'elementary',
    3: 'intermediate',
    4: 'upper intermediate',
    5: 'advanced',
    6: 'expert',
  };

  const levelKey = levelIdMap[levelId];
  if (levelKey) {
    return getCourseLevel(levelKey, locale);
  }
  
  return levelName ? getCourseLevel(levelName, locale) : levelName;
};

/**
 * Level order for sorting
 */
export const LEVEL_ORDER: Record<string, number> = {
  'beginner': 1,
  'elementary': 2,
  'intermediate': 3,
  'upper intermediate': 4,
  'advanced': 5,
  'expert': 6,
};

/**
 * Get numeric order for a level (useful for sorting)
 * @param level - The course level name
 * @returns Numeric order (1-6) or 0 if not found
 */
export const getLevelOrder = (level: string): number => {
  const normalizedLevel = level.toLowerCase();
  return LEVEL_ORDER[normalizedLevel] || 0;
};

/**
 * Learning Structure Direct Mappings
 */
export type LearningStructure = 'structured' | 'unstructured';

const LEARNING_STRUCTURE_TRANSLATIONS: Record<LearningStructure, { en: string; ar: string }> = {
  structured: { en: 'Structured', ar: 'منظم' },
  unstructured: { en: 'Unstructured', ar: 'غير منظم' },
};

/**
 * Get learning structure translation
 * @param structure - The learning structure value from API
 * @param locale - Current locale ('en' or 'ar')
 * @returns Translated structure string
 */
export const getLearningStructure = (structure: string, locale: string = 'en'): string => {
  const normalizedStructure = structure.toLowerCase().replace('_', '') as LearningStructure;
  const translation = LEARNING_STRUCTURE_TRANSLATIONS[normalizedStructure];
  
  if (!translation) return structure.replace('_', ' ');
  
  return locale === 'ar' ? translation.ar : translation.en;
};

/**
 * Delivery Mode Direct Mappings
 */
export type DeliveryMode = 'synchronous' | 'asynchronous';

const DELIVERY_MODE_TRANSLATIONS: Record<DeliveryMode, { en: string; ar: string }> = {
  synchronous: { en: 'Synchronous', ar: 'متزامن' },
  asynchronous: { en: 'Asynchronous', ar: 'غير متزامن' },
};

/**
 * Get delivery mode translation
 * @param mode - The delivery mode value from API
 * @param locale - Current locale ('en' or 'ar')
 * @returns Translated mode string
 */
export const getDeliveryMode = (mode: string, locale: string = 'en'): string => {
  const normalizedMode = mode.toLowerCase() as DeliveryMode;
  const translation = DELIVERY_MODE_TRANSLATIONS[normalizedMode];
  
  if (!translation) return mode.charAt(0).toUpperCase() + mode.slice(1);
  
  return locale === 'ar' ? translation.ar : translation.en;
};

