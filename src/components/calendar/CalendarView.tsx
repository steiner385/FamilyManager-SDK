import React, { useState, useCallback } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarModal from './CalendarModal';
import { Calendar, Event } from '../../contexts/CalendarContext';
import './Calendar.css';
import { RRule } from 'rrule';

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


  const handleCreateEvent = useCallback((date: Date) => {
    setSelectedEvent({
      id: `new-${Date.now()}`,
      title: '',
      start: date,
      end: new Date(date.getTime() + 60 * 60 * 1000), // Default 1 hour event
      calendarId: calendars[0]?.id || '',
      color: '#3b82f6',
      recurring: undefined
    });
    setIsModalOpen(true);
  }, [calendars]);

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))}>Previous</button>
        <button onClick={() => setCurrentDate(new Date())}>Today</button>
        <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))}>Next</button>
        <div className="view-buttons">
          <button onClick={() => setView('day')}>Day</button>
          <button onClick={() => setView('week')}>Week</button>
          <button onClick={() => setView('month')}>Month</button>
        </div>
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
                  // Force re-render when calendars change
                  setCurrentDate(new Date(currentDate.getTime())); 
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
            onSaveEvent={onSaveEvent}
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
