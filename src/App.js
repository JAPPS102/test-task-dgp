import React from 'react';
import './App.css';

const ContributionGraph = () => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 357);

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStartDate = new Date(startDate);
    monthStartDate.setMonth(monthStartDate.getMonth() + monthIndex);

    return {
      monthName: monthStartDate.toLocaleString('default', { month: 'short' }),
      weeks: Array.from({ length: 4 }, (_, weekIndex) => {
        const weekStartDate = new Date(monthStartDate);
        weekStartDate.setDate(weekStartDate.getDate() + weekIndex * 7);

        return {
          weekNumber: weekIndex + 1,
          days: Array.from({ length: 7 }, (_, dayIndex) => {
            const currentDate = new Date(weekStartDate);
            currentDate.setDate(currentDate.getDate() + dayIndex);
            return {
              dayNumber: currentDate.getDate(),
              date: currentDate.toISOString().slice(0, 10),
            };
          }),
        };
      }),
    };
  });

  return (
    <div className="contribution-wrapper">
      <div className="contribution-graph">
        <div className="month">
          <div className="weeks">
            <div className="days weekdays">
              {weekdays.map((weekday, index) => (
                <div key={index} className="weekday">
                  {weekday}
                </div>
              ))}
            </div>
          </div>
        </div>
        {months.map((month, index) => (
          <div key={index} className="month">
            <div className="month-name">{month.monthName}</div>
            <div className="weeks">
              {month.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="week">
                  <div className="week-number"></div>
                  <div className="days">
                    {week.days.map((day) => (
                      <div key={day.dayNumber} className={`day ${day.date === today.toISOString().slice(0, 10) ? 'current-day' : ''}`} data-date={day.date}>
                        <div className="contribution-cell"></div>
                        { }
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};
export default ContributionGraph;