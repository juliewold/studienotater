import "./UpcomingTasks.css";

import { useEffect, useMemo, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getCalendarEvents,
  type CalendarEvent,
} from "../../services/calendarService";

import { subjects } from "../../data/subjects";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";

type UpcomingTaskOccurrence = {
  id: string;
  subjectId: string;
  title: string;
  eventType: CalendarEvent["eventType"];
  start: Date;
};

const INITIAL_VISIBLE_TASKS = 5;
const TASKS_PER_LOAD = 5;

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);

  return result;
};

const getTimeUntilLabel = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);

  const differenceInDays = Math.round(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays === 0) {
    return "I dag";
  }

  if (differenceInDays === 1) {
    return "I morgen";
  }

  if (differenceInDays <= 7) {
    return `Om ${differenceInDays} dager`;
  }

  return date.toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const getEventTypeLabel = (eventType: CalendarEvent["eventType"]) => {
  if (eventType === "exercise") {
    return "Øving";
  }

  if (eventType === "assignment") {
    return "Innlevering";
  }

  return "Frist";
};

const expandUpcomingEvent = (
  event: CalendarEvent,
  now: Date,
  rangeEnd: Date,
): UpcomingTaskOccurrence[] => {
  if (!event.subjectId) {
    return [];
  }

  const firstStart = new Date(event.startAt);

  if (event.recurrenceType === "none") {
    if (firstStart < now || firstStart > rangeEnd) {
      return [];
    }

    return [
      {
        id: `${event.id}-${firstStart.toISOString()}`,
        subjectId: event.subjectId,
        title: event.title,
        eventType: event.eventType,
        start: firstStart,
      },
    ];
  }

  const occurrences: UpcomingTaskOccurrence[] = [];

  const recurrenceEnd = event.recurrenceUntil
    ? new Date(`${event.recurrenceUntil}T23:59:59`)
    : rangeEnd;

  let occurrenceStart = new Date(firstStart);

  while (occurrenceStart <= rangeEnd && occurrenceStart <= recurrenceEnd) {
    if (occurrenceStart >= now) {
      occurrences.push({
        id: `${event.id}-${occurrenceStart.toISOString()}`,
        subjectId: event.subjectId,
        title: event.title,
        eventType: event.eventType,
        start: new Date(occurrenceStart),
      });
    }

    occurrenceStart = addDays(occurrenceStart, 7);
  }

  return occurrences;
};

export const UpcomingTasks = () => {
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [visibleTaskCount, setVisibleTaskCount] = useState(
    INITIAL_VISIBLE_TASKS,
  );

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);

      try {
        const loadedEvents = await getCalendarEvents();

        setEvents(loadedEvents);
      } catch (error) {
        console.error("Kunne ikke hente kommende oppgaver:", error);

        setEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  const upcomingTasks = useMemo(() => {
    const selectedSubjectIds = semesterSubjects.map(
      (semesterSubject) => semesterSubject.subjectId,
    );

    const now = new Date();

    const rangeEnd = new Date(now);
    rangeEnd.setMonth(rangeEnd.getMonth() + 3);

    return events
      .filter((event) => {
        if (!event.subjectId) {
          return false;
        }

        if (!selectedSubjectIds.includes(event.subjectId)) {
          return false;
        }

        return (
          event.eventType === "exercise" ||
          event.eventType === "assignment" ||
          event.eventType === "deadline"
        );
      })
      .flatMap((event) => expandUpcomingEvent(event, now, rangeEnd))
      .sort(
        (firstEvent, secondEvent) =>
          firstEvent.start.getTime() - secondEvent.start.getTime(),
      );
  }, [events, semesterSubjects]);

  const visibleTasks = upcomingTasks.slice(0, visibleTaskCount);

  const hasMoreTasks = visibleTaskCount < upcomingTasks.length;

  const isShowingMore = visibleTaskCount > INITIAL_VISIBLE_TASKS;

  if (isLoadingSemesterSubjects || isLoadingEvents) {
    return null;
  }

  if (upcomingTasks.length === 0) {
    return null;
  }

  return (
    <section className="upcoming-tasks">
      <div className="upcoming-tasks-header">
        <h2>Kommende</h2>

        <Link to="/kalender">Se kalender →</Link>
      </div>

      <div className="upcoming-tasks-list">
        {visibleTasks.map((event) => {
          const semesterSubject = semesterSubjects.find(
            (subject) => subject.subjectId === event.subjectId,
          );

          const regularSubject = subjects.find(
            (subject) => subject.id === event.subjectId,
          );

          const subjectCode =
            semesterSubject?.customCode ??
            regularSubject?.code ??
            event.subjectId.toUpperCase();

          return (
            <div key={event.id} className="upcoming-task">
              <div className="upcoming-task-content">
                <span className="upcoming-task-code">{subjectCode}</span>

                <div className="upcoming-task-info">
                  <h3>{event.title}</h3>

                  <p>{getEventTypeLabel(event.eventType)}</p>
                </div>
              </div>

              <time dateTime={event.start.toISOString()}>
                {getTimeUntilLabel(event.start)}
              </time>
            </div>
          );
        })}
      </div>

      {(hasMoreTasks || isShowingMore) && (
        <div className="upcoming-tasks-more">
          <button
            type="button"
            className="upcoming-tasks-more-button"
            aria-label={
              hasMoreTasks
                ? "Vis flere kommende oppgaver"
                : "Vis færre kommende oppgaver"
            }
            onClick={() => {
              if (hasMoreTasks) {
                setVisibleTaskCount((currentCount) =>
                  Math.min(currentCount + TASKS_PER_LOAD, upcomingTasks.length),
                );

                return;
              }

              setVisibleTaskCount(INITIAL_VISIBLE_TASKS);
            }}
          >
            {hasMoreTasks ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
        </div>
      )}
    </section>
  );
};
