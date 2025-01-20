import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  const mockPlugin = {
    getCalendars: jest.fn().mockResolvedValue(mockCalendars),
    getEvents: jest.fn().mockResolvedValue(mockEvents),
  };

  (usePlugins as jest.Mock).mockReturnValue({
    plugins: [mockPlugin],
  });

  render(<CalendarContainer />);
  
  // Wait for loading state to clear
  expect(screen.getByText('Loading calendar...')).toBeInTheDocument();
  
  // Wait for loading state to disappear
  await waitFor(() => {
    expect(screen.queryByText('Loading calendar...')).not.toBeInTheDocument();
  });

  // Debug output
  screen.debug();
  
  // Log the mock calls
  console.log('Plugin getCalendars called:', mockPlugin.getCalendars.mock.calls.length);
  console.log('Plugin getEvents called:', mockPlugin.getEvents.mock.calls.length);

  // Check if calendar grid is rendered
  const calendarGrid = await screen.findByTestId('calendar-grid');
  expect(calendarGrid).toBeInTheDocument();

  // Check if week view is rendered (default view)
  const weekView = screen.getByTestId('week-view');
  expect(weekView).toBeInTheDocument();

  // Look for any elements with the event title
  const eventElements = screen.queryAllByText('Meeting');
  console.log('Found event elements:', eventElements.length);
});
