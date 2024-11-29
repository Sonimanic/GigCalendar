import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Gig } from '../types';

interface CalendarDayPopoverProps {
  date: Date;
  gigs: Gig[];
  children: React.ReactNode;
}

export const CalendarDayPopover: React.FC<CalendarDayPopoverProps> = ({
  date,
  gigs,
  children,
}) => {
  if (gigs.length === 0) {
    return <>{children}</>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-emerald-500';
      case 'proposed':
        return 'text-amber-500';
      case 'canceled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="w-full text-left outline-none focus:outline-none">
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-lg bg-dark-800 shadow-lg border border-dark-700 p-4"
          sideOffset={5}
        >
          <h4 className="font-medium text-gray-100 mb-2">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </h4>
          <div className="space-y-3">
            {gigs.map((gig) => (
              <div key={gig.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-100">{gig.title}</span>
                  <span className={`text-xs ${getStatusColor(gig.status)}`}>
                    {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                  </span>
                </div>
                <div className="text-gray-400 mt-1">
                  <div>{format(new Date(gig.date), 'h:mm a')}</div>
                  <div>{gig.venue}</div>
                </div>
              </div>
            ))}
          </div>
          <Popover.Arrow className="fill-dark-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};