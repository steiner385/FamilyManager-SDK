import React, { useState, useCallback } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarModal from './CalendarModal';
import { Calendar, Event } from '../../contexts/CalendarContext';
import './Calendar.css';

interface CalendarViewProps {
  calendars: Calendar[];
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onSaveEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onDragStart?: (event: Event) => void;
  onDragEnd?: () => void;
  onDrop?: (date: Date) => void;
  draggingEvent?: Event | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  calendars,
  events,
  onSaveEvent,
  onDeleteEvent,
  onDragStart,
  onDragEnd,
  onDrop,
  draggingEvent,
  loading = false,
  error = null,
}) => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enabledCalendars, setEnabledCalendars] = useState<Set<string>>(
    new Set(calendars.map(cal => cal.id))
  );

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = (event: Event) => {
    onSaveEvent(event);
    setIsModalOpen(false);
  };

  const handleDelete = (eventId: string) => {
    onDeleteEvent(eventId);
    setIsModalOpen(false);
  };

  const handleDragStart = (event: Event) => {
    if (onDragStart) {
      onDragStart(event);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDrop = (date: Date) => {
    if (onDrop) {
      onDrop(date);
    }
  };


  const handleCreateEvent = (date: Date) => {
    setSelectedEvent({
      id: '',
      title: '',
      start: date,
      end: new Date(date.getTime() + 60 * 60 * 1000), // Default 1 hour event
      calendarId: calendars[0]?.id || '',
      color: '#3b82f6',
      recurring: {
        frequency: 'none',
        interval: 1,
        count: undefined,
        until: undefined,
        byDay: [],
        byMonth: [],
        byMonthDay: []
      }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))}>Previous</button>
        <button onClick={() => setCurrentDate(new Date())}>Today</button>
        <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))}>Next</button>
        <select 
          value={view} 
          onChange={(e) => {
            const newView = e.target.value as 'day' | 'week' | 'month';
            setView(newView);
          }}
          data-testid="view-selector"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <div className="calendar-filters">
          {calendars.map(calendar => (
            <label key={calendar.id}>
              <input
                type="checkbox"
                checked={enabledCalendars.has(calendar.id)}
                onChange={(e) => {
                  const newEnabled = new Set(enabledCalendars);
                  if (e.target.checked) {
                    newEnabled.add(calendar.id);
                  } else {
                    newEnabled.delete(calendar.id);
                  }
                  setEnabledCalendars(newEnabled);
                }}
              />
              {calendar.name}
            </label>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="loading">Loading calendar...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <CalendarGrid
            view={view}
            currentDate={currentDate}
            events={events.filter(event => enabledCalendars.has(event.calendarId))}
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggingEvent={draggingEvent}
          />
          {isModalOpen && (
            <CalendarModal
              event={selectedEvent}
              calendars={calendars}
              onSave={handleSave}
              onDelete={selectedEvent ? handleDelete : undefined}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CalendarView;
