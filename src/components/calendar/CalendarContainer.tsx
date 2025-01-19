import React, { useEffect, useState, useCallback } from 'react';
import CalendarView from './CalendarView';
import { Calendar, Event } from '../../contexts/CalendarContext';
import { usePlugins } from '../../hooks/usePlugins';

const CalendarContainer = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { plugins } = usePlugins();

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
    const fetchData = async () => {
      const pluginCalendars: Calendar[] = [];
      const pluginEvents: Event[] = [];

      for (const plugin of plugins) {
        if (plugin.getCalendars) {
          const calendars = await plugin.getCalendars();
          pluginCalendars.push(...calendars);
        }
        if (plugin.getEvents) {
          const events = await plugin.getEvents();
          pluginEvents.push(...events);
        }
      }

      setCalendars(pluginCalendars);
      setEvents(pluginEvents);
    };

    fetchData();
  }, [plugins]);

  const handleSaveEvent = async (event: Event) => {
    // Delegate event saving to the appropriate plugin
    const plugin = plugins.find((p) => p.id === event.calendarId);
    if (plugin?.saveEvent) {
      await plugin.saveEvent(event);
      // Refresh events after saving
      const updatedEvents = await plugin.getEvents();
      setEvents(updatedEvents);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
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
  };

  return (
    <CalendarView
      calendars={calendars}
      events={events}
      onSaveEvent={handleSaveEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  );
};

export default CalendarContainer;
