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
    start: new Date(2025, 0, 20, 10, 0), // January 20, 2025 10:00 AM
    end: new Date(2025, 0, 20, 11, 0),   // January 20, 2025 11:00 AM
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
  
  // Wait for loading state to disappear
  await waitFor(() => {
    expect(screen.queryByText('Loading calendar...')).not.toBeInTheDocument();
  });

  // Wait for calendar grid and event to appear
  await screen.findByTestId('calendar-grid');
  await screen.findByTestId('event-Meeting');
  
  const eventElement = screen.getByTestId('event-Meeting');
  expect(eventElement).toHaveTextContent('Meeting');
});
