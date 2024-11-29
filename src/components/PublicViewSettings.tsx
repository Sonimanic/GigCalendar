import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export const PublicViewSettings: React.FC = () => {
  const { publicViewSettings, updatePublicViewSettings } = useSettingsStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSetting = (key: keyof typeof publicViewSettings) => {
    updatePublicViewSettings({ [key]: !publicViewSettings[key] });
  };

  return (
    <div className="bg-dark-800 rounded-lg shadow-md p-6 mb-6 border border-dark-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-100">Public Calendar Settings</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-300 p-2"
          aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={publicViewSettings.showVenue}
              onChange={() => toggleSetting('showVenue')}
              className="rounded border-dark-600 bg-dark-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Show Venue</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={publicViewSettings.showAddress}
              onChange={() => toggleSetting('showAddress')}
              className="rounded border-dark-600 bg-dark-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Show Address</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={publicViewSettings.showMap}
              onChange={() => toggleSetting('showMap')}
              className="rounded border-dark-600 bg-dark-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Show Map Link</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={publicViewSettings.showDate}
              onChange={() => toggleSetting('showDate')}
              className="rounded border-dark-600 bg-dark-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Show Date</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={publicViewSettings.showTime}
              onChange={() => toggleSetting('showTime')}
              className="rounded border-dark-600 bg-dark-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Show Time</span>
          </label>
        </div>
      )}
    </div>
  );
};