import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import './App.css';

const ContributionGraph = () => {
  const today = new Date();
  const startDate = moment(today).subtract(50, 'weeks').toDate();
  const [contributionsData, setContributionsData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const contributionGraphRef = useRef(null);


  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStartDate = moment(startDate).add(monthIndex, 'months').toDate();

    return {
      monthName: monthStartDate.toLocaleString('default', { month: 'short' }),
      weeks: Array.from({ length: 4 }, (_, weekIndex) => {
        const weekStartDate = moment(monthStartDate).startOf('month').add(weekIndex, 'weeks').startOf('isoWeek').toDate();

        return {
          weekNumber: weekIndex + 1,
          days: Array.from({ length: 7 }, (_, dayIndex) => {
            const currentDate = moment(weekStartDate).add(dayIndex, 'days').toDate();
            return {
              dayNumber: currentDate.getDate(),
              date: currentDate.toISOString().slice(0, 10),
            };
          }),
        };
      }),
    };
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dpg.gg/test/calendar.json');
        const data = await response.json();
        setContributionsData(data);
      } catch (error) {
        console.error('Error fetching contributions data:', error);
      }
    };

    fetchData();
  }, []);

  const getColorClass = (contributions) => {
    if (contributions === 0) return 'no-contributions';
    else if (contributions >= 1 && contributions <= 9) return 'low-contributions';
    else if (contributions >= 10 && contributions <= 19) return 'medium-contributions';
    else if (contributions >= 20 && contributions <= 29) return 'high-contributions';
    else return 'very-high-contributions';
  };

  const formatTooltipDate = (date) => {

    const formattedDate = moment(date).locale('ru').format('dddd, MMMM D, YYYY');

    return formattedDate;
  };


  const handleCellClick = (contributions, date) => {
    setSelectedCell({ contributions, date });
  };

  const handleOutsideClick = (event) => {
    if (contributionGraphRef.current && !contributionGraphRef.current.contains(event.target)) {
      setSelectedCell(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);



  return (
    <div>
      <div className="contribution-wrapper" ref={contributionGraphRef}>
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
                      {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                        const day = week.days[dayIndex];
                        return (
                          <div
                            key={day.dayNumber}
                            className={`day ${day.date === today.toISOString().slice(0, 10) ? 'current-day' : ''} ${selectedCell && selectedCell.date === day.date ? 'selected-cell' : ''}`}
                            data-date={day.date}
                            onClick={() => handleCellClick(contributionsData?.[day.date] || 0, day.date)}
                          >
                            <div className={`contribution-cell ${getColorClass(contributionsData?.[day.date] || 0)}`}>
                              {selectedCell && selectedCell.date === day.date && (
                                <div className="tooltip">
                                  <div className="countContribution">{selectedCell.contributions} contributions</div>
                                  <div className="dateContribution">{formatTooltipDate(selectedCell.date)}</div>
                                  <div className="arrowTooltip"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="contribution-graph-clue">
        <div className="title">Меньше</div>
        <div className="contribution-cell">
        </div>
        <div className="contribution-cell medium-contributions">
        </div>
        <div className="contribution-cell high-contributions">
        </div>
        <div className="contribution-cell very-high-contributions">
        </div>
        <div className="title">Больше</div>
      </div>
    </div>
  );
};

export default ContributionGraph;
