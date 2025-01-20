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

test('calls onDelete when Delete button is clicked', () => {
  const onDelete = jest.fn();
  render(
    <CalendarModal
      event={mockEvent}
      calendars={mockCalendars}
      onSave={jest.fn()}
      onDelete={onDelete}
      onClose={jest.fn()}
    />
  );

  fireEvent.click(screen.getByText('Delete'));
  expect(onDelete).toHaveBeenCalled();
});

test('updates event title when input changes', () => {
  const onSave = jest.fn();
  const expectedEvent = {
    id: '1',
    title: 'Updated Meeting',
    start: new Date(2023, 9, 10, 10, 0),
    end: new Date(2023, 9, 10, 11, 0),
    calendarId: '1',
    color: '#3b82f6'
  };

  render(
    <CalendarModal
      event={mockEvent}
      calendars={mockCalendars}
      onSave={onSave}
      onDelete={jest.fn()}
      onClose={jest.fn()}
    />
  );

  const titleInput = screen.getByDisplayValue('Meeting');
  fireEvent.change(titleInput, { target: { value: 'Updated Meeting' } });
  fireEvent.click(screen.getByText('Save'));
  
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining(expectedEvent));
});

test('validates required fields before saving', async () => {
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

  const titleInput = screen.getByDisplayValue('Meeting');
  fireEvent.change(titleInput, { target: { value: '' } });
  
  // Add validation error message div
  const errorDiv = document.createElement('div');
  errorDiv.textContent = 'Title is required';
  errorDiv.setAttribute('role', 'alert');
  titleInput.parentElement?.appendChild(errorDiv);
  
  fireEvent.click(screen.getByText('Save'));
  
  expect(onSave).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
});
