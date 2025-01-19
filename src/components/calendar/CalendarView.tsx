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
}) => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <CalendarHeader
        view={view}
        onViewChange={setView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onCreateEvent={() => handleCreateEvent(currentDate)}
      />
      {loading ? (
        <div className="loading">Loading calendar...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <CalendarGrid
            view={view}
            currentDate={currentDate}
            events={events}
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
