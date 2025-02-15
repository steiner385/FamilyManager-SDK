export interface Calendar {
  id: string;
  name: string;
  color: string;
  description?: string;
  isReadOnly?: boolean;
  owner?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  calendarId: string;
  color?: string;
  isAllDay?: boolean;
  location?: string;
  attendees?: string[];
  recurring?: {
    frequency: 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
    interval?: number;
    byDay?: number[];
    byMonth?: number[];
    byMonthDay?: number[];
    until?: Date;
    count?: number;
  };
  metadata?: Record<string, unknown>;
}

export const WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
} as const;