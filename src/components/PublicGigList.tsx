import React from 'react';
import { Gig } from '../types';
import { PublicGigCard } from './PublicGigCard';
import { EmptyState } from './EmptyState';

interface PublicGigListProps {
  gigs: Gig[];
}

export const PublicGigList: React.FC<PublicGigListProps> = ({ gigs }) => {
  if (gigs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {gigs.map((gig) => (
        <PublicGigCard key={gig.id} gig={gig} />
      ))}
    </div>
  );
};