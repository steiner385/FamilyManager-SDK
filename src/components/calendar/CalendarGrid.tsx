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
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
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
            const slotStart = new Date(currentDate);
            slotStart.setHours(hour, 0, 0, 0);
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(hour + 1, 0, 0, 0);
            
            return (
              <div
                key={hour}
                className="droppable-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, slotStart)}
                onClick={() => onCreateEvent(slotStart)}
              >
                {events
                  .filter(event => {
                    const eventStart = new Date(event.start);
                    return eventStart >= dayStart && 
                           eventStart <= dayEnd &&
                           eventStart.getHours() === hour;
                  })
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
        {days.map(day => {
          const dayStart = new Date(day);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);

          return (
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
                  .filter(event => {
                    const eventStart = new Date(event.start);
                    return eventStart >= dayStart && eventStart <= dayEnd;
                  })
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
          );
        })}
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
        {days.map(day => {
          const dayStart = new Date(day);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);

          return (
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
                  .filter(event => {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    return (eventStart >= dayStart && eventStart <= dayEnd) ||
                           (event.allDay && eventStart <= dayEnd && eventEnd >= dayStart);
                  })
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
          );
        })}
      </div>
    );
  };

  return (
    <div className="calendar-grid">
      {view === 'day' && (
        <div className="day-view rbc-time-view">
          <div className="rbc-time-slot">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="rbc-time-slot" onClick={() => onCreateEvent(new Date(currentDate.setHours(i)))}>
                {`${i}:00`}
              </div>
            ))}
          </div>
        </div>
      )}
      {view === 'week' && (
        <div className="week-view rbc-time-view">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - date.getDay() + i);
            return (
              <div key={i} className="day-column">
                <div className="day-header">
                  {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                </div>
                <div className="droppable-area">
                  {events
                    .filter(event => {
                      const eventDate = new Date(event.start);
                      return eventDate.toDateString() === date.toDateString();
                    })
                    .map(event => (
                      <div
                        key={event.id}
                        className={`event rbc-event ${event.allDay ? 'rbc-event-allday' : ''} ${draggingEvent?.id === event.id ? 'dragging' : ''}`}
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
            );
          })}
        </div>
      )}
      {view === 'month' && (
        <div className="month-view rbc-month-view">
          {renderMonthView()}
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
