import {
  getPracticeSessionsForSubject,
} from "./practiceStorage";

export type PracticeStatistics = {
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  bestSession: number;
};

export const getPracticeStatistics = (
  subjectId: string,
): PracticeStatistics => {
  const sessions =
    getPracticeSessionsForSubject(subjectId);

  const totalSessions = sessions.length;

  const totalQuestions = sessions.reduce(
    (sum, session) => sum + session.totalQuestions,
    0,
  );

  const correctAnswers = sessions.reduce(
    (sum, session) => sum + session.correctAnswers,
    0,
  );

  const accuracy =
    totalQuestions === 0
      ? 0
      : Math.round(
          (correctAnswers / totalQuestions) * 100,
        );

  const bestSession = sessions.reduce(
    (best, session) => {
      const percentage = Math.round(
        (session.correctAnswers /
          session.totalQuestions) *
          100,
      );

      return Math.max(best, percentage);
    },
    0,
  );

  return {
    totalSessions,
    totalQuestions,
    correctAnswers,
    accuracy,
    bestSession,
  };
};