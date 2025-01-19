import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Calendar, Event, RecurrenceRule } from '../../contexts/CalendarContext';

interface CalendarModalProps {
  event?: Event;
  calendars: Calendar[];
  onSave: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  event,
  calendars,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [start, setStart] = useState(event?.start.toISOString().slice(0, 16) || '');
  const [end, setEnd] = useState(event?.end.toISOString().slice(0, 16) || '');
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [recurring, setRecurring] = useState<RecurrenceRule | undefined>(event?.recurring);
  const [calendarId, setCalendarId] = useState(event?.calendarId || calendars[0]?.id || '');
  const [color, setColor] = useState(event?.color || '#3b82f6');
  const [description, setDescription] = useState(event?.description || '');

  const handleSave = () => {
    const newEvent: Event = {
      id: event?.id || Date.now().toString(),
      title,
      start: new Date(start),
      end: new Date(end),
      allDay,
      recurring,
      calendarId,
      color,
      description,
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
      <form>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Start:
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label>
          End:
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
        <label>
          All Day:
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
        </label>
        <label>
          Calendar:
          <select value={calendarId} onChange={(e) => setCalendarId(e.target.value)}>
            {calendars.map((calendar) => (
              <option key={calendar.id} value={calendar.id}>
                {calendar.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={handleSave}>
            Save
          </button>
          {event && onDelete && (
            <button type="button" onClick={() => onDelete(event.id)}>
              Delete
            </button>
          )}
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CalendarModal;
