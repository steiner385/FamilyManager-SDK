import React from 'react';

interface CalendarHeaderProps {
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  onViewChange,
  currentDate,
  onDateChange,
}) => {
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="calendar-header">
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={() => onDateChange(new Date())}>Today</button>
      <button onClick={handleNext}>Next</button>
      <select value={view} onChange={(e) => onViewChange(e.target.value as 'day' | 'week' | 'month')}>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
    </div>
  );
};

export default CalendarHeader;
