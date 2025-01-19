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
      loading={false}
      error={null}
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
    />
  );

  expect(screen.getByText('Meeting')).toBeInTheDocument();
});

test('handles recurring events correctly', () => {
  const recurringEvent: Event = {
    id: '3',
    title: 'Weekly Meeting',
    start: new Date(2023, 9, 10, 10, 0),
    end: new Date(2023, 9, 10, 11, 0),
    calendarId: '1',
    recurring: {
      frequency: 'weekly',
      interval: 1,
      endDate: new Date(2023, 10, 10)
    }
  };

  render(
    <CalendarView
      calendars={mockCalendars}
      events={[...mockEvents, recurringEvent]}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
      loading={false}
      error={null}
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
    />
  );

  // Should show multiple instances of the recurring event
  const recurringEventElements = screen.getAllByText('Weekly Meeting');
  expect(recurringEventElements.length).toBeGreaterThan(1);
});

test('handles all-day events correctly', () => {
  const allDayEvent: Event = {
    id: '4',
    title: 'Conference',
    start: new Date(2023, 9, 10),
    end: new Date(2023, 9, 12),
    calendarId: '1',
    allDay: true
  };

  render(
    <CalendarView
      calendars={mockCalendars}
      events={[...mockEvents, allDayEvent]}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
    />
  );

  const allDayEventElement = screen.getByText('Conference');
  expect(allDayEventElement.closest('.rbc-event-allday')).toBeInTheDocument();
});

test('switches between different calendar views', () => {
  render(
    <CalendarView
      calendars={mockCalendars}
      events={mockEvents}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
    />
  );

  // Test month view
  fireEvent.click(screen.getByText('Month'));
  expect(document.querySelector('.rbc-month-view')).toBeInTheDocument();

  // Test week view
  fireEvent.click(screen.getByText('Week'));
  expect(document.querySelector('.rbc-time-view')).toBeInTheDocument();

  // Test day view
  fireEvent.click(screen.getByText('Day'));
  expect(document.querySelector('.rbc-time-view')).toBeInTheDocument();
  expect(document.querySelector('.rbc-day-slot')).toBeInTheDocument();
});

test('handles timezone conversions correctly', () => {
  const eventInDifferentTZ: Event = {
    id: '5',
    title: 'International Call',
    start: new Date('2023-10-10T15:00:00Z'), // UTC time
    end: new Date('2023-10-10T16:00:00Z'),
    calendarId: '1'
  };

  render(
    <CalendarView
      calendars={mockCalendars}
      events={[eventInDifferentTZ]}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
    />
  );

  // Event should be displayed in local timezone
  const eventElement = screen.getByText('International Call');
  expect(eventElement).toBeInTheDocument();
});

test('displays loading state', () => {
  render(
    <CalendarView
      calendars={mockCalendars}
      events={mockEvents}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
      loading={true}
      error={null}
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
    />
  );

  expect(screen.getByText('Loading calendar...')).toBeInTheDocument();
});

test('displays error state', () => {
  render(
    <CalendarView
      calendars={mockCalendars}
      events={mockEvents}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
      loading={false}
      error="Failed to load calendar"
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
    />
  );

  expect(screen.getByText('Failed to load calendar')).toBeInTheDocument();
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

test('filters events by calendar selection', () => {
  const workEvent = mockEvents[0];
  const personalEvent = {
    ...mockEvents[0],
    id: '2',
    title: 'Personal Task',
    calendarId: '2'
  };
  
  render(
    <CalendarView
      calendars={mockCalendars}
      events={[workEvent, personalEvent]}
      onSaveEvent={jest.fn()}
      onDeleteEvent={jest.fn()}
    />
  );

  const workCalendarCheckbox = screen.getByLabelText('Work');
  fireEvent.click(workCalendarCheckbox);
  
  expect(screen.queryByText('Meeting')).not.toBeInTheDocument();
  expect(screen.getByText('Personal Task')).toBeInTheDocument();
});

test('creates new event on time slot click', () => {
  const onSaveEvent = jest.fn();
  render(
    <CalendarView
      calendars={mockCalendars}
      events={mockEvents}
      onSaveEvent={onSaveEvent}
      onDeleteEvent={jest.fn()}
    />
  );

  // Simulate clicking on an empty time slot
  const timeSlot = document.querySelector('.rbc-time-slot');
  fireEvent.click(timeSlot!);

  // Verify modal opens
  expect(screen.getByText('New Event')).toBeInTheDocument();
  
  // Fill in event details
  fireEvent.change(screen.getByPlaceholderText('Event Title'), {
    target: { value: 'New Meeting' }
  });
  
  // Save the event
  fireEvent.click(screen.getByText('Save'));
  
  expect(onSaveEvent).toHaveBeenCalledWith(expect.objectContaining({
    title: 'New Meeting',
    start: expect.any(Date),
    end: expect.any(Date)
  }));
});

test('handles drag and drop event resizing', () => {
  const onSaveEvent = jest.fn();
  render(
    <CalendarView
      calendars={mockCalendars}
      events={mockEvents}
      onSaveEvent={onSaveEvent}
      onDeleteEvent={jest.fn()}
    />
  );

  const eventElement = screen.getByText('Meeting').closest('.rbc-event');
  expect(eventElement).toBeInTheDocument();

  // Simulate resize drag
  fireEvent.mouseDown(eventElement!, { clientY: 0 });
  fireEvent.mouseMove(document, { clientY: 100 });
  fireEvent.mouseUp(document);

  expect(onSaveEvent).toHaveBeenCalledWith(expect.objectContaining({
    ...mockEvents[0],
    end: expect.any(Date)
  }));
});
