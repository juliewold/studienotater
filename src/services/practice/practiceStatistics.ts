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

export type PracticeTopicStatistic = {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
};

export const getPracticeTopicStatistics = (
  subjectId: string,
): PracticeTopicStatistic[] => {
  const sessions =
    getPracticeSessionsForSubject(subjectId);

  const topicStatistics = new Map<
    string,
    {
      totalQuestions: number;
      correctAnswers: number;
    }
  >();

  for (const session of sessions) {
    for (const answer of session.answers) {
      const currentStatistic =
        topicStatistics.get(answer.topic) ?? {
          totalQuestions: 0,
          correctAnswers: 0,
        };

      currentStatistic.totalQuestions += 1;

      if (answer.correct) {
        currentStatistic.correctAnswers += 1;
      }

      topicStatistics.set(
        answer.topic,
        currentStatistic,
      );
    }
  }

  return Array.from(topicStatistics.entries()).map(
    ([topic, statistic]) => ({
      topic,
      totalQuestions:
        statistic.totalQuestions,
      correctAnswers:
        statistic.correctAnswers,
      accuracy:
        statistic.totalQuestions === 0
          ? 0
          : Math.round(
              (statistic.correctAnswers /
                statistic.totalQuestions) *
                100,
            ),
    }),
  );
};