import { supabase } from "../../lib/supabase";
import {
  enqueuePracticeWrite,
  getPracticeUserId,
  type StoredPracticeAnswer,
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

type ActivePracticeSessions = Record<
  string,
  StoredActivePracticeSession
>;

// Keeps the unfinished session per subject in memory and in the account's
// `practice_active_sessions` table. Each subject's writes are debounced, so
// typing does not send one request per keystroke.
const LEGACY_ACTIVE_SESSIONS_KEY = "active-practice-sessions";
const WRITE_DELAY_MS = 500;

let cachedSessions: ActivePracticeSessions = {};
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

const cancelPendingWrite = (subjectId: string) => {
  const timer = pendingTimers.get(subjectId);

  if (timer !== undefined) {
    clearTimeout(timer);
    pendingTimers.delete(subjectId);
  }
};

const cancelAllPendingWrites = () => {
  pendingTimers.forEach((timer) => clearTimeout(timer));
  pendingTimers.clear();
};

const readLegacySessions = (): ActivePracticeSessions => {
  try {
    const storedValue = localStorage.getItem(LEGACY_ACTIVE_SESSIONS_KEY);

    if (!storedValue) {
      return {};
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (
      typeof parsedValue !== "object" ||
      parsedValue === null ||
      Array.isArray(parsedValue)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.values(parsedValue as Record<string, unknown>)
        .filter(
          (item): item is StoredActivePracticeSession =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as StoredActivePracticeSession).subjectId === "string",
        )
        .map((session) => [session.subjectId, session]),
    );
  } catch {
    return {};
  }
};

/** Loads the logged-in user's unfinished sessions, and moves any browser copy into the account once. */
export const loadActivePracticeSessions = async (userId: string | null) => {
  if (!userId) {
    cachedSessions = {};
    return;
  }

  const { data, error } = await supabase
    .from("practice_active_sessions")
    .select("data")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Kunne ikke hente påbegynte økter. Prøv igjen senere.");
  }

  const sessions: ActivePracticeSessions = {};

  (data ?? []).forEach((row: { data: unknown }) => {
    const session = row.data as StoredActivePracticeSession;
    sessions[session.subjectId] = session;
  });

  cachedSessions = sessions;

  const legacy = readLegacySessions();
  const legacyList = Object.values(legacy);

  if (legacyList.length === 0) {
    return;
  }

  const { error: uploadError } = await supabase
    .from("practice_active_sessions")
    .upsert(
      legacyList.map((session) => ({
        user_id: userId,
        subject_id: session.subjectId,
        data: session,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,subject_id" },
    );

  if (uploadError) {
    console.error("Kunne ikke flytte påbegynte økter fra nettleseren:", uploadError.message);
    return;
  }

  cachedSessions = { ...sessions, ...legacy };

  try {
    localStorage.removeItem(LEGACY_ACTIVE_SESSIONS_KEY);
  } catch {
    // The copy is already in the account; a leftover browser copy is harmless.
  }
};

export const getActivePracticeSession = (
  subjectId: string,
): StoredActivePracticeSession | null => {
  return cachedSessions[subjectId] ?? null;
};

export const saveActivePracticeSession = (
  session: StoredActivePracticeSession,
) => {
  cachedSessions = { ...cachedSessions, [session.subjectId]: session };

  const userId = getPracticeUserId();

  if (!userId) {
    return;
  }

  cancelPendingWrite(session.subjectId);

  pendingTimers.set(
    session.subjectId,
    setTimeout(() => {
      pendingTimers.delete(session.subjectId);

      enqueuePracticeWrite(() =>
        supabase
          .from("practice_active_sessions")
          .upsert(
            {
              user_id: userId,
              subject_id: session.subjectId,
              data: session,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,subject_id" },
          ),
      );
    }, WRITE_DELAY_MS),
  );
};

export const clearActivePracticeSession = (
  subjectId: string,
) => {
  const remaining = { ...cachedSessions };
  delete remaining[subjectId];
  cachedSessions = remaining;
  cancelPendingWrite(subjectId);

  const userId = getPracticeUserId();

  if (userId) {
    enqueuePracticeWrite(() =>
      supabase
        .from("practice_active_sessions")
        .delete()
        .eq("user_id", userId)
        .eq("subject_id", subjectId),
    );
  }
};

export const clearAllActivePracticeSessions =
  () => {
    cachedSessions = {};
    cancelAllPendingWrites();

    try {
      localStorage.removeItem(LEGACY_ACTIVE_SESSIONS_KEY);
    } catch {
      // Nothing to remove.
    }

    const userId = getPracticeUserId();

    if (userId) {
      enqueuePracticeWrite(() =>
        supabase
          .from("practice_active_sessions")
          .delete()
          .eq("user_id", userId),
      );
    }
  };
