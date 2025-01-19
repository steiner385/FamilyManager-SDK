import React, { useCallback } from 'react';
import { Calendar, Event } from '../../contexts/CalendarContext';

interface CalendarGridProps {
  view: 'day' | 'week' | 'month';
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onCreateEvent: (date: Date) => void;
  onDragStart: (event: Event) => void;
  onDragEnd: () => void;
  onDrop: (date: Date) => void;
  draggingEvent: Event | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  view,
  currentDate,
  events,
  onEventClick,
  onCreateEvent,
  onDragStart,
  onDragEnd,
  onDrop,
  draggingEvent,
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragging-over');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragging-over');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragging-over');
    onDrop(date);
  }, [onDrop]);

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="day-view">
        <div className="time-column">
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              {`${hour}:00`}
            </div>
          ))}
        </div>
        <div className="events-column">
          {hours.map(hour => {
            const date = new Date(currentDate);
            date.setHours(hour, 0, 0, 0);
            
            return (
              <div
                key={hour}
                className="droppable-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
                onClick={() => onCreateEvent(date)}
              >
                {events
                  .filter(event => event.start.getHours() === hour)
                  .map(event => (
                    <div
                      key={event.id}
                      className={`event ${draggingEvent?.id === event.id ? 'dragging' : ''}`}
                      style={{ backgroundColor: event.color }}
                      draggable
                      onDragStart={() => onDragStart(event)}
                      onDragEnd={onDragEnd}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - date.getDay() + i);
      return date;
    });

    return (
      <div className="week-view">
        {days.map(day => (
          <div key={day.toISOString()} className="day-column">
            <div className="day-header">
              {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </div>
            <div
              className="droppable-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, day)}
              onClick={() => onCreateEvent(day)}
            >
              {events
                .filter(event => 
                  event.start.toDateString() === day.toDateString()
                )
                .map(event => (
                  <div
                    key={event.id}
                    className={`event ${draggingEvent?.id === event.id ? 'dragging' : ''}`}
                    style={{ backgroundColor: event.color }}
                    draggable
                    onDragStart={() => onDragStart(event)}
                    onDragEnd={onDragEnd}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    const currentMonth = currentDate.getMonth();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
      if (date > lastDay && date.getDay() === 6) break;
    }

    return (
      <div className="month-view">
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={`day-cell ${day.getMonth() === currentMonth ? '' : 'other-month'}`}
          >
            <div className="day-header">
              {day.getDate()}
            </div>
            <div
              className="droppable-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, day)}
              onClick={() => onCreateEvent(day)}
            >
              {events
                .filter(event => 
                  event.start.toDateString() === day.toDateString()
                )
                .map(event => (
                  <div
                    key={event.id}
                    className={`event ${draggingEvent?.id === event.id ? 'dragging' : ''}`}
                    style={{ backgroundColor: event.color }}
                    draggable
                    onDragStart={() => onDragStart(event)}
                    onDragEnd={onDragEnd}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-grid">
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </div>
  );
};

export default CalendarGrid;
