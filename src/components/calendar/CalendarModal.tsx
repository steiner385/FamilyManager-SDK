import React, { useState } from 'react';
import { Modal } from '../common/Modal';
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
  const [recurring, setRecurring] = useState<RecurrenceRule | undefined>(event?.recurring || {
    frequency: 'weekly',
    interval: 1,
    count: undefined,
    until: undefined,
    byDay: [],
    byMonth: [],
    byMonthDay: []
  });
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
    <Modal onClose={onClose} title={event?.id ? 'Edit Event' : 'New Event'}>
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
          Recurrence:
          <select 
            value={recurring?.frequency || 'none'} 
            onChange={(e) => setRecurring({
              ...recurring,
              frequency: e.target.value as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
            })}
          >
            <option value="none">No recurrence</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

        {recurring?.frequency !== 'none' && (
          <div className="recurrence-options">
            <label>
              Every:
              <input
                type="number"
                min="1"
                value={recurring?.interval || 1}
                onChange={(e) => setRecurring({
                  ...recurring,
                  interval: parseInt(e.target.value)
                })}
              />
              {recurring?.frequency}
            </label>

            {recurring?.frequency === 'weekly' && (
              <div className="weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={recurring?.byDay?.includes(i)}
                      onChange={(e) => {
                        const byDay = e.target.checked
                          ? [...(recurring?.byDay || []), i]
                          : (recurring?.byDay || []).filter(d => d !== i);
                        setRecurring({
                          ...recurring,
                          byDay
                        });
                      }}
                    />
                    {day}
                  </label>
                ))}
              </div>
            )}

            <label>
              Ends:
              <select
                value={recurring?.count ? 'count' : recurring?.until ? 'until' : 'never'}
                onChange={(e) => {
                  if (e.target.value === 'never') {
                    setRecurring({
                      ...recurring,
                      count: undefined,
                      until: undefined
                    });
                  } else {
                    setRecurring({
                      ...recurring,
                      [e.target.value === 'count' ? 'count' : 'until']: e.target.value === 'count' ? 1 : new Date()
                    });
                  }
                }}
              >
                <option value="never">Never</option>
                <option value="count">After</option>
                <option value="until">On</option>
              </select>
            </label>

            {recurring?.count && (
              <label>
                Occurrences:
                <input
                  type="number"
                  min="1"
                  value={recurring.count}
                  onChange={(e) => setRecurring({
                    ...recurring,
                    count: parseInt(e.target.value)
                  })}
                />
              </label>
            )}

            {recurring?.until && (
              <label>
                End Date:
                <input
                  type="date"
                  value={recurring.until.toISOString().slice(0, 10)}
                  onChange={(e) => setRecurring({
                    ...recurring,
                    until: new Date(e.target.value)
                  })}
                />
              </label>
            )}
          </div>
        )}

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
