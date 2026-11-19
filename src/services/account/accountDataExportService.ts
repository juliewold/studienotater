import { supabase } from "../../lib/supabase";

/**
 * Account-keyed personal tables, matching the deletion manifest
 * (`account_deletion_targets()`). `calendar_events` is shared and has no
 * `user_id`, so it is not exported as personal data. Shared notes are not
 * attributed to a user in production (`notes.created_by` is absent).
 */
export const exportTables = [
  { table: "profiles", column: "id" },
  { table: "favorites", column: "user_id" },
  { table: "progress", column: "user_id" },
  { table: "book_progress", column: "user_id" },
  { table: "book_task_progress", column: "user_id" },
  { table: "exam_task_progress", column: "user_id" },
  { table: "semester_subjects", column: "user_id" },
  { table: "practice_sessions", column: "user_id" },
  { table: "practice_active_sessions", column: "user_id" },
  { table: "flashcard_progress", column: "user_id" },
] as const;

export type ExportUser = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
};

export type RowFetcher = (table: string, column: string, userId: string) => Promise<unknown[]>;

export type AccountExport = {
  exportedAt: string;
  account: { id: string; email: string | null; createdAt: string | null; username: string | null; fullName: string | null };
  /** Rows per table, one entry for each account-owned personal table. */
  tables: Record<string, unknown[]>;
};

const fetchRowsFromSupabase: RowFetcher = async (table, column, userId) => {
  const { data, error } = await supabase.from(table).select("*").eq(column, userId);
  if (error) throw new Error("Kunne ikke hente alle opplysningene dine. Prøv igjen senere.");
  return data ?? [];
};

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value : null);

export async function buildAccountExport(user: ExportUser, fetchRows: RowFetcher = fetchRowsFromSupabase): Promise<AccountExport> {
  const tables: Record<string, unknown[]> = {};
  // Sequential on purpose: a failure stops the export instead of producing a partial file silently.
  for (const { table, column } of exportTables) {
    tables[table] = await fetchRows(table, column, user.id);
  }
  return {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: text(user.email),
      createdAt: text(user.created_at),
      username: text(user.user_metadata?.username),
      fullName: text(user.user_metadata?.full_name),
    },
    tables,
  };
}

export function downloadAccountExport(data: AccountExport) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = data.exportedAt.slice(0, 10);
  link.href = url;
  link.download = `studienotater-mine-data-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
