import type {
  StoredPracticeAnswer,
} from "./practiceStorage";

export type ActivePracticeMode =
  | "standard"
  | "mistakes";

export type StoredActivePracticeSession = {
  subjectId: string;
  questionIds: string[];
  currentQuestionIndex: number;
  selectedOption: string;
  numberAnswer: string;
  isAnswerChecked: boolean;
  correctAnswers: number;
  answers: StoredPracticeAnswer[];
  startedAt: string;
  updatedAt: string;
  mode: ActivePracticeMode;
};

const ACTIVE_PRACTICE_SESSIONS_KEY =
  "active-practice-sessions";

type ActivePracticeSessions = Record<
  string,
  StoredActivePracticeSession
>;

const getAllActivePracticeSessions =
  (): ActivePracticeSessions => {
    try {
      const storedValue = localStorage.getItem(
        ACTIVE_PRACTICE_SESSIONS_KEY,
      );

      if (!storedValue) {
        return {};
      }

      const parsedValue: unknown =
        JSON.parse(storedValue);

      if (
        typeof parsedValue !== "object" ||
        parsedValue === null ||
        Array.isArray(parsedValue)
      ) {
        return {};
      }

      return parsedValue as ActivePracticeSessions;
    } catch (error) {
      console.error(
        "Kunne ikke hente påbegynte økter:",
        error,
      );

      return {};
    }
  };

const saveAllActivePracticeSessions = (
  sessions: ActivePracticeSessions,
) => {
  localStorage.setItem(
    ACTIVE_PRACTICE_SESSIONS_KEY,
    JSON.stringify(sessions),
  );
};

export const getActivePracticeSession = (
  subjectId: string,
): StoredActivePracticeSession | null => {
  const sessions =
    getAllActivePracticeSessions();

  return sessions[subjectId] ?? null;
};

export const saveActivePracticeSession = (
  session: StoredActivePracticeSession,
) => {
  try {
    const sessions =
      getAllActivePracticeSessions();

    sessions[session.subjectId] = session;

    saveAllActivePracticeSessions(sessions);
  } catch (error) {
    console.error(
      "Kunne ikke lagre påbegynt økt:",
      error,
    );
  }
};

export const clearActivePracticeSession = (
  subjectId: string,
) => {
  try {
    const sessions =
      getAllActivePracticeSessions();

    delete sessions[subjectId];

    saveAllActivePracticeSessions(sessions);
  } catch (error) {
    console.error(
      "Kunne ikke slette påbegynt økt:",
      error,
    );
  }
};

export const clearAllActivePracticeSessions =
  () => {
    try {
      localStorage.removeItem(
        ACTIVE_PRACTICE_SESSIONS_KEY,
      );
    } catch (error) {
      console.error(
        "Kunne ikke slette påbegynte økter:",
        error,
      );
    }
  };