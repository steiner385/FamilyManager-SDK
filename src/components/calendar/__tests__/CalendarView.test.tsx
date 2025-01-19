import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarView from '../CalendarView';
import { Calendar, Event } from '../../../contexts/CalendarContext';

const mockCalendars: Calendar[] = [
  { id: '1', name: 'Work', color: '#3b82f6' },
  { id: '2', name: 'Personal', color: '#10b981' },
];

const testDate = new Date('2025-01-19T10:00:00.000Z'); // Use current date from your system

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Meeting',
    start: testDate,
    end: new Date(testDate.getTime() + 60 * 60 * 1000), // 1 hour later
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
  const testDate = new Date('2025-01-19T10:00:00.000Z');
  const recurringEvent: Event = {
    id: '3',
    title: 'Weekly Meeting',
    start: new Date('2025-01-19T10:00:00.000Z'),
    end: new Date('2025-01-19T11:00:00.000Z'),
    calendarId: '1',
    recurring: {
      frequency: 'weekly',
      interval: 1,
      byDay: [0, 1, 2, 3, 4], // Add multiple days of the week
      until: new Date('2025-02-19T10:00:00.000Z') // Set end date further in future
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
    start: testDate,
    end: new Date(testDate.getTime() + 2 * 24 * 60 * 60 * 1000),
    calendarId: '1',
    allDay: true
  };

  render(
    <CalendarView
      calendars={mockCalendars}
      events={[...mockEvents, allDayEvent]}
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

  const allDayEventElements = screen.getAllByText('Conference');
  expect(allDayEventElements[0].closest('.calendar-event')).toBeInTheDocument();
});

test('switches between different calendar views', () => {
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

  // Test month view
  fireEvent.click(screen.getByText('Month'));
  expect(document.querySelector('.month-view')).toBeInTheDocument();

  // Test week view
  fireEvent.click(screen.getByText('Week'));
  expect(document.querySelector('.week-view')).toBeInTheDocument();

  // Test day view
  fireEvent.click(screen.getByText('Day'));
  expect(document.querySelector('.day-view')).toBeInTheDocument();
});

test('handles timezone conversions correctly', () => {
  const eventInDifferentTZ: Event = {
    id: '5',
    title: 'International Call',
    start: new Date(testDate.getTime()), // Use same test date
    end: new Date(testDate.getTime() + 60 * 60 * 1000),
    calendarId: '1'
  };

  render(
    <CalendarView
      calendars={mockCalendars}
      events={[eventInDifferentTZ]}
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
      loading={false}
      error={null}
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
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
      loading={false}
      error={null}
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
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
      loading={false}
      error={null}
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
    />
  );

  // Simulate clicking on an empty time slot
  const timeSlot = document.querySelector('.droppable-area');
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
      loading={false}
      error={null}
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onDrop={jest.fn()}
      draggingEvent={null}
    />
  );

  // Find the event element
  const eventElement = screen.getByText('Meeting');
  expect(eventElement).toBeInTheDocument();

  // Simulate resize drag
  fireEvent.mouseDown(eventElement, { 
    clientY: 100,
    target: eventElement
  });
  
  fireEvent.mouseMove(window, { 
    clientY: 200 
  });
  
  fireEvent.mouseUp(window, { 
    clientY: 200 
  });

  expect(onSaveEvent).toHaveBeenCalledWith(expect.objectContaining({
    ...mockEvents[0],
    end: expect.any(Date)
  }));
});
