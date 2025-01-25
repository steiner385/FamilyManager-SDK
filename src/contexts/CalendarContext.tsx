import React, { createContext, useState, useContext } from 'react';
import { RRule } from 'rrule';

export interface Event {
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
  'data-testid'?: string;  // Added for testing purposes
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  byDay?: number[];  // 0-6 for Sunday-Saturday
  byMonth?: number[];  // 1-12 for January-December
  byMonthDay?: number[];  // 1-31
  until?: Date;
  count?: number;  // Number of occurrences
}

// Constants for day mapping
export const WEEKDAYS = {
  SU: RRule.SU,
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA
} as const;

export interface Calendar {
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

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
};

export default CalendarContext;
