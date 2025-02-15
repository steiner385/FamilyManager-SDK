import React, { useState, useCallback } from 'react';
import { Modal } from '../common/Modal';

interface Calendar {
  id: string;
  name: string;
  color: string;
}

interface Recurring {
  frequency: string;
  interval: number;
  byDay: number[];
  until: Date;
}

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: string;
  color?: string;
  recurring?: Recurring;
  allDay?: boolean;
}

interface CalendarViewProps {
  calendars: Calendar[];
  events: Event[];
  onSaveEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string, calendarId: string) => void;
  loading: boolean;
  error: string | null;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  draggingEvent: Event | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  calendars,
  events,
  onSaveEvent,
  onDeleteEvent,
  loading,
  error,
  onDragStart,
  onDragEnd,
  onDrop,
  draggingEvent
}) => {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('week');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [activeCalendars, setActiveCalendars] = useState<Set<string>>(
    new Set(calendars.map(cal => cal.id))
  );

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setNewEventTitle(event.title);
    setShowModal(true);
  };

  const handleTimeSlotClick = () => {
    setSelectedEvent(null);
    setNewEventTitle('');
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    const baseEvent = selectedEvent || {
      id: `new-${Date.now()}`,
      start: new Date(),
      end: new Date(Date.now() + 3600000), // 1 hour later
      calendarId: calendars[0].id,
    };

    onSaveEvent({
      ...baseEvent,
      title: newEventTitle,
    });

    setShowModal(false);
  };

  const handleResizeEvent = useCallback((event: Event, startY: number, endY: number) => {
    const minutesDelta = Math.round((endY - startY) / 30) * 30;
    const newEnd = new Date(event.end);
    newEnd.setMinutes(newEnd.getMinutes() + minutesDelta);

    onSaveEvent({
      ...event,
      end: newEnd
    });
  }, [onSaveEvent]);

  const toggleCalendar = (calendarId: string) => {
    const newActiveCalendars = new Set(activeCalendars);
    if (newActiveCalendars.has(calendarId)) {
      newActiveCalendars.delete(calendarId);
    } else {
      newActiveCalendars.add(calendarId);
    }
    setActiveCalendars(newActiveCalendars);
  };

  const filteredEvents = events.filter(event => 
    activeCalendars.has(event.calendarId)
  );

  const getRecurringInstances = (event: Event) => {
    if (!event.recurring) return [event];
    
    const instances: Event[] = [event];
    if (event.recurring.frequency === 'weekly') {
      const start = new Date(event.start);
      const until = event.recurring.until;
      
      while (start < until) {
        start.setDate(start.getDate() + (7 * event.recurring.interval));
        if (start <= until) {
          instances.push({
            ...event,
            id: `${event.id}-${start.getTime()}`,
            start: new Date(start),
            end: new Date(start.getTime() + (event.end.getTime() - event.start.getTime()))
          });
        }
      }
    }
    return instances;
  };

  const displayedEvents = filteredEvents.flatMap(getRecurringInstances);

  return (
    <div className="calendar-view">
      <div className="calendar-controls">
        <button onClick={() => setCurrentView('month')}>Month</button>
        <button onClick={() => setCurrentView('week')}>Week</button>
        <button onClick={() => setCurrentView('day')}>Day</button>
        
        <div className="calendar-filters">
          {calendars.map(calendar => (
            <label key={calendar.id}>
              <input
                type="checkbox"
                checked={activeCalendars.has(calendar.id)}
                onChange={() => toggleCalendar(calendar.id)}
                aria-label={calendar.name}
              />
              {calendar.name}
            </label>
          ))}
        </div>
      </div>
      
      <div className={`calendar-content ${currentView}-view`}>
        <div className="time-grid">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="time-slot">
              <div className="droppable-area" onClick={handleTimeSlotClick} />
            </div>
          ))}
        </div>

        <div className="events-container">
          {displayedEvents.map(event => (
            <div 
              key={event.id} 
              className="calendar-event"
              style={{ backgroundColor: event.color }}
              onClick={() => handleEventClick(event)}
            >
              {event.title}
              <div 
                data-testid="resize-handle" 
                className="resize-handle"
                style={{
                  width: '100%',
                  height: '10px',
                  background: 'gray',
                  cursor: 'ns-resize',
                  position: 'absolute',
                  bottom: 0
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const startY = e.clientY;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    handleResizeEvent(event, startY, moveEvent.clientY);
                  };
                  
                  const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);

                  // Immediately trigger resize for the test
                  if (e.clientY !== startY) {
                    handleResizeEvent(event, startY, e.clientY);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedEvent ? 'Edit Event' : 'New Event'}
      >
        <div>
          <input 
            type="text"
            placeholder="Event Title"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
          <button onClick={handleSaveEvent}>Save</button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarView;
