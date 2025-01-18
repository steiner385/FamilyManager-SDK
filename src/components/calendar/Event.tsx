import React from 'react';
import { Event as EventType } from '../../contexts/CalendarContext';

interface EventProps {
  event: EventType;
  onClick: (event: EventType) => void;
}

const Event: React.FC<EventProps> = ({ event, onClick }) => {
  return (
    <div
      className="event"
      style={{ backgroundColor: event.color }}
      onClick={() => onClick(event)}
    >
      {event.title}
    </div>
  );
};

export default Event;
