import { useState, useCallback } from "react";
import {
  _QuizService,
  QuizStartRequest,
  QuizResultResponse,
} from "services/quiz.service";
import { TopicQuiz } from "interface/common";

interface UseTopicQuizProps {
  courseId: string;
  topicId: string;
  quizId: string;
}

export const useTopicQuiz = ({
  courseId,
  topicId,
  quizId,
}: UseTopicQuizProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<any>(null);

  const startQuiz = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const startRequest: QuizStartRequest = {
        quiz_type: "topic",
        course_id: courseId,
        topic_id: topicId,
        quiz_id: quizId,
      };

      await _QuizService.startQuiz(startRequest);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start quiz");
      return false;
    } finally {
      setLoading(false);
    }
  }, [courseId, topicId, quizId]);

  const getQuizResult = useCallback(async (): Promise<any | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await _QuizService.getQuizResult(quizId, {
        course_id: courseId,
        topic_id: topicId,
        quiz_id: quizId,
      });

      if (response.data.status) {
        setQuizResult(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || "Failed to get quiz result");
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get quiz result");
      return null;
    } finally {
      setLoading(false);
    }
  }, [courseId, topicId, quizId]);

  const resetQuiz = useCallback(() => {
    setQuizResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    quizResult,
    startQuiz,
    getQuizResult,
    resetQuiz,
  };
};
