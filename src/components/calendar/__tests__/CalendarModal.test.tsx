import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarModal from '../CalendarModal';
import { Event } from '../../../contexts/CalendarContext';

const mockEvent: Event = {
  id: '1',
  title: 'Meeting',
  start: new Date(2023, 9, 10, 10, 0),
  end: new Date(2023, 9, 10, 11, 0),
  calendarId: '1',
  color: '#3b82f6',
};

const mockCalendars = [
  { id: '1', name: 'Work', color: '#3b82f6' },
  { id: '2', name: 'Personal', color: '#10b981' },
];

test('renders CalendarModal with event data', () => {
  render(
    <CalendarModal
      event={mockEvent}
      calendars={mockCalendars}
      onSave={jest.fn()}
      onDelete={jest.fn()}
      onClose={jest.fn()}
    />
  );

  expect(screen.getByDisplayValue('Meeting')).toBeInTheDocument();
});

test('calls onSave when Save button is clicked', () => {
  const onSave = jest.fn();
  render(
    <CalendarModal
      event={mockEvent}
      calendars={mockCalendars}
      onSave={onSave}
      onDelete={jest.fn()}
      onClose={jest.fn()}
    />
  );

  fireEvent.click(screen.getByText('Save'));
  expect(onSave).toHaveBeenCalled();
});
