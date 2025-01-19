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
  onSaveEvent: (event: Event) => void;
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
      <div className="day-view" data-testid="day-view">
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
                    const eventEnd = new Date(event.end);
                    return (
                      (eventStart >= slotStart && eventStart < slotEnd) ||
                      (eventEnd > slotStart && eventEnd <= slotEnd) ||
                      (eventStart <= slotStart && eventEnd >= slotEnd)
                    );
                  })
                  .map(event => (
                    <div
                      key={event.id}
                      className={`calendar-event ${draggingEvent?.id === event.id ? 'dragging' : ''}`}
                      style={{ backgroundColor: event.color }}
                      draggable
                      onDragStart={() => onDragStart(event)}
                      onDragEnd={onDragEnd}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      onMouseDown={(e) => {
                        const startY = e.clientY;
                        const originalEnd = new Date(event.end);
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaY = moveEvent.clientY - startY;
                          const hoursDelta = Math.floor(deltaY / 30);
                          const newEnd = new Date(originalEnd);
                          newEnd.setMinutes(newEnd.getMinutes() + (hoursDelta * 30));
                          
                          const updatedEvent = {
                            ...event,
                            end: newEnd
                          };
                          onSaveEvent(updatedEvent);
                        };
                        
                        const handleMouseUp = () => {
                          const deltaY = e.clientY - startY;
                          const hoursDelta = Math.floor(deltaY / 30);
                          const finalEnd = new Date(originalEnd);
                          finalEnd.setMinutes(finalEnd.getMinutes() + (hoursDelta * 30));
                          
                          const finalEvent = {
                            ...event,
                            end: finalEnd
                          };
                          onSaveEvent(finalEvent);
                          
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
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
      <div className="week-view" data-testid="week-view">
        {days.map(day => {
          const dayStart = new Date(day);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);

          const dayEvents = events.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return (
              (eventStart >= dayStart && eventStart < dayEnd) ||
              (eventEnd > dayStart && eventEnd <= dayEnd) ||
              (eventStart <= dayStart && eventEnd >= dayEnd) ||
              (event.allDay && eventStart <= dayEnd && eventEnd >= dayStart)
            );
          });

          return (
            <div key={day.toISOString()} className="day-column">
              <div className="day-header">
                {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
              </div>
              <div className="time-slots">
                {Array.from({ length: 24 }, (_, hour) => {
                  const slotStart = new Date(day);
                  slotStart.setHours(hour, 0, 0, 0);
                  const slotEnd = new Date(slotStart);
                  slotEnd.setHours(hour + 1, 0, 0, 0);

                  const slotEvents = dayEvents.filter(event => {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    return (
                      (eventStart >= slotStart && eventStart < slotEnd) ||
                      (eventEnd > slotStart && eventEnd <= slotEnd) ||
                      (eventStart <= slotStart && eventEnd >= slotEnd)
                    );
                  });

                  return (
                    <div
                      key={hour}
                      className="droppable-area"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, slotStart)}
                      onClick={() => onCreateEvent(slotStart)}
                    >
                      {slotEvents.map(event => (
                        <div
                          key={event.id}
                          className={`calendar-event ${draggingEvent?.id === event.id ? 'dragging' : ''}`}
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
      <div className="month-view" data-testid="month-view">
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
                    const isInDay = (eventStart >= dayStart && eventStart <= dayEnd) ||
                                  (event.allDay && eventStart <= dayEnd && eventEnd >= dayStart);
                    
                    if (event.recurring) {
                      // Generate recurring instances
                      const instances = [];
                      const startOfView = new Date(dayStart);
                      const endOfView = new Date(dayEnd);
                      let currentInstance = new Date(eventStart);

                      const interval = event.recurring.interval || 1;
                      const daysOfWeek = event.recurring.byDay || [];

                      while (currentInstance <= endOfView && (!event.recurring.until || currentInstance <= event.recurring.until)) {
                        if (
                          currentInstance >= startOfView &&
                          (daysOfWeek.length === 0 || daysOfWeek.includes(currentInstance.getDay()))
                        ) {
                          instances.push(new Date(currentInstance.getTime()));
                        }

                        // Move to next day
                        currentInstance.setDate(currentInstance.getDate() + 1);
                      }
                      return instances.some(instance => {
                        const instanceStart = new Date(instance);
                        return instanceStart.getDate() === day.getDate() && 
                               instanceStart.getMonth() === day.getMonth();
                      });
                    }
                    return isInDay;
                  })
                  .map(event => (
                    <div
                      key={event.id}
                      className={`calendar-event ${draggingEvent?.id === event.id ? 'dragging' : ''}`}
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
    <div className="calendar-grid" data-testid="calendar-grid">
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </div>
  );
};

export default CalendarGrid;
