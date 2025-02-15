import { jest } from '@jest/globals';
import type { Calendar, Event } from '../types/calendar';
import type { CalendarPlugin } from '../types/plugin';

type MockCalendarPlugin = jest.Mocked<CalendarPlugin>;

export const createMockCalendarPlugin = (
  calendars: Calendar[] = [],
  events: Event[] = []
): MockCalendarPlugin => ({
  metadata: { type: 'calendar' },
  id: 'test-calendar',
  getCalendars: jest.fn<() => Promise<Calendar[]>>().mockResolvedValue(calendars),
  getEvents: jest.fn<() => Promise<Event[]>>().mockResolvedValue(events),
  saveEvent: jest.fn<(event: Event) => Promise<Event>>().mockImplementation(
    async (event) => event
  ),
  deleteEvent: jest.fn<(eventId: string) => Promise<void>>().mockResolvedValue(undefined),
});

interface UsePluginsHook {
  (): { plugins: CalendarPlugin[] };
}

export const mockUsePlugins = (plugin: CalendarPlugin): jest.MockedFunction<UsePluginsHook> =>
  jest.fn().mockReturnValue({
    plugins: [plugin],
  });