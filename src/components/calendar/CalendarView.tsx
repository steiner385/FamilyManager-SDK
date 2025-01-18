import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarModal from './CalendarModal';
import { Calendar, Event } from '../../contexts/CalendarContext';

interface CalendarViewProps {
  calendars: Calendar[];
  events: Event[];
  onSaveEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  calendars,
  events,
  onSaveEvent,
  onDeleteEvent,
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

  return (
      <div className="calendar-view">
        <CalendarHeader
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
        />
        {isModalOpen && (
          <CalendarModal
            event={selectedEvent}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
  );
};

export default CalendarView;
