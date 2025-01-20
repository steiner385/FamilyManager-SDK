import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { RRule } from 'rrule';
import CalendarView from './CalendarView';
import { Calendar, Event } from '../../contexts/CalendarContext';
import { usePlugins } from '../../hooks/usePlugins';

const CalendarContainer = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { plugins } = usePlugins();

  const generateRecurringInstances = (event: Event): Event[] => {
    if (!event.recurring) return [event];
    
    const rule = new RRule({
      freq: RRule[event.recurring.frequency.toUpperCase()],
      interval: event.recurring.interval,
      dtstart: event.start,
      until: event.recurring.until,
      count: event.recurring.count,
      byweekday: event.recurring.byDay,
      bymonth: event.recurring.byMonth,
      bymonthday: event.recurring.byMonthDay
    });

    const dates = rule.all();
    return dates.map((date, index) => ({
      ...event,
      id: `${event.id}-${index}`,
      start: date,
      end: new Date(date.getTime() + (event.end.getTime() - event.start.getTime()))
    }));
  };

  const expandedEvents = useMemo(() => {
    return events.flatMap(event => generateRecurringInstances(event))
      .map(event => ({
        ...event,
        title: `${event.title}`, // Ensure title is rendered as text
        start: new Date(event.start),
        end: new Date(event.end),
        'data-testid': `event-${event.title}`
      }));
  }, [events]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pluginCalendars: Calendar[] = [];
      const pluginEvents: Event[] = [];

      for (const plugin of plugins) {
        try {
          if (plugin.getCalendars) {
            const calendars = await plugin.getCalendars();
            pluginCalendars.push(...calendars);
          }
          if (plugin.getEvents) {
            const events = await plugin.getEvents();
            pluginEvents.push(...events);
          }
        } catch (err) {
          console.error(`Error loading data from plugin ${plugin.id}:`, err);
          setError(`Failed to load data from ${plugin.name}`);
        }
      }

      setCalendars(pluginCalendars);
      setEvents(pluginEvents);
    } catch (err) {
      console.error('Error loading calendar data:', err);
      setError('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [plugins]);

  // Fetch calendars and events from plugins
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveEvent = async (event: Event) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delegate event saving to the appropriate plugin
      const plugin = plugins.find((p) => p.id === event.calendarId);
      if (plugin?.saveEvent) {
        await plugin.saveEvent(event);
        // Refresh events after saving
        const updatedEvents = await plugin.getEvents();
        setEvents(updatedEvents);
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delegate event deletion to the appropriate plugin
      const event = events.find((e) => e.id === eventId);
      if (event) {
        const plugin = plugins.find((p) => p.id === event.calendarId);
        if (plugin?.deleteEvent) {
          await plugin.deleteEvent(eventId);
          // Refresh events after deletion
          const updatedEvents = await plugin.getEvents();
          setEvents(updatedEvents);
        }
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const [draggingEvent, setDraggingEvent] = useState<Event | null>(null);

  const handleDragStart = useCallback((event: Event) => {
    setDraggingEvent(event);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingEvent(null);
  }, []);

  const handleDrop = useCallback((date: Date) => {
    if (draggingEvent) {
      const duration = draggingEvent.end.getTime() - draggingEvent.start.getTime();
      const updatedEvent = {
        ...draggingEvent,
        start: date,
        end: new Date(date.getTime() + duration)
      };
      handleSaveEvent(updatedEvent);
      setDraggingEvent(null);
    }
  }, [draggingEvent, handleSaveEvent]);

  return (
    <div data-testid="calendar-container">
      <CalendarView
        calendars={calendars}
        events={expandedEvents}
        loading={loading}
        error={error}
        onSaveEvent={handleSaveEvent}
        onDeleteEvent={handleDeleteEvent}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        draggingEvent={draggingEvent}
      />
    </div>
  );
};

export default CalendarContainer;
