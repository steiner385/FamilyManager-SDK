import React, { useCallback } from 'react';
import { Calendar, Event } from '../../contexts/CalendarContext';
import { RRule } from 'rrule';

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
  onSaveEvent,
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
                    >
                      <div className="event-content">
                        {event.title}
                      </div>
                      <div 
                        className="resize-handle"
                        data-testid="resize-handle"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const startY = e.clientY;
                          const originalEnd = new Date(event.end);

                          const handleMouseUp = (upEvent: MouseEvent) => {
                            const deltaY = upEvent.clientY - startY;
                            const minutesDelta = Math.round(deltaY / 30) * 30;
                            const newEnd = new Date(originalEnd);
                            newEnd.setMinutes(newEnd.getMinutes() + minutesDelta);

                            onSaveEvent({
                              ...event,
                              end: newEnd
                            });

                            window.removeEventListener('mouseup', handleMouseUp);
                          };

                          window.addEventListener('mouseup', handleMouseUp);
                        }}
                      />
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
                          <div className="event-content">
                            {event.title}
                          </div>
                          <div 
                            className="resize-handle"
                            data-testid="resize-handle"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const startY = e.clientY;
                              const originalEnd = new Date(event.end);

                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                const deltaY = moveEvent.clientY - startY;
                                const minutesDelta = Math.round(deltaY / 30) * 30;
                                const newEnd = new Date(originalEnd);
                                newEnd.setMinutes(newEnd.getMinutes() + minutesDelta);
                                
                                // Preview the resize
                                const eventEl = e.currentTarget.parentElement;
                                if (eventEl) {
                                  const heightDelta = Math.max(deltaY, -eventEl.clientHeight + 30);
                                  eventEl.style.height = `${eventEl.clientHeight + heightDelta}px`;
                                }
                              };

                              const handleMouseUp = (upEvent: MouseEvent) => {
                                const deltaY = upEvent.clientY - startY;
                                const minutesDelta = Math.round(deltaY / 30) * 30;
                                const newEnd = new Date(originalEnd);
                                newEnd.setMinutes(newEnd.getMinutes() + minutesDelta);

                                onSaveEvent({
                                  ...event,
                                  end: newEnd
                                });

                                window.removeEventListener('mousemove', handleMouseMove);
                                window.removeEventListener('mouseup', handleMouseUp);
                              };

                              window.addEventListener('mousemove', handleMouseMove);
                              window.addEventListener('mouseup', handleMouseUp);
                            }}
                          />
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
                    if (event.recurring) {
                      const rule = new RRule({
                        freq: RRule[event.recurring.frequency.toUpperCase()],
                        dtstart: new Date(event.start),
                        until: event.recurring.until,
                        interval: event.recurring.interval || 1,
                        byweekday: event.recurring.byDay?.map(day => RRule[['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][day]])
                      });

                      const occurrences = rule.between(dayStart, dayEnd, true);
                      return occurrences.length > 0;
                    }
                    
                    return (eventStart >= dayStart && eventStart <= dayEnd) ||
                           (eventEnd > dayStart && eventEnd <= dayEnd) ||
                           (eventStart <= dayStart && eventEnd >= dayEnd) ||
                           (event.allDay && eventStart <= dayEnd && eventEnd >= dayStart);
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
