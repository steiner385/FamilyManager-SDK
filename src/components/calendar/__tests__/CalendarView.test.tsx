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
  const timeSlot = screen.getByTestId('calendar-timeslot-2023-10-10-14');
  fireEvent.click(timeSlot);

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

  const eventElement = screen.getByText('Meeting');
  const resizeHandle = eventElement.querySelector('.rbc-event-resizer');
  
  fireEvent.mouseDown(resizeHandle);
  fireEvent.mouseMove(document, { clientY: 100 });
  fireEvent.mouseUp(document);

  expect(onSaveEvent).toHaveBeenCalledWith(expect.objectContaining({
    ...mockEvents[0],
    end: expect.any(Date)
  }));
});
