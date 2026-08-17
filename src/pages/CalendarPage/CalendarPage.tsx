import "./CalendarPage.css";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Repeat2,
  Trash2,
  X,
} from "lucide-react";

import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  updateCalendarEvent,
  type CalendarEvent,
  type CalendarEventType,
  type CalendarRecurrenceType,
} from "../../services/calendarService";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";
import { subjects } from "../../data/subjects";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const eventTypeOptions: {
  value: CalendarEventType;
  label: string;
}[] = [
  {
    value: "lecture",
    label: "Forelesning",
  },
  {
    value: "exercise",
    label: "Øving",
  },
  {
    value: "assignment",
    label: "Innlevering",
  },
  {
    value: "exam",
    label: "Eksamen",
  },
  {
    value: "deadline",
    label: "Frist",
  },
  {
    value: "other",
    label: "Annet",
  },
];

const recurrenceOptions: {
  value: CalendarRecurrenceType;
  label: string;
}[] = [
  {
    value: "none",
    label: "Gjentas ikke",
  },
  {
    value: "weekly",
    label: "Hver uke",
  },
];

const weekDays = ["Man.", "Tir.", "Ons.", "Tor.", "Fre.", "Lør.", "Søn."];

const weekHours = Array.from({ length: 14 }, (_, index) => index + 8);

const WEEK_HOUR_HEIGHT = 56;

const getScheduleTop = (date: Date) => {
  const scheduleStartHour = 8;

  const hoursFromStart =
    date.getHours() - scheduleStartHour + date.getMinutes() / 60;

  return hoursFromStart * WEEK_HOUR_HEIGHT;
};

type CalendarOccurrence = {
  id: string;
  sourceEventId: string;
  subjectId: string | null;
  title: string;
  eventType: CalendarEventType;
  start: Date;
  end: Date | null;
  allDay: boolean;
  location: string;
};

const createLocalDateTime = (date: string, time: string) => {
  if (!date) {
    return "";
  }

  const resolvedTime = time || "00:00";

  return new Date(`${date}T${resolvedTime}:00`).toISOString();
};

const getLocalDateValue = (date: Date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getLocalTimeValue = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const startOfCalendarGrid = (date: Date) => {
  const firstDay = startOfMonth(date);

  const day = firstDay.getDay();

  const daysSinceMonday = day === 0 ? 6 : day - 1;

  const result = new Date(firstDay);

  result.setDate(firstDay.getDate() - daysSinceMonday);

  result.setHours(0, 0, 0, 0);

  return result;
};

const endOfCalendarGrid = (date: Date) => {
  const gridStart = startOfCalendarGrid(date);

  const result = new Date(gridStart);

  result.setDate(result.getDate() + 41);
  result.setHours(23, 59, 59, 999);

  return result;
};

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);

  return result;
};

const startOfWeek = (date: Date) => {
  const result = new Date(date);

  const day = result.getDay();

  const daysSinceMonday = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - daysSinceMonday);

  result.setHours(0, 0, 0, 0);

  return result;
};

const endOfWeek = (date: Date) => {
  const result = startOfWeek(date);

  result.setDate(result.getDate() + 6);

  result.setHours(23, 59, 59, 999);

  return result;
};

const addMonths = (date: Date, amount: number) => {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
};

const isSameDay = (firstDate: Date, secondDate: Date) => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getOccurrenceEnd = (event: CalendarEvent, occurrenceStart: Date) => {
  if (!event.endAt) {
    return null;
  }

  const originalStart = new Date(event.startAt);

  const originalEnd = new Date(event.endAt);

  const duration = originalEnd.getTime() - originalStart.getTime();

  return new Date(occurrenceStart.getTime() + duration);
};

const expandCalendarEvents = (
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarOccurrence[] => {
  const occurrences: CalendarOccurrence[] = [];

  events.forEach((event) => {
    const firstStart = new Date(event.startAt);

    if (event.recurrenceType === "none") {
      if (firstStart >= rangeStart && firstStart <= rangeEnd) {
        occurrences.push({
          id: `${event.id}-${getDateKey(firstStart)}`,
          sourceEventId: event.id,
          subjectId: event.subjectId,
          title: event.title,
          eventType: event.eventType,
          start: firstStart,
          end: event.endAt ? new Date(event.endAt) : null,
          allDay: event.allDay,
          location: event.location,
        });
      }

      return;
    }

    if (event.recurrenceType === "weekly") {
      const recurrenceEnd = event.recurrenceUntil
        ? new Date(`${event.recurrenceUntil}T23:59:59`)
        : rangeEnd;

      let occurrenceStart = new Date(firstStart);

      while (occurrenceStart <= rangeEnd && occurrenceStart <= recurrenceEnd) {
        if (occurrenceStart >= rangeStart) {
          occurrences.push({
            id: `${event.id}-${getDateKey(occurrenceStart)}`,
            sourceEventId: event.id,
            subjectId: event.subjectId,
            title: event.title,
            eventType: event.eventType,
            start: new Date(occurrenceStart),
            end: getOccurrenceEnd(event, occurrenceStart),
            allDay: event.allDay,
            location: event.location,
          });
        }

        occurrenceStart = addDays(occurrenceStart, 7);
      }
    }
  });

  return occurrences.sort(
    (firstOccurrence, secondOccurrence) =>
      firstOccurrence.start.getTime() - secondOccurrence.start.getTime(),
  );
};

export const CalendarPage = () => {
  const { isAdmin } = useContext(AuthContext);

  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
    "month",
  );

  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date()));

  const [currentDay, setCurrentDay] = useState(() => new Date());

  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [selectedOccurrence, setSelectedOccurrence] =
    useState<CalendarOccurrence | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date()),
  );

  const [eventSubjectId, setEventSubjectId] = useState("");

  const [eventTitle, setEventTitle] = useState("");

  const [eventType, setEventType] = useState<CalendarEventType>("lecture");

  const [eventDate, setEventDate] = useState("");

  const [eventStartTime, setEventStartTime] = useState("");

  const [eventEndTime, setEventEndTime] = useState("");

  const [eventAllDay, setEventAllDay] = useState(false);

  const [eventLocation, setEventLocation] = useState("");

  const [eventDescription, setEventDescription] = useState("");

  const [eventRecurrenceType, setEventRecurrenceType] =
    useState<CalendarRecurrenceType>("none");

  const [eventRecurrenceUntil, setEventRecurrenceUntil] = useState("");

  const [isSavingEvent, setIsSavingEvent] = useState(false);

  const [eventFormError, setEventFormError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      setErrorMessage("");

      try {
        const loadedEvents = await getCalendarEvents();

        setEvents(loadedEvents);
      } catch (error) {
        console.error("Kunne ikke hente kalenderhendelser:", error);

        setErrorMessage("Kunne ikke hente kalenderhendelsene.");
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  const selectedSubjectIds = useMemo(
    () => semesterSubjects.map((subject) => subject.subjectId),
    [semesterSubjects],
  );

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      if (event.subjectId === null) {
        return true;
      }

      return selectedSubjectIds.includes(event.subjectId);
    });
  }, [events, selectedSubjectIds]);

  const selectedSourceEvent = useMemo(() => {
    if (!selectedOccurrence) {
      return null;
    }

    return (
      events.find((event) => event.id === selectedOccurrence.sourceEventId) ??
      null
    );
  }, [events, selectedOccurrence]);

  const calendarGridStart = useMemo(
    () => startOfCalendarGrid(currentMonth),
    [currentMonth],
  );

  const calendarGridEnd = useMemo(
    () => endOfCalendarGrid(currentMonth),
    [currentMonth],
  );

  const calendarDays = useMemo(() => {
    return Array.from(
      {
        length: 42,
      },
      (_, index) => addDays(calendarGridStart, index),
    );
  }, [calendarGridStart]);

  const occurrences = useMemo(
    () =>
      expandCalendarEvents(visibleEvents, calendarGridStart, calendarGridEnd),
    [visibleEvents, calendarGridStart, calendarGridEnd],
  );

  const occurrencesByDate = useMemo(() => {
    const result: Record<string, CalendarOccurrence[]> = {};

    occurrences.forEach((occurrence) => {
      const key = getDateKey(occurrence.start);

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(occurrence);
    });

    return result;
  }, [occurrences]);

  const weekOccurrencesByDate = useMemo(() => {
    const weekOccurrences = expandCalendarEvents(
      visibleEvents,
      startOfWeek(currentWeek),
      endOfWeek(currentWeek),
    );

    const result: Record<string, CalendarOccurrence[]> = {};

    weekOccurrences.forEach((occurrence) => {
      const key = getDateKey(occurrence.start);

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(occurrence);
    });

    return result;
  }, [visibleEvents, currentWeek]);

  const dayOccurrences = useMemo(() => {
    const dayStart = new Date(currentDay);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(currentDay);
    dayEnd.setHours(23, 59, 59, 999);

    return expandCalendarEvents(visibleEvents, dayStart, dayEnd);
  }, [visibleEvents, currentDay]);

  const getSubjectCode = (subjectId: string | null) => {
    if (!subjectId) {
      return "Generelt";
    }

    return (
      subjects.find((subject) => subject.id === subjectId)?.code ??
      subjectId.toUpperCase()
    );
  };

  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) {
      return "Generell hendelse";
    }

    return subjects.find((subject) => subject.id === subjectId)?.name ?? "";
  };

  const getEventTypeLabel = (eventType: CalendarEventType) => {
    return (
      eventTypeOptions.find((option) => option.value === eventType)?.label ??
      "Annet"
    );
  };

  const formatOccurrenceDate = (date: Date) => {
    return date.toLocaleDateString("nb-NO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRecurrenceUntil = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const resetEventForm = () => {
    setEventSubjectId("");
    setEventTitle("");
    setEventType("lecture");
    setEventDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventAllDay(false);
    setEventLocation("");
    setEventDescription("");
    setEventRecurrenceType("none");
    setEventRecurrenceUntil("");
    setEventFormError("");
  };

  const openNewEventModal = () => {
    resetEventForm();

    setEditingEventId(null);
    setIsNewEventModalOpen(true);
  };

  const closeNewEventModal = () => {
    if (isSavingEvent) {
      return;
    }

    setIsNewEventModalOpen(false);
    setEditingEventId(null);

    resetEventForm();
  };

  const openEditEventModal = () => {
    if (!selectedSourceEvent) {
      return;
    }

    const sourceStart = new Date(selectedSourceEvent.startAt);

    const sourceEnd = selectedSourceEvent.endAt
      ? new Date(selectedSourceEvent.endAt)
      : null;

    setEventSubjectId(selectedSourceEvent.subjectId ?? "");

    setEventTitle(selectedSourceEvent.title);

    setEventType(selectedSourceEvent.eventType);

    setEventDate(getLocalDateValue(sourceStart));

    setEventAllDay(selectedSourceEvent.allDay);

    setEventStartTime(
      selectedSourceEvent.allDay ? "" : getLocalTimeValue(sourceStart),
    );

    setEventEndTime(
      !selectedSourceEvent.allDay && sourceEnd
        ? getLocalTimeValue(sourceEnd)
        : "",
    );

    setEventLocation(selectedSourceEvent.location);

    setEventDescription(selectedSourceEvent.description);

    setEventRecurrenceType(selectedSourceEvent.recurrenceType);

    setEventRecurrenceUntil(selectedSourceEvent.recurrenceUntil ?? "");

    setEventFormError("");

    setEditingEventId(selectedSourceEvent.id);

    setIsEditEventModalOpen(true);
  };

  const closeEditEventModal = () => {
    if (isSavingEvent) {
      return;
    }

    setIsEditEventModalOpen(false);
    setEditingEventId(null);

    resetEventForm();
  };

  const closeEventDetails = () => {
    if (isDeletingEvent || isSavingEvent) {
      return;
    }

    setSelectedOccurrence(null);
    setIsDeleteModalOpen(false);
    setIsEditEventModalOpen(false);
    setEditingEventId(null);
    setDeleteErrorMessage("");
  };

  const openDeleteModal = () => {
    setDeleteErrorMessage("");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeletingEvent) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeleteErrorMessage("");
  };

  const validateEventForm = () => {
    const trimmedTitle = eventTitle.trim();

    if (!trimmedTitle) {
      setEventFormError("Hendelsen må ha en tittel.");
      return false;
    }

    if (!eventDate) {
      setEventFormError("Du må velge en dato.");
      return false;
    }

    if (!eventAllDay && !eventStartTime) {
      setEventFormError("Du må velge starttid.");
      return false;
    }

    if (
      !eventAllDay &&
      eventEndTime &&
      eventStartTime &&
      eventEndTime < eventStartTime
    ) {
      setEventFormError("Sluttid kan ikke være før starttid.");
      return false;
    }

    if (eventRecurrenceType === "weekly" && !eventRecurrenceUntil) {
      setEventFormError(
        "Du må velge når den ukentlige gjentakelsen skal stoppe.",
      );
      return false;
    }

    if (eventRecurrenceType === "weekly" && eventRecurrenceUntil < eventDate) {
      setEventFormError(
        "Sluttdato for gjentakelsen kan ikke være før startdatoen.",
      );
      return false;
    }

    return true;
  };

  const getEventInput = () => {
    const startAt = createLocalDateTime(
      eventDate,
      eventAllDay ? "00:00" : eventStartTime,
    );

    const endAt =
      eventEndTime && !eventAllDay
        ? createLocalDateTime(eventDate, eventEndTime)
        : null;

    return {
      subjectId: eventSubjectId || null,

      title: eventTitle.trim(),

      description: eventDescription.trim(),

      eventType,

      startAt,
      endAt,

      allDay: eventAllDay,

      location: eventLocation.trim(),

      recurrenceType: eventRecurrenceType,

      recurrenceUntil:
        eventRecurrenceType === "weekly" ? eventRecurrenceUntil : null,
    };
  };

  const handleCreateEvent = async () => {
    if (!validateEventForm()) {
      return;
    }

    setIsSavingEvent(true);
    setEventFormError("");

    try {
      const createdEvent = await createCalendarEvent(getEventInput());

      setEvents((currentEvents) =>
        [...currentEvents, createdEvent].sort(
          (firstEvent, secondEvent) =>
            new Date(firstEvent.startAt).getTime() -
            new Date(secondEvent.startAt).getTime(),
        ),
      );

      setCurrentMonth(startOfMonth(new Date(createdEvent.startAt)));

      setIsNewEventModalOpen(false);

      resetEventForm();
    } catch (error) {
      console.error("Kunne ikke opprette kalenderhendelsen:", error);

      setEventFormError("Kunne ikke opprette kalenderhendelsen.");
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEventId || !validateEventForm()) {
      return;
    }

    setIsSavingEvent(true);
    setEventFormError("");

    try {
      const updatedEvent = await updateCalendarEvent(
        editingEventId,
        getEventInput(),
      );

      setEvents((currentEvents) =>
        currentEvents
          .map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
          .sort(
            (firstEvent, secondEvent) =>
              new Date(firstEvent.startAt).getTime() -
              new Date(secondEvent.startAt).getTime(),
          ),
      );

      setCurrentMonth(startOfMonth(new Date(updatedEvent.startAt)));

      setIsEditEventModalOpen(false);
      setEditingEventId(null);
      setSelectedOccurrence(null);

      resetEventForm();
    } catch (error) {
      console.error("Kunne ikke oppdatere kalenderhendelsen:", error);

      setEventFormError("Kunne ikke oppdatere kalenderhendelsen.");
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedSourceEvent) {
      return;
    }

    setIsDeletingEvent(true);
    setDeleteErrorMessage("");

    try {
      await deleteCalendarEvent(selectedSourceEvent.id);

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== selectedSourceEvent.id),
      );

      setIsDeleteModalOpen(false);
      setSelectedOccurrence(null);
    } catch (error) {
      console.error("Kunne ikke slette kalenderhendelsen:", error);

      setDeleteErrorMessage("Kunne ikke slette kalenderhendelsen.");
    } finally {
      setIsDeletingEvent(false);
    }
  };

  const renderEventForm = () => (
    <div className="calendar-form">
      <label className="calendar-form-field">
        <span>Fag</span>

        <select
          value={eventSubjectId}
          disabled={isSavingEvent}
          onChange={(event) => setEventSubjectId(event.target.value)}
        >
          <option value="">Generell hendelse</option>

          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.code} – {subject.name}
            </option>
          ))}
        </select>
      </label>

      <label className="calendar-form-field">
        <span>Tittel</span>

        <input
          type="text"
          value={eventTitle}
          maxLength={120}
          autoFocus
          disabled={isSavingEvent}
          placeholder="For eksempel Forelesning 3"
          onChange={(event) => setEventTitle(event.target.value)}
        />
      </label>

      <label className="calendar-form-field">
        <span>Type</span>

        <select
          value={eventType}
          disabled={isSavingEvent}
          onChange={(event) =>
            setEventType(event.target.value as CalendarEventType)
          }
        >
          {eventTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="calendar-form-field">
        <span>Dato</span>

        <input
          type="date"
          value={eventDate}
          disabled={isSavingEvent}
          onChange={(event) => setEventDate(event.target.value)}
        />
      </label>

      <label className="calendar-form-field">
        <span>Gjentas</span>

        <select
          value={eventRecurrenceType}
          disabled={isSavingEvent}
          onChange={(event) => {
            const value = event.target.value as CalendarRecurrenceType;

            setEventRecurrenceType(value);

            if (value === "none") {
              setEventRecurrenceUntil("");
            }
          }}
        >
          {recurrenceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {eventRecurrenceType === "weekly" && (
        <label className="calendar-form-field">
          <span>Gjentas til</span>

          <input
            type="date"
            value={eventRecurrenceUntil}
            min={eventDate || undefined}
            disabled={isSavingEvent}
            onChange={(event) => setEventRecurrenceUntil(event.target.value)}
          />
        </label>
      )}

      <label className="calendar-all-day-field">
        <input
          type="checkbox"
          checked={eventAllDay}
          disabled={isSavingEvent}
          onChange={(event) => {
            const checked = event.target.checked;

            setEventAllDay(checked);

            if (checked) {
              setEventStartTime("");
              setEventEndTime("");
            }
          }}
        />

        <span>Heldag</span>
      </label>

      {!eventAllDay && (
        <div className="calendar-time-grid">
          <label className="calendar-form-field">
            <span>Starttid</span>

            <input
              type="time"
              value={eventStartTime}
              disabled={isSavingEvent}
              onChange={(event) => setEventStartTime(event.target.value)}
            />
          </label>

          <label className="calendar-form-field">
            <span>Sluttid</span>

            <input
              type="time"
              value={eventEndTime}
              disabled={isSavingEvent}
              onChange={(event) => setEventEndTime(event.target.value)}
            />
          </label>
        </div>
      )}

      <label className="calendar-form-field">
        <span>Sted</span>

        <input
          type="text"
          value={eventLocation}
          maxLength={120}
          disabled={isSavingEvent}
          placeholder="For eksempel R1"
          onChange={(event) => setEventLocation(event.target.value)}
        />
      </label>

      <label className="calendar-form-field">
        <span>Beskrivelse</span>

        <textarea
          value={eventDescription}
          rows={4}
          disabled={isSavingEvent}
          placeholder="Valgfri beskrivelse..."
          onChange={(event) => setEventDescription(event.target.value)}
        />
      </label>

      {eventFormError && (
        <p className="calendar-form-error">{eventFormError}</p>
      )}
    </div>
  );

  return (
    <main className="calendar-page">
      <section className="calendar-header">
        <div>
          <p className="calendar-label">Mine studier</p>

          <h1>Kalender</h1>

          <p>
            Kalenderen viser hendelser for fagene du har valgt dette semesteret.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="calendar-new-event-button"
            onClick={openNewEventModal}
          >
            <Plus size={18} />
            Ny hendelse
          </button>
        )}
      </section>

      {isLoadingSemesterSubjects || isLoadingEvents ? (
        <p>Laster kalender...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <section className="calendar-card">
          <div className="calendar-toolbar">
            <div className="calendar-month-navigation">
              <button
                type="button"
                className="calendar-navigation-button"
                aria-label={
                  calendarView === "week" ? "Forrige uke" : "Forrige måned"
                }
                onClick={() => {
                  if (calendarView === "day") {
                    setCurrentDay(addDays(currentDay, -1));
                  } else if (calendarView === "week") {
                    setCurrentWeek(addDays(currentWeek, -7));
                  } else {
                    setCurrentMonth(addMonths(currentMonth, -1));
                  }
                }}
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                className="calendar-today-button"
                onClick={() => {
                  if (calendarView === "day") {
                    setCurrentDay(new Date());
                  } else if (calendarView === "week") {
                    setCurrentWeek(startOfWeek(new Date()));
                  } else {
                    setCurrentMonth(startOfMonth(new Date()));
                  }
                }}
              >
                I dag
              </button>

              <button
                type="button"
                className="calendar-navigation-button"
                aria-label={
                  calendarView === "week" ? "Neste uke" : "Neste måned"
                }
                onClick={() => {
                  if (calendarView === "day") {
                    setCurrentDay(addDays(currentDay, 1));
                  } else if (calendarView === "week") {
                    setCurrentWeek(addDays(currentWeek, 7));
                  } else {
                    setCurrentMonth(addMonths(currentMonth, 1));
                  }
                }}
              >
                <ChevronRight size={19} />
              </button>
            </div>

            <h2>
              {calendarView === "day"
                ? currentDay.toLocaleDateString("nb-NO", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : calendarView === "week"
                  ? `${currentWeek.toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "long",
                    })} – ${endOfWeek(currentWeek).toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`
                  : currentMonth.toLocaleDateString("nb-NO", {
                      month: "long",
                      year: "numeric",
                    })}
            </h2>
            <div className="calendar-view-switcher">
              <button
                type="button"
                className={
                  calendarView === "month"
                    ? "calendar-view-button calendar-view-button-active"
                    : "calendar-view-button"
                }
                onClick={() => setCalendarView("month")}
              >
                Måned
              </button>

              <button
                type="button"
                className={
                  calendarView === "week"
                    ? "calendar-view-button calendar-view-button-active"
                    : "calendar-view-button"
                }
                onClick={() => setCalendarView("week")}
              >
                Uke
              </button>

              <button
                type="button"
                className={
                  calendarView === "day"
                    ? "calendar-view-button calendar-view-button-active"
                    : "calendar-view-button"
                }
                onClick={() => setCalendarView("day")}
              >
                Dag
              </button>
            </div>
          </div>

          {calendarView === "month" && (
            <>
              <div className="calendar-weekdays">
                {weekDays.map((weekDay) => (
                  <div key={weekDay}>{weekDay}</div>
                ))}
              </div>

              <div className="calendar-month-grid">
                {calendarDays.map((day) => {
                  const dateKey = getDateKey(day);

                  const dayOccurrences = occurrencesByDate[dateKey] ?? [];

                  const isCurrentMonth =
                    day.getMonth() === currentMonth.getMonth() &&
                    day.getFullYear() === currentMonth.getFullYear();

                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={dateKey}
                      className={`calendar-day ${
                        isCurrentMonth ? "" : "calendar-day-outside"
                      }`}
                    >
                      <div className="calendar-day-header">
                        <span
                          className={
                            isToday
                              ? "calendar-day-number calendar-day-number-today"
                              : "calendar-day-number"
                          }
                        >
                          {day.getDate()}
                        </span>
                      </div>

                      <div className="calendar-day-events">
                        {dayOccurrences.map((occurrence) => (
                          <button
                            key={occurrence.id}
                            type="button"
                            className={`calendar-event calendar-event-${occurrence.eventType}`}
                            title={`${getSubjectCode(
                              occurrence.subjectId,
                            )} – ${occurrence.title}`}
                            onClick={() => setSelectedOccurrence(occurrence)}
                          >
                            {!occurrence.allDay && (
                              <span className="calendar-event-time">
                                {formatTime(occurrence.start)}
                              </span>
                            )}

                            <span className="calendar-event-subject">
                              {getSubjectCode(occurrence.subjectId)}
                            </span>

                            <strong>{occurrence.title}</strong>

                            <span className="calendar-event-type">
                              {getEventTypeLabel(occurrence.eventType)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}

      {calendarView === "week" && (
        <section className="calendar-card">
          <div className="calendar-week-schedule">
            <div className="calendar-week-time-column">
              <div className="calendar-week-time-spacer" />

              {weekHours.map((hour) => (
                <div key={hour} className="calendar-week-time-label">
                  {String(hour).padStart(2, "0")}
                  :00
                </div>
              ))}
            </div>

            <div className="calendar-week-schedule-content">
              <div className="calendar-week-view">
                {Array.from({ length: 7 }, (_, index) =>
                  addDays(currentWeek, index),
                ).map((day) => (
                  <div key={getDateKey(day)} className="calendar-week-day">
                    <span>
                      {day.toLocaleDateString("nb-NO", {
                        weekday: "short",
                      })}
                    </span>

                    <strong
                      className={
                        isSameDay(day, new Date())
                          ? "calendar-week-day-number calendar-week-day-number-today"
                          : "calendar-week-day-number"
                      }
                    >
                      {day.getDate()}
                    </strong>

                    <div className="calendar-week-day-schedule">
                      {(weekOccurrencesByDate[getDateKey(day)] ?? []).map(
                        (occurrence) => {
                          const eventTop = getScheduleTop(occurrence.start);

                          const eventHeight = occurrence.end
                            ? Math.max(
                                getScheduleTop(occurrence.end) - eventTop,
                                36,
                              )
                            : 44;

                          return (
                            <button
                              key={occurrence.id}
                              type="button"
                              className={`calendar-week-event calendar-event-${occurrence.eventType}`}
                              style={{
                                top: `${eventTop}px`,
                                height: `${eventHeight}px`,
                              }}
                              onClick={() => setSelectedOccurrence(occurrence)}
                            >
                              {!occurrence.allDay && (
                                <span className="calendar-event-time">
                                  {occurrence.end
                                    ? `${formatTime(occurrence.start)}–${formatTime(occurrence.end)}`
                                    : formatTime(occurrence.start)}
                                </span>
                              )}

                              <span className="calendar-event-subject">
                                {getSubjectCode(occurrence.subjectId)}
                              </span>

                              <strong>{occurrence.title}</strong>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {calendarView === "day" && (
        <section className="calendar-card">
          <div className="calendar-day-schedule">
            <div className="calendar-week-time-column">
              <div className="calendar-week-time-spacer" />

              {weekHours.map((hour) => (
                <div key={hour} className="calendar-week-time-label">
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            <div className="calendar-day-schedule-content">
              <div className="calendar-day-schedule-header">
                <span>
                  {currentDay.toLocaleDateString("nb-NO", {
                    weekday: "long",
                  })}
                </span>

                <strong
                  className={
                    isSameDay(currentDay, new Date())
                      ? "calendar-week-day-number calendar-week-day-number-today"
                      : "calendar-week-day-number"
                  }
                >
                  {currentDay.getDate()}
                </strong>
              </div>

              <div className="calendar-day-timeline">
                {dayOccurrences.map((occurrence) => {
                  const eventTop = getScheduleTop(occurrence.start);

                  const eventHeight = occurrence.end
                    ? Math.max(getScheduleTop(occurrence.end) - eventTop, 36)
                    : 44;

                  return (
                    <button
                      key={occurrence.id}
                      type="button"
                      className={`calendar-day-event calendar-event-${occurrence.eventType}`}
                      style={{
                        top: `${eventTop}px`,
                        height: `${eventHeight}px`,
                      }}
                      onClick={() => setSelectedOccurrence(occurrence)}
                    >
                      <span className="calendar-event-time">
                        {occurrence.end
                          ? `${formatTime(occurrence.start)}–${formatTime(
                              occurrence.end,
                            )}`
                          : formatTime(occurrence.start)}
                      </span>

                      <span className="calendar-event-subject">
                        {getSubjectCode(occurrence.subjectId)}
                      </span>

                      <strong>{occurrence.title}</strong>

                      {occurrence.location && (
                        <span className="calendar-day-event-location">
                          {occurrence.location}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedOccurrence && !isDeleteModalOpen && !isEditEventModalOpen && (
        <div className="calendar-modal-overlay" onClick={closeEventDetails}>
          <div
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-event-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="calendar-modal-header">
              <div>
                <p className="calendar-label">
                  {getEventTypeLabel(selectedOccurrence.eventType)}
                </p>

                <h2 id="calendar-event-details-title">
                  {selectedOccurrence.title}
                </h2>
              </div>

              <button
                type="button"
                className="calendar-modal-close-button"
                aria-label="Lukk"
                onClick={closeEventDetails}
              >
                <X size={20} />
              </button>
            </div>

            <div className="calendar-event-details">
              <div className="calendar-event-detail-subject">
                <strong>{getSubjectCode(selectedOccurrence.subjectId)}</strong>

                {getSubjectName(selectedOccurrence.subjectId) && (
                  <span>{getSubjectName(selectedOccurrence.subjectId)}</span>
                )}
              </div>

              <div className="calendar-event-detail-row">
                <CalendarDays size={19} />

                <div>
                  <span>Dato</span>

                  <strong>
                    {formatOccurrenceDate(selectedOccurrence.start)}
                  </strong>
                </div>
              </div>

              <div className="calendar-event-detail-row">
                <Clock size={19} />

                <div>
                  <span>Tid</span>

                  <strong>
                    {selectedOccurrence.allDay
                      ? "Heldag"
                      : selectedOccurrence.end
                        ? `${formatTime(selectedOccurrence.start)}–${formatTime(
                            selectedOccurrence.end,
                          )}`
                        : formatTime(selectedOccurrence.start)}
                  </strong>
                </div>
              </div>

              {selectedOccurrence.location && (
                <div className="calendar-event-detail-row">
                  <MapPin size={19} />

                  <div>
                    <span>Sted</span>

                    <strong>{selectedOccurrence.location}</strong>
                  </div>
                </div>
              )}

              {selectedSourceEvent?.recurrenceType === "weekly" && (
                <div className="calendar-event-detail-row">
                  <Repeat2 size={19} />

                  <div>
                    <span>Gjentakelse</span>

                    <strong>
                      Hver uke
                      {selectedSourceEvent.recurrenceUntil
                        ? ` til ${formatRecurrenceUntil(
                            selectedSourceEvent.recurrenceUntil,
                          )}`
                        : ""}
                    </strong>
                  </div>
                </div>
              )}

              {selectedSourceEvent?.description && (
                <div className="calendar-event-detail-description">
                  <span>Beskrivelse</span>

                  <p>{selectedSourceEvent.description}</p>
                </div>
              )}
            </div>

            <div className="calendar-modal-actions">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    className="calendar-modal-edit-button"
                    onClick={openEditEventModal}
                  >
                    <Pencil size={17} />
                    Rediger
                  </button>

                  <button
                    type="button"
                    className="calendar-modal-delete-button"
                    onClick={openDeleteModal}
                  >
                    <Trash2 size={17} />
                    Slett
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedOccurrence && isDeleteModalOpen && (
        <div className="calendar-modal-overlay" onClick={closeDeleteModal}>
          <div
            className="calendar-modal calendar-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="calendar-modal-header">
              <div>
                <p className="calendar-label">Bekreft sletting</p>

                <h2 id="calendar-delete-title">Slett hendelse</h2>
              </div>

              <button
                type="button"
                className="calendar-modal-close-button"
                aria-label="Lukk"
                disabled={isDeletingEvent}
                onClick={closeDeleteModal}
              >
                <X size={20} />
              </button>
            </div>

            <p className="calendar-delete-message">
              Er du sikker på at du vil slette{" "}
              <strong>«{selectedOccurrence.title}»</strong>?
            </p>

            {selectedSourceEvent?.recurrenceType === "weekly" && (
              <p className="calendar-delete-warning">
                Dette er en gjentakende hendelse. Hele serien blir slettet.
              </p>
            )}

            {deleteErrorMessage && (
              <p className="calendar-form-error">{deleteErrorMessage}</p>
            )}

            <div className="calendar-modal-actions">
              <button
                type="button"
                className="calendar-modal-cancel-button"
                disabled={isDeletingEvent}
                onClick={closeDeleteModal}
              >
                Avbryt
              </button>

              <button
                type="button"
                className="calendar-modal-delete-button"
                disabled={isDeletingEvent}
                onClick={() => {
                  void handleDeleteEvent();
                }}
              >
                <Trash2 size={17} />

                {isDeletingEvent
                  ? "Sletter..."
                  : selectedSourceEvent?.recurrenceType === "weekly"
                    ? "Slett hele serien"
                    : "Slett hendelse"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isNewEventModalOpen && (
        <div className="calendar-modal-overlay" onClick={closeNewEventModal}>
          <form
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-new-event-title"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();

              void handleCreateEvent();
            }}
          >
            <div className="calendar-modal-header">
              <div>
                <p className="calendar-label">Admin</p>

                <h2 id="calendar-new-event-title">Ny kalenderhendelse</h2>
              </div>

              <button
                type="button"
                className="calendar-modal-close-button"
                aria-label="Lukk"
                disabled={isSavingEvent}
                onClick={closeNewEventModal}
              >
                <X size={20} />
              </button>
            </div>

            {renderEventForm()}

            <div className="calendar-modal-actions">
              <button
                type="button"
                className="calendar-modal-cancel-button"
                disabled={isSavingEvent}
                onClick={closeNewEventModal}
              >
                Avbryt
              </button>

              <button
                type="submit"
                className="calendar-modal-submit-button"
                disabled={isSavingEvent}
              >
                {isSavingEvent ? "Lagrer..." : "Lagre hendelse"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedOccurrence && isEditEventModalOpen && (
        <div className="calendar-modal-overlay" onClick={closeEditEventModal}>
          <form
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-edit-event-title"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();

              void handleUpdateEvent();
            }}
          >
            <div className="calendar-modal-header">
              <div>
                <p className="calendar-label">Admin</p>

                <h2 id="calendar-edit-event-title">Rediger hendelse</h2>
              </div>

              <button
                type="button"
                className="calendar-modal-close-button"
                aria-label="Lukk"
                disabled={isSavingEvent}
                onClick={closeEditEventModal}
              >
                <X size={20} />
              </button>
            </div>

            {selectedSourceEvent?.recurrenceType === "weekly" && (
              <p className="calendar-edit-series-info">
                Endringene gjelder hele den gjentakende serien.
              </p>
            )}

            {renderEventForm()}

            <div className="calendar-modal-actions">
              <button
                type="button"
                className="calendar-modal-cancel-button"
                disabled={isSavingEvent}
                onClick={closeEditEventModal}
              >
                Avbryt
              </button>

              <button
                type="submit"
                className="calendar-modal-submit-button"
                disabled={isSavingEvent}
              >
                {isSavingEvent ? "Lagrer..." : "Lagre endringer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
