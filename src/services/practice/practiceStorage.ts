export type StoredPracticeAnswer = {
  questionId: string;
  subjectId: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionType: "multiple-choice" | "number-answer";
  userAnswer?: string;
  correct: boolean;
  answeredAt: string;
};

export type StoredPracticeSession = {
  id: string;
  subjectId: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  answers: StoredPracticeAnswer[];
};

const PRACTICE_SESSIONS_KEY = "practice-sessions";

const isStoredPracticeAnswer = (
  value: unknown,
): value is StoredPracticeAnswer => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const answer = value as Partial<StoredPracticeAnswer>;

  return (
    typeof answer.questionId === "string" &&
    typeof answer.subjectId === "string" &&
    typeof answer.topic === "string" &&
    (answer.difficulty === "easy" ||
      answer.difficulty === "medium" ||
      answer.difficulty === "hard") &&
    (answer.questionType === "multiple-choice" ||
      answer.questionType === "number-answer") &&
    (answer.userAnswer === undefined ||
      typeof answer.userAnswer === "string") &&
    typeof answer.correct === "boolean" &&
    typeof answer.answeredAt === "string"
  );
};

const isStoredPracticeSession = (
  value: unknown,
): value is StoredPracticeSession => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Partial<StoredPracticeSession>;

  return (
    typeof session.id === "string" &&
    typeof session.subjectId === "string" &&
    typeof session.startedAt === "string" &&
    typeof session.completedAt === "string" &&
    typeof session.totalQuestions === "number" &&
    typeof session.correctAnswers === "number" &&
    Array.isArray(session.answers) &&
    session.answers.every(isStoredPracticeAnswer)
  );
};

const writePracticeSessions = (
  sessions: StoredPracticeSession[],
) => {
  localStorage.setItem(
    PRACTICE_SESSIONS_KEY,
    JSON.stringify(sessions),
  );
};

export const getPracticeSessions =
  (): StoredPracticeSession[] => {
    try {
      const storedValue = localStorage.getItem(
        PRACTICE_SESSIONS_KEY,
      );

      if (!storedValue) {
        return [];
      }

      const parsedValue: unknown =
        JSON.parse(storedValue);

      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue.filter(
        isStoredPracticeSession,
      );
    } catch (error) {
      console.error(
        "Kunne ikke hente lagrede øvingsøkter:",
        error,
      );

      return [];
    }
  };

export const savePracticeSession = (
  session: StoredPracticeSession,
) => {
  try {
    const currentSessions =
      getPracticeSessions();

    const updatedSessions = [
      session,
      ...currentSessions,
    ];

    writePracticeSessions(updatedSessions);
  } catch (error) {
    console.error(
      "Kunne ikke lagre øvingsøkten:",
      error,
    );
  }
};

export const getPracticeSessionsForSubject = (
  subjectId: string,
) => {
  return getPracticeSessions().filter(
    (session) =>
      session.subjectId === subjectId,
  );
};

export const clearPracticeSessionsForTopic = (
  subjectId: string,
  topic: string,
) => {
  try {
    const updatedSessions = getPracticeSessions()
      .map((session) => {
        if (session.subjectId !== subjectId) {
          return session;
        }

        const remainingAnswers =
          session.answers.filter(
            (answer) => answer.topic !== topic,
          );

        return {
          ...session,
          totalQuestions:
            remainingAnswers.length,
          correctAnswers:
            remainingAnswers.filter(
              (answer) => answer.correct,
            ).length,
          answers: remainingAnswers,
        };
      })
      .filter(
        (session) =>
          session.totalQuestions > 0,
      );

    writePracticeSessions(updatedSessions);
  } catch (error) {
    console.error(
      "Kunne ikke nullstille temaet:",
      error,
    );
  }
};

export const clearPracticeSessionsForSubject = (
  subjectId: string,
) => {
  try {
    const remainingSessions =
      getPracticeSessions().filter(
        (session) =>
          session.subjectId !== subjectId,
      );

    writePracticeSessions(remainingSessions);
  } catch (error) {
    console.error(
      "Kunne ikke nullstille faget:",
      error,
    );
  }
};

export const clearPracticeSessions = () => {
  try {
    localStorage.removeItem(
      PRACTICE_SESSIONS_KEY,
    );
  } catch (error) {
    console.error(
      "Kunne ikke slette øvingshistorikken:",
      error,
    );
  }
};