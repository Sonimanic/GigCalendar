import React, { useEffect } from 'react';
import { useGigStore } from '../store/gigStore';
import { PublicGigList } from '../components/PublicGigList';

export const PublicView: React.FC = () => {
  const { gigs, fetchGigs } = useGigStore();

  useEffect(() => {
    fetchGigs();
  }, []);

  const confirmedGigs = gigs
    .filter((gig) => gig.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-100">Upcoming Shows</h2>
        </div>
        <div className="bg-dark-800 rounded-lg shadow-md p-6 border border-dark-700">
          <PublicGigList gigs={confirmedGigs} />
        </div>
      </div>
    </div>
  );
};