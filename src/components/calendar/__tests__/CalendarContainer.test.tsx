import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarContainer from '../CalendarContainer';
import { usePlugins } from '../../../hooks/usePlugins';

jest.mock('../../../hooks/usePlugins');

test('renders CalendarContainer with plugin data', async () => {
  const mockCalendars = [{ id: '1', name: 'Work', color: '#3b82f6' }];
  const mockEvents = [{
    id: '1',
    title: 'Meeting',
    start: new Date(2023, 9, 10, 10, 0),
    end: new Date(2023, 9, 10, 11, 0),
    calendarId: '1',
    color: '#3b82f6',
  }];

  (usePlugins as jest.Mock).mockReturnValue({
    plugins: [
      {
        getCalendars: jest.fn().mockResolvedValue(mockCalendars),
        getEvents: jest.fn().mockResolvedValue(mockEvents),
      },
    ],
  });

  render(<CalendarContainer />);
  
  // Wait for loading state to clear
  expect(screen.getByText('Loading calendar...')).toBeInTheDocument();
  
  // Wait for the event to appear
  const eventElement = await screen.findByText('Meeting');
  expect(eventElement).toBeInTheDocument();
});
