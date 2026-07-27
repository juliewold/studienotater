export type StoredPracticeAnswer = {
  questionId: string;
  subjectId: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionType: "multiple-choice" | "number-answer";
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

export const getPracticeSessions =
  (): StoredPracticeSession[] => {
    try {
      const storedValue = localStorage.getItem(
        PRACTICE_SESSIONS_KEY,
      );

      if (!storedValue) {
        return [];
      }

      const parsedValue: unknown = JSON.parse(storedValue);

      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue.filter(isStoredPracticeSession);
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
    const currentSessions = getPracticeSessions();

    const updatedSessions = [
      session,
      ...currentSessions,
    ];

    localStorage.setItem(
      PRACTICE_SESSIONS_KEY,
      JSON.stringify(updatedSessions),
    );
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
    (session) => session.subjectId === subjectId,
  );
};

export const clearPracticeSessions = () => {
  try {
    localStorage.removeItem(PRACTICE_SESSIONS_KEY);
  } catch (error) {
    console.error(
      "Kunne ikke slette øvingshistorikken:",
      error,
    );
  }
};