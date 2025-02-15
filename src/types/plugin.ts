import { Calendar, Event } from './calendar';

export interface BasePlugin {
  id: string;
  metadata: {
    type: string;
    [key: string]: unknown;
  };
}

export interface CalendarPlugin extends BasePlugin {
  metadata: {
    type: 'calendar';
    [key: string]: unknown;
  };
  getCalendars(): Promise<Calendar[]>;
  getEvents(): Promise<Event[]>;
  saveEvent(event: Event): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;
}

export interface PluginHooks {
  plugins: Array<BasePlugin | CalendarPlugin>;
}
