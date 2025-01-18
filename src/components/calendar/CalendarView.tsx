import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarModal from './CalendarModal';
import { CalendarProvider } from '../../contexts/CalendarContext';
import { Event } from '../../contexts/CalendarContext';

const CalendarView = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    // Logic to save the event (add or update)
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    // Logic to delete the event
    setIsModalOpen(false);
  };

  return (
    <CalendarProvider>
      <div className="calendar-view">
        <CalendarHeader
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
        <CalendarGrid view={view} currentDate={currentDate} onEventClick={handleEventClick} />
        {isModalOpen && (
          <CalendarModal
            event={selectedEvent}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </CalendarProvider>
  );
};

export default CalendarView;
