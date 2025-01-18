import React, { createContext, useState } from 'react';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  recurring?: RecurrenceRule;
  calendarId: string;
  color?: string;
  description?: string;
  location?: string;
  attendees?: string[];
}

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  byDay?: string[];
  byMonthDay?: number[];
  until?: Date;
}

interface Calendar {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

interface CalendarContextType {
  events: Event[];
  calendars: Calendar[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  toggleCalendarVisibility: (calendarId: string) => void;
}

const CalendarContext = createContext<CalendarContextType>({
  events: [],
  calendars: [],
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  toggleCalendarVisibility: () => {},
});

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([
    { id: 'personal', name: 'Personal', color: '#3b82f6', visible: true },
    { id: 'work', name: 'Work', color: '#ef4444', visible: true },
  ]);

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const updateEvent = (event: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === event.id ? event : e))
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
  };

  const toggleCalendarVisibility = (calendarId: string) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar) =>
        calendar.id === calendarId
          ? { ...calendar, visible: !calendar.visible }
          : calendar
      )
    );
  };

  return (
    <CalendarContext.Provider
      value={{ events, calendars, addEvent, updateEvent, deleteEvent, toggleCalendarVisibility }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;
