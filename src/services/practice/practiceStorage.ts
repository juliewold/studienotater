import { supabase } from "../../lib/supabase";

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

// Practice history is kept per account in the `practice_sessions` table. The
// functions below read a copy held in memory and write changes through to the
// database in the background. Without a logged-in user nothing is saved, and the
// history disappears when the page is closed.
const LEGACY_SESSIONS_KEY = "practice-sessions";

let cachedSessions: StoredPracticeSession[] = [];
let cachedUserId: string | null = null;
let writeChain: Promise<void> = Promise.resolve();

export const isStoredPracticeAnswer = (
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

export const isStoredPracticeSession = (
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

type PracticeSessionRow = {
  id: string;
  subject_id: string;
  started_at: string;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
  answers: unknown;
};

const toRow = (
  session: StoredPracticeSession,
  userId: string,
): PracticeSessionRow & { user_id: string } => ({
  user_id: userId,
  id: session.id,
  subject_id: session.subjectId,
  started_at: session.startedAt,
  completed_at: session.completedAt,
  total_questions: session.totalQuestions,
  correct_answers: session.correctAnswers,
  answers: session.answers,
});

const fromRow = (row: PracticeSessionRow): StoredPracticeSession => ({
  id: row.id,
  subjectId: row.subject_id,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  totalQuestions: row.total_questions,
  correctAnswers: row.correct_answers,
  answers: Array.isArray(row.answers) ? (row.answers as StoredPracticeAnswer[]) : [],
});

const sortNewestFirst = (sessions: StoredPracticeSession[]) =>
  [...sessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt));

/** Queues a database write. Writes run one at a time, in the order they were made. */
export const enqueuePracticeWrite = (
  write: () => PromiseLike<{ error: { message: string } | null }>,
) => {
  writeChain = writeChain
    .then(async () => {
      const { error } = await write();

      if (error) {
        console.error("Kunne ikke lagre øvingsdata:", error.message);
      }
    })
    .catch((error: unknown) => {
      console.error("Kunne ikke lagre øvingsdata:", error);
    });
};

/** The account whose data is currently loaded, or null when nobody is logged in. */
export const getPracticeUserId = () => cachedUserId;

const readLegacySessions = (): StoredPracticeSession[] => {
  try {
    const storedValue = localStorage.getItem(LEGACY_SESSIONS_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? parsedValue.filter(isStoredPracticeSession)
      : [];
  } catch {
    return [];
  }
};

/**
 * Loads the logged-in user's practice sessions. Browser history from before this
 * change is moved to the account once, then removed from the browser.
 */
export const loadPracticeSessions = async (userId: string | null) => {
  if (!userId) {
    cachedSessions = [];
    cachedUserId = null;
    return;
  }

  const { data, error } = await supabase
    .from("practice_sessions")
    .select("id, subject_id, started_at, completed_at, total_questions, correct_answers, answers")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Kunne ikke hente øvingshistorikken din. Prøv igjen senere.");
  }

  const serverSessions = ((data ?? []) as PracticeSessionRow[]).map(fromRow);
  cachedSessions = sortNewestFirst(serverSessions);
  cachedUserId = userId;

  const legacySessions = readLegacySessions();

  if (legacySessions.length === 0) {
    return;
  }

  const { error: uploadError } = await supabase
    .from("practice_sessions")
    .upsert(legacySessions.map((session) => toRow(session, userId)), {
      onConflict: "user_id,id",
    });

  if (uploadError) {
    console.error("Kunne ikke flytte øvingshistorikken fra nettleseren:", uploadError.message);
    return;
  }

  const byId = new Map(serverSessions.map((session) => [session.id, session]));
  legacySessions.forEach((session) => byId.set(session.id, session));
  cachedSessions = sortNewestFirst([...byId.values()]);

  try {
    localStorage.removeItem(LEGACY_SESSIONS_KEY);
  } catch {
    // The copy is already in the account; a leftover browser copy is harmless.
  }
};

const syncSessions = (
  previous: StoredPracticeSession[],
  next: StoredPracticeSession[],
  userId: string,
) => {
  const nextIds = new Set(next.map((session) => session.id));

  previous
    .filter((session) => !nextIds.has(session.id))
    .forEach((session) => {
      enqueuePracticeWrite(() =>
        supabase
          .from("practice_sessions")
          .delete()
          .eq("user_id", userId)
          .eq("id", session.id),
      );
    });

  next.forEach((session) => {
    const before = previous.find((item) => item.id === session.id);

    if (JSON.stringify(before) === JSON.stringify(session)) {
      return;
    }

    enqueuePracticeWrite(() =>
      supabase
        .from("practice_sessions")
        .upsert(toRow(session, userId), { onConflict: "user_id,id" }),
    );
  });
};

const replaceSessions = (next: StoredPracticeSession[]) => {
  const previous = cachedSessions;
  cachedSessions = next;

  if (cachedUserId) {
    syncSessions(previous, next, cachedUserId);
  }
};

export const getPracticeSessions =
  (): StoredPracticeSession[] => cachedSessions;

export const savePracticeSession = (
  session: StoredPracticeSession,
) => {
  replaceSessions(
    sortNewestFirst([
      session,
      ...cachedSessions.filter((item) => item.id !== session.id),
    ]),
  );
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

  replaceSessions(updatedSessions);
};

export const clearPracticeSessionsForSubject = (
  subjectId: string,
) => {
  replaceSessions(
    getPracticeSessions().filter(
      (session) =>
        session.subjectId !== subjectId,
    ),
  );
};

export const clearPracticeSessions = () => {
  const userId = cachedUserId;
  cachedSessions = [];

  try {
    localStorage.removeItem(LEGACY_SESSIONS_KEY);
  } catch {
    // Nothing to remove.
  }

  if (userId) {
    enqueuePracticeWrite(() =>
      supabase
        .from("practice_sessions")
        .delete()
        .eq("user_id", userId),
    );
  }
};
