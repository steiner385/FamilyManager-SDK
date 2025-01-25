import React, { useEffect, useState } from 'react';
import { RRule } from 'rrule';
import { Calendar, Event, WEEKDAYS } from '../../contexts/CalendarContext';
import { usePlugins } from '../../hooks/usePlugins';
import { CalendarPlugin, Plugin } from '../../core/plugin/types';

interface CalendarContainerProps {
  children: React.ReactNode;
}

interface CalendarChildProps {
  calendars: Calendar[];
  events: Event[];
  onSaveEvent: (event: Event) => Promise<void>;
  onDeleteEvent: (eventId: string, calendarId: string) => Promise<void>;
}

export function CalendarContainer({ children }: CalendarContainerProps) {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const { plugins } = usePlugins();

  const getRRuleFrequency = (freq: string): number => {
    switch (freq.toUpperCase()) {
      case 'YEARLY': return RRule.YEARLY;
      case 'MONTHLY': return RRule.MONTHLY;
      case 'WEEKLY': return RRule.WEEKLY;
      case 'DAILY': return RRule.DAILY;
      default: throw new Error(`Invalid frequency: ${freq}`);
    }
  };

  const convertEventToRRule = (event: Event): RRule => {
    if (!event.recurring) {
      throw new Error('Event has no recurrence rule');
    }

    return new RRule({
      freq: getRRuleFrequency(event.recurring.frequency),
      interval: event.recurring.interval || 1,
      byweekday: event.recurring.byDay?.map(day => 
        Object.values(WEEKDAYS)[day]
      ),
      bymonth: event.recurring.byMonth,
      bymonthday: event.recurring.byMonthDay,
      until: event.recurring.until,
      count: event.recurring.count
    });
  };

  const isCalendarPlugin = (plugin: Plugin): plugin is CalendarPlugin => {
    return (
      'metadata' in plugin &&
      plugin.metadata.type === 'calendar' &&
      'getCalendars' in plugin &&
      'getEvents' in plugin &&
      'saveEvent' in plugin &&
      'deleteEvent' in plugin
    );
  };

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        // Load calendars and events from plugins
        for (const plugin of plugins) {
          if (isCalendarPlugin(plugin)) {
            const pluginCalendars = await plugin.getCalendars();
            setCalendars(prev => [...prev, ...pluginCalendars]);

            const pluginEvents = await plugin.getEvents();
            setEvents(prev => [...prev, ...pluginEvents]);
          }
        }
      } catch (error) {
        console.error('Failed to load calendar data:', error);
      }
    };

    loadCalendarData();
  }, [plugins]);

  const handleSaveEvent = async (event: Event) => {
    try {
      const calendarPlugin = plugins.find(p => 
        isCalendarPlugin(p) && p.id === event.calendarId
      ) as CalendarPlugin | undefined;
      
      if (calendarPlugin) {
        await calendarPlugin.saveEvent(event);
        // Refresh events after save
        const updatedEvents = await calendarPlugin.getEvents();
        setEvents(prev => prev.map(e => 
          e.calendarId === event.calendarId 
            ? updatedEvents.find((ue: Event) => ue.id === e.id) || e 
            : e
        ));
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string, calendarId: string) => {
    try {
      const calendarPlugin = plugins.find(p => 
        isCalendarPlugin(p) && p.id === calendarId
      ) as CalendarPlugin | undefined;
      
      if (calendarPlugin) {
        await calendarPlugin.deleteEvent(eventId);
        // Refresh events after delete
        const updatedEvents = await calendarPlugin.getEvents();
        setEvents(prev => prev.filter(e => 
          e.calendarId !== calendarId || 
          (e.calendarId === calendarId && updatedEvents.some((ue: Event) => ue.id === e.id))
        ));
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<Partial<CalendarChildProps>>(child)) {
      return React.cloneElement(child, {
        calendars,
        events,
        onSaveEvent: handleSaveEvent,
        onDeleteEvent: handleDeleteEvent
      });
    }
    return child;
  });

  return (
    <div className="calendar-container">
      {childrenWithProps}
    </div>
  );
}
