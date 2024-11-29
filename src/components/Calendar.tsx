import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';
import { Gig } from '../types';
import { CalendarDayPopover } from './CalendarDayPopover';

interface CalendarProps {
  gigs: Gig[];
}

export const Calendar: React.FC<CalendarProps> = ({ gigs }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getGigsForDay = (date: Date) => {
    return gigs.filter((gig) => isSameDay(new Date(gig.date), date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500';
      case 'proposed':
        return 'bg-amber-500';
      case 'canceled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const currentMonthGigs = gigs.filter(gig => 
    isSameMonth(new Date(gig.date), currentMonth)
  ).length;

  return (
    <div className="bg-dark-800 rounded-lg shadow-md p-6 border border-dark-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-100">
            Calendar View
            <span className="ml-2 text-sm text-gray-400">
              ({currentMonthGigs} gigs this month)
            </span>
          </h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-300 p-2"
          aria-label={isExpanded ? 'Collapse calendar' : 'Expand calendar'}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'mt-6' : 'h-0'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 text-gray-400 hover:text-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-medium text-gray-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-400 hover:text-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-dark-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-400"
            >
              {day}
            </div>
          ))}

          {days.map((day) => {
            const dayGigs = getGigsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <CalendarDayPopover
                key={day.toString()}
                date={day}
                gigs={dayGigs}
              >
                <div
                  className={`min-h-[100px] p-2 border-t border-dark-700 ${
                    isCurrentMonth ? 'bg-dark-800' : 'bg-dark-900'
                  } ${isCurrentDay ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isCurrentMonth ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayGigs.slice(0, 3).map((gig) => (
                      <div
                        key={gig.id}
                        className="text-xs truncate"
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusColor(
                            gig.status
                          )}`}
                        />
                        {gig.title}
                      </div>
                    ))}
                    {dayGigs.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{dayGigs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </CalendarDayPopover>
            );
          })}
        </div>
      </div>
    </div>
  );
};