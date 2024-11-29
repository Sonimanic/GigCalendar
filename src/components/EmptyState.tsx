import React from 'react';
import { Calendar } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center text-gray-400 mt-8 py-12">
      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p className="text-xl font-medium mb-2">No Upcoming Shows</p>
      <p className="text-sm">Check back soon for new performance dates!</p>
    </div>
  );
};