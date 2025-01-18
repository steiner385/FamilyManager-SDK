import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Event as EventType } from '../../contexts/CalendarContext';

interface EventProps {
  event: EventType;
  index: number;
  onClick: (event: EventType) => void;
}

const Event: React.FC<EventProps> = ({ event, index, onClick }) => {
  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`event ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            backgroundColor: event.color,
            ...provided.draggableProps.style
          }}
          onClick={() => onClick(event)}
        >
          {event.title}
        </div>
      )}
    </Draggable>
  );
};

export default Event;
