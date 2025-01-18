import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarContainer from '../CalendarContainer';
import { usePlugins } from '../../../hooks/usePlugins';

jest.mock('../../../hooks/usePlugins');

test('renders CalendarContainer with plugin data', () => {
  (usePlugins as jest.Mock).mockReturnValue({
    plugins: [
      {
        getCalendars: jest.fn().mockResolvedValue([{ id: '1', name: 'Work', color: '#3b82f6' }]),
        getEvents: jest.fn().mockResolvedValue([
          {
            id: '1',
            title: 'Meeting',
            start: new Date(2023, 9, 10, 10, 0),
            end: new Date(2023, 9, 10, 11, 0),
            calendarId: '1',
            color: '#3b82f6',
          },
        ]),
      },
    ],
  });

  render(<CalendarContainer />);
  expect(screen.getByText('Meeting')).toBeInTheDocument();
});
