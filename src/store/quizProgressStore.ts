import create from "zustand";

interface QuizProgress {
  courseId: number;
  chapterId: number;
  topicId: number;
  quizId: number;
  completed: boolean;
  passed: boolean;
  score: number;
  completedAt: string;
}

interface QuizProgressState {
  completedQuizzes: QuizProgress[];
  addCompletedQuiz: (progress: QuizProgress) => void;
  isQuizCompleted: (courseId: number, topicId: number) => boolean;
  isQuizPassed: (courseId: number, topicId: number) => boolean;
  getQuizScore: (courseId: number, topicId: number) => number | null;
  clearProgress: () => void;
}

export const useQuizProgressStore = create<QuizProgressState>((set, get) => ({
  completedQuizzes: [],
  
  addCompletedQuiz: (progress: QuizProgress) => {
    const { completedQuizzes } = get();
    const existingIndex = completedQuizzes.findIndex(
      (quiz) => 
        quiz.courseId === progress.courseId && 
        quiz.topicId === progress.topicId
    );
    
    if (existingIndex >= 0) {
      // Update existing record
      const updated = [...completedQuizzes];
      updated[existingIndex] = progress;
      set({ completedQuizzes: updated });
    } else {
      // Add new record
      set({ completedQuizzes: [...completedQuizzes, progress] });
    }
  },
  
  isQuizCompleted: (courseId: number, topicId: number) => {
    const { completedQuizzes } = get();
    return completedQuizzes.some(
      (quiz) => 
        quiz.courseId === courseId && 
        quiz.topicId === topicId && 
        quiz.completed
    );
  },
  
  isQuizPassed: (courseId: number, topicId: number) => {
    const { completedQuizzes } = get();
    const quiz = completedQuizzes.find(
      (quiz) => 
        quiz.courseId === courseId && 
        quiz.topicId === topicId
    );
    return quiz ? quiz.passed : false;
  },
  
  getQuizScore: (courseId: number, topicId: number) => {
    const { completedQuizzes } = get();
    const quiz = completedQuizzes.find(
      (quiz) => 
        quiz.courseId === courseId && 
        quiz.topicId === topicId
    );
    return quiz ? quiz.score : null;
  },
  
  clearProgress: () => {
    set({ completedQuizzes: [] });
  },
}));
