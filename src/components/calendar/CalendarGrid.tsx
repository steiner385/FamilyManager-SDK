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
                        if (e.target === e.currentTarget) return; // Only handle resize from bottom edge
                        
                        const startY = e.clientY;
                        const originalEnd = new Date(event.end);
                        let lastEnd = originalEnd;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaY = moveEvent.clientY - startY;
                          const hoursDelta = Math.round(deltaY / 60);
                          const newEnd = new Date(originalEnd);
                          newEnd.setHours(newEnd.getHours() + hoursDelta);
                          
                          if (newEnd.getTime() !== lastEnd.getTime()) {
                            lastEnd = newEnd;
                            const updatedEvent = {...event, end: newEnd};
                            onEventClick(updatedEvent); // Update preview
                            onSaveEvent(updatedEvent); // Also save the change
                          }
                        };
                        
                        const handleMouseUp = () => {
                          const deltaY = document.documentElement.scrollTop + window.innerHeight - startY;
                          const hoursDelta = Math.round(deltaY / 60);
                          const finalEnd = new Date(originalEnd);
                          finalEnd.setHours(finalEnd.getHours() + hoursDelta);
                          
                          const finalEvent = {...event, end: finalEnd};
                          onSaveEvent(finalEvent); // Save the final change
                          
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
                      const startOfView = new Date(Math.min(dayStart.getTime(), currentDate.getTime()));
                      const endOfView = new Date(Math.max(dayEnd.getTime(), new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)));
                      let currentInstance = new Date(eventStart);
                      
                      while (currentInstance <= endOfView && (!event.recurring.until || currentInstance <= event.recurring.until)) {
                        if (currentInstance >= startOfView) {
                          instances.push(new Date(currentInstance.getTime()));
                        }
                        
                        const interval = event.recurring.interval || 1;
                        const newInstance = new Date(currentInstance);
                        
                        switch (event.recurring.frequency) {
                          case 'daily':
                            newInstance.setDate(newInstance.getDate() + interval);
                            break;
                          case 'weekly':
                            newInstance.setDate(newInstance.getDate() + (7 * interval));
                            break;
                          case 'monthly':
                            newInstance.setMonth(newInstance.getMonth() + interval);
                            break;
                          case 'yearly':
                            newInstance.setFullYear(newInstance.getFullYear() + interval);
                            break;
                        }
                        currentInstance = newInstance;
                      }
                      // Return true if we have instances in this period
                      return instances.some(instance => {
                        const instanceStart = new Date(instance);
                        const instanceEnd = new Date(instanceStart);
                        instanceEnd.setHours(eventEnd.getHours(), eventEnd.getMinutes());
                        
                        return (instanceStart >= dayStart && instanceStart <= dayEnd) ||
                               (instanceEnd >= dayStart && instanceEnd <= dayEnd);
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
