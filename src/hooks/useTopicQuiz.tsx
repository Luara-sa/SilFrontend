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

      const response = await _QuizService.startQuiz(startRequest);

      // Check if the response indicates quiz is already started
      if (
        !response.data.status &&
        response.data.message === "You have already started this quiz."
      ) {
        // This is not an error - quiz is already in progress
        return true; // Return true because the quiz is already started
      }

      return response.data.status;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;

      // "Already started" is not really an error - it means we can proceed
      if (errorMessage === "You have already started this quiz.") {
        return true;
      }

      setError(errorMessage || "Failed to start quiz");
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
        // Check if it's the expected "not found" response (no result exists yet)
        // This is NOT an error - it just means the quiz hasn't been submitted yet
        if (response.data.message === "response.not_found") {
          setQuizResult(null);
          return null;
        }

        // For other false statuses, set error (but don't show toast - interceptor handles it)
        setError(response.data.message || "Failed to get quiz result");
        return null;
      }
    } catch (err: any) {
      // Only set error for actual network/server errors
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
