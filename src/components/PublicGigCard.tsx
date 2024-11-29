import React from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Gig } from '../types';
import { formatDate } from '../utils/dateFormatter';
import { getGoogleMapsUrl } from '../utils/mapUtils';
import { useSettingsStore } from '../store/settingsStore';

interface PublicGigCardProps {
  gig: Gig;
}

export const PublicGigCard: React.FC<PublicGigCardProps> = ({ gig }) => {
  const { publicViewSettings } = useSettingsStore();

  const formatDateTime = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      ...(publicViewSettings.showDate && {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      ...(publicViewSettings.showTime && {
        hour: 'numeric',
        minute: 'numeric',
      }),
    };

    if (!publicViewSettings.showDate && !publicViewSettings.showTime) {
      return null;
    }

    return new Date(date).toLocaleDateString('en-US', options);
  };

  const dateTime = formatDateTime(gig.date);

  return (
    <div className="bg-dark-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-dark-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">{gig.title}</h3>
      
      <div className="space-y-3">
        {dateTime && (
          <div className="flex items-center text-gray-300">
            <Calendar className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
            <span>{dateTime}</span>
          </div>
        )}
        
        {(publicViewSettings.showVenue || publicViewSettings.showAddress) && (
          <div className="flex items-start text-gray-300">
            <MapPin className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-1" />
            <div className="flex flex-col">
              {publicViewSettings.showVenue && <span>{gig.venue}</span>}
              {publicViewSettings.showAddress && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{gig.address}</span>
                  {publicViewSettings.showMap && (
                    <a
                      href={getGoogleMapsUrl(gig.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Map</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};