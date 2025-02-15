import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, jest } from '@jest/globals';
import type { Calendar, Event } from '../../../types/calendar';
import { createMockCalendarPlugin } from '../../../test-utils/mocks';
import CalendarContainer from '../CalendarContainer';
import { usePlugins } from '../../../hooks/usePlugins';
import '@testing-library/jest-dom';

interface CalendarViewProps {
  calendars?: Calendar[];
  events?: Event[];
  onSaveEvent?: (event: Event) => Promise<void>;
  onDeleteEvent?: (eventId: string, calendarId: string) => Promise<void>;
}

// Mock calendar view component
const MockCalendarView = ({ 
  calendars = [], 
  events = []
}: CalendarViewProps) => (
  <div data-testid="calendar-view">
    <div data-testid="calendars-list">
      {calendars.map(cal => (
        <div key={cal.id} data-testid={`calendar-${cal.id}`}>
          {cal.name}
        </div>
      ))}
    </div>
    <div data-testid="events-list">
      {events.map(event => (
        <div key={event.id} data-testid={`event-${event.id}`}>
          {event.title}
        </div>
      ))}
    </div>
  </div>
);

jest.mock('../../../hooks/usePlugins');

describe('CalendarContainer', () => {
  const mockCalendars = [
    { id: '1', name: 'Work', color: '#3b82f6' }
  ] as Calendar[];
  
  const mockEvents = [{
    id: '1',
    title: 'Meeting',
    start: new Date(2025, 0, 20, 10, 0),
    end: new Date(2025, 0, 20, 11, 0),
    calendarId: '1',
    color: '#3b82f6',
  }] as Event[];

  beforeEach(() => {
    const mockPlugin = createMockCalendarPlugin(mockCalendars, mockEvents);
    (usePlugins as jest.Mock).mockReturnValue({ plugins: [mockPlugin] });
  });

  it('should render loading state initially', async () => {
    render(
      <CalendarContainer>
        <MockCalendarView />
      </CalendarContainer>
    );

    const loading = await screen.findByTestId('loading-state');
    expect(loading).toBeInTheDocument();
    expect(loading).toHaveTextContent('Loading calendar...');
  });

  it('should render calendar data after loading', async () => {
    render(
      <CalendarContainer>
        <MockCalendarView />
      </CalendarContainer>
    );

    // Wait for calendar container
    const container = await screen.findByTestId('calendar-container');
    expect(container).toBeInTheDocument();

    // Check calendar data
    const calendar = await screen.findByTestId('calendar-1');
    const event = await screen.findByTestId('event-1');
    
    expect(calendar).toHaveTextContent('Work');
    expect(event).toHaveTextContent('Meeting');
  });

  it('should handle empty plugin data', async () => {
    const emptyPlugin = createMockCalendarPlugin([], []);
    (usePlugins as jest.Mock).mockReturnValue({ plugins: [emptyPlugin] });

    render(
      <CalendarContainer>
        <MockCalendarView />
      </CalendarContainer>
    );

    // Wait for initial load to complete
    const container = await screen.findByTestId('calendar-container');
    expect(container).toBeInTheDocument();

    // Verify no calendar data is shown
    expect(screen.queryByTestId('calendar-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('event-1')).not.toBeInTheDocument();
  });
});
