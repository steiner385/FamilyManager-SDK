import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarView from '../CalendarView';
import { Calendar, Event } from '../../../contexts/CalendarContext';

const mockCalendars: Calendar[] = [
  { id: '1', name: 'Work', color: '#3b82f6' },
  { id: '2', name: 'Personal', color: '#10b981' },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Meeting',
    start: new Date(2023, 9, 10, 10, 0),
    end: new Date(2023, 9, 10, 11, 0),
    calendarId: '1',
    color: '#3b82f6',
  },
];

test('renders CalendarView with events', () => {
  render(
    <CalendarView
      calendars={mockCalendars}
      events={mockEvents}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
    />
  );

  expect(screen.getByText('Meeting')).toBeInTheDocument();
});

test('opens modal when event is clicked', () => {
  render(
    <CalendarView
      calendars={mockCalendars}
      events={mockEvents}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
    />
  );

  fireEvent.click(screen.getByText('Meeting'));
  expect(screen.getByText('Edit Event')).toBeInTheDocument();
});
