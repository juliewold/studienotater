import { supabase } from "../lib/supabase";

export type CalendarEventType =
  | "lecture"
  | "exercise"
  | "assignment"
  | "exam"
  | "deadline"
  | "other";

export type CalendarRecurrenceType = "none" | "weekly";

export type CalendarEvent = {
  id: string;
  subjectId: string | null;
  title: string;
  description: string;
  eventType: CalendarEventType;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  location: string;

  recurrenceType: CalendarRecurrenceType;
  recurrenceUntil: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateCalendarEventInput = {
  subjectId?: string | null;
  title: string;
  description?: string;
  eventType: CalendarEventType;
  startAt: string;
  endAt?: string | null;
  allDay?: boolean;
  location?: string;

  recurrenceType?: CalendarRecurrenceType;
  recurrenceUntil?: string | null;
};

export type UpdateCalendarEventInput = {
  subjectId?: string | null;
  title?: string;
  description?: string;
  eventType?: CalendarEventType;
  startAt?: string;
  endAt?: string | null;
  allDay?: boolean;
  location?: string;

  recurrenceType?: CalendarRecurrenceType;
  recurrenceUntil?: string | null;
};

type CalendarEventRow = {
  id: string;
  subject_id: string | null;
  title: string;
  description: string;
  event_type: CalendarEventType;
  start_at: string;
  end_at: string | null;
  all_day: boolean;
  location: string;

  recurrence_type: CalendarRecurrenceType;
  recurrence_until: string | null;

  created_at: string;
  updated_at: string;
};

const mapCalendarEvent = (event: CalendarEventRow): CalendarEvent => {
  return {
    id: event.id,
    subjectId: event.subject_id,
    title: event.title,
    description: event.description,
    eventType: event.event_type,
    startAt: event.start_at,
    endAt: event.end_at,
    allDay: event.all_day,
    location: event.location,

    recurrenceType: event.recurrence_type,
    recurrenceUntil: event.recurrence_until,

    createdAt: event.created_at,
    updatedAt: event.updated_at,
  };
};

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("start_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as CalendarEventRow[]).map(mapCalendarEvent);
};

export const createCalendarEvent = async (
  input: CreateCalendarEventInput,
): Promise<CalendarEvent> => {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      subject_id: input.subjectId ?? null,
      title: input.title,
      description: input.description ?? "",
      event_type: input.eventType,
      start_at: input.startAt,
      end_at: input.endAt ?? null,
      all_day: input.allDay ?? false,
      location: input.location ?? "",

      recurrence_type: input.recurrenceType ?? "none",
      recurrence_until: input.recurrenceUntil ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapCalendarEvent(data as CalendarEventRow);
};

export const updateCalendarEvent = async (
  id: string,
  input: UpdateCalendarEventInput,
): Promise<CalendarEvent> => {
  const updates: Partial<CalendarEventRow> = {};

  if (input.subjectId !== undefined) {
    updates.subject_id = input.subjectId;
  }

  if (input.title !== undefined) {
    updates.title = input.title;
  }

  if (input.description !== undefined) {
    updates.description = input.description;
  }

  if (input.eventType !== undefined) {
    updates.event_type = input.eventType;
  }

  if (input.startAt !== undefined) {
    updates.start_at = input.startAt;
  }

  if (input.endAt !== undefined) {
    updates.end_at = input.endAt;
  }

  if (input.allDay !== undefined) {
    updates.all_day = input.allDay;
  }

  if (input.location !== undefined) {
    updates.location = input.location;
  }

  if (input.recurrenceType !== undefined) {
    updates.recurrence_type = input.recurrenceType;
  }

  if (input.recurrenceUntil !== undefined) {
    updates.recurrence_until = input.recurrenceUntil;
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapCalendarEvent(data as CalendarEventRow);
};

export const deleteCalendarEvent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};
