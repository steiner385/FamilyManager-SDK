import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { CalendarProvider } from '../../contexts/CalendarContext';

const CalendarView = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <CalendarProvider>
      <div className="calendar-view">
        <CalendarHeader
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
        <CalendarGrid view={view} currentDate={currentDate} />
      </div>
    </CalendarProvider>
  );
};

export default CalendarView;
