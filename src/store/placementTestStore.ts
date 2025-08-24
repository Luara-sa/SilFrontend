import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { StateCreator } from "zustand";
import { PlacementTestDetail, QuestionAnswer } from "services/placement-test.service";

export interface PlacementTestProgress {
  testId: number;
  currentQuestionIndex: number;
  answers: { [questionId: number]: string[] };
  timeLeft: number;
  totalTime: number;
  testStartedAt: number; // timestamp
  lastActiveAt: number; // timestamp for detecting if user left
  isStarted: boolean;
  isCompleted: boolean;
  testData?: PlacementTestDetail;
}

interface PlacementTestStoreInterface {
  // Current test progress
  currentTest: PlacementTestProgress | null;
  
  // Actions
  initializeTest: (testId: number, testData: PlacementTestDetail, totalTime: number) => void;
  startTest: () => void;
  updateProgress: (questionIndex: number, answers: { [questionId: number]: string[] }) => void;
  updateTimeLeft: (timeLeft: number) => void;
  completeTest: () => void;
  clearTest: () => void;
  
  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: (testId: number) => PlacementTestProgress | null;
  
  // Utility
  isTestInProgress: (testId: number) => boolean;
  getTestProgress: (testId: number) => PlacementTestProgress | null;
  updateLastActive: () => void;
}

const STORAGE_KEY = "placement_test_progress";

const placementTestSlice: StateCreator<
  PlacementTestStoreInterface,
  [["zustand/subscribeWithSelector", never]],
  [],
  PlacementTestStoreInterface
> = (set, get) => ({
    currentTest: null,

    initializeTest: (testId: number, testData: PlacementTestDetail, totalTime: number) => {
      const existingProgress = get().loadFromLocalStorage(testId);
      
      if (existingProgress && existingProgress.isStarted && !existingProgress.isCompleted) {
        // Resume existing test
        set({ currentTest: existingProgress });
      } else {
        // Start new test
        const newTest: PlacementTestProgress = {
          testId,
          currentQuestionIndex: 0,
          answers: {},
          timeLeft: totalTime,
          totalTime,
          testStartedAt: 0, // Will be set when test starts
          lastActiveAt: Date.now(),
          isStarted: false,
          isCompleted: false,
          testData,
        };
        set({ currentTest: newTest });
      }
      get().saveToLocalStorage();
    },

    startTest: () => {
      const { currentTest } = get();
      if (currentTest && !currentTest.isStarted) {
        const updatedTest = {
          ...currentTest,
          isStarted: true,
          testStartedAt: Date.now(),
          lastActiveAt: Date.now(),
        };
        set({ currentTest: updatedTest });
        get().saveToLocalStorage();
      }
    },

    updateProgress: (questionIndex: number, answers: { [questionId: number]: string[] }) => {
      const { currentTest } = get();
      if (currentTest) {
        const updatedTest = {
          ...currentTest,
          currentQuestionIndex: questionIndex,
          answers,
          lastActiveAt: Date.now(),
        };
        set({ currentTest: updatedTest });
        get().saveToLocalStorage();
      }
    },

    updateTimeLeft: (timeLeft: number) => {
      const { currentTest } = get();
      if (currentTest) {
        const updatedTest = {
          ...currentTest,
          timeLeft,
          lastActiveAt: Date.now(),
        };
        set({ currentTest: updatedTest });
        get().saveToLocalStorage();
      }
    },

    completeTest: () => {
      const { currentTest } = get();
      if (currentTest) {
        const updatedTest = {
          ...currentTest,
          isCompleted: true,
          lastActiveAt: Date.now(),
        };
        set({ currentTest: updatedTest });
        get().saveToLocalStorage();
      }
    },

    clearTest: () => {
      const { currentTest } = get();
      if (currentTest) {
        // Remove from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const allTests = JSON.parse(stored);
            delete allTests[currentTest.testId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allTests));
          } catch (error) {
            console.error("Error clearing test from localStorage:", error);
          }
        }
      }
      set({ currentTest: null });
    },

    saveToLocalStorage: () => {
      const { currentTest } = get();
      if (currentTest && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          const allTests = stored ? JSON.parse(stored) : {};
          allTests[currentTest.testId] = currentTest;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allTests));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      }
    },

    loadFromLocalStorage: (testId: number): PlacementTestProgress | null => {
      if (typeof window === "undefined") return null;
      
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const allTests = JSON.parse(stored);
          const testProgress = allTests[testId];
          
          if (testProgress) {
            // Check if test is not too old (e.g., more than 24 hours)
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            const age = Date.now() - testProgress.lastActiveAt;
            
            if (age > maxAge) {
              // Test is too old, remove it
              delete allTests[testId];
              localStorage.setItem(STORAGE_KEY, JSON.stringify(allTests));
              return null;
            }
            
            return testProgress;
          }
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
      return null;
    },

    isTestInProgress: (testId: number): boolean => {
      const progress = get().loadFromLocalStorage(testId);
      return progress ? (progress.isStarted && !progress.isCompleted) : false;
    },

    getTestProgress: (testId: number): PlacementTestProgress | null => {
      return get().loadFromLocalStorage(testId);
    },

    updateLastActive: () => {
      const { currentTest } = get();
      if (currentTest) {
        const updatedTest = {
          ...currentTest,
          lastActiveAt: Date.now(),
        };
        set({ currentTest: updatedTest });
        get().saveToLocalStorage();
      }
    },
  });

export const placementTestStore = create<PlacementTestStoreInterface>()(
  subscribeWithSelector(placementTestSlice)
);

// Subscribe to visibility changes to track when user leaves/returns
if (typeof window !== "undefined") {
  let isUpdating = false;
  
  const safeUpdateLastActive = () => {
    if (isUpdating) return;
    isUpdating = true;
    
    try {
      placementTestStore.getState().updateLastActive();
    } finally {
      // Use setTimeout to prevent immediate re-triggering
      setTimeout(() => {
        isUpdating = false;
      }, 100);
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      safeUpdateLastActive();
    }
  });

  // Throttle user interaction updates
  let lastUpdate = 0;
  const throttledUpdate = () => {
    const now = Date.now();
    if (now - lastUpdate > 5000) { // Update max once every 5 seconds
      lastUpdate = now;
      safeUpdateLastActive();
    }
  };
  
  document.addEventListener("mousedown", throttledUpdate);
  document.addEventListener("keydown", throttledUpdate);
}