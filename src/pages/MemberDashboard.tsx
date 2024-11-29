import React, { useState, useEffect, useMemo } from 'react';
import { useGigStore } from '../store/gigStore';
import { useAuthStore } from '../store/authStore';
import { GigCard } from '../components/GigCard';
import { GigCommitment } from '../types';
import { HelpCircle, Calendar as CalendarIcon, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { HelpModal } from '../components/HelpModal';
import { Calendar } from '../components/Calendar'; // Import the Calendar component

export const MemberDashboard: React.FC = () => {
  const { gigs, commitments, updateCommitment, fetchGigs, fetchCommitments } = useGigStore();
  const { user } = useAuthStore();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'confirmed' | 'declined' | null>(null);
  const [note, setNote] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [isGigsExpanded, setIsGigsExpanded] = useState(false);

  // Get uncommitted gigs
  const uncommittedGigs = useMemo(() => {
    return gigs.filter(gig => {
      const commitment = commitments.find(c => c.gigId === gig.id);
      return !commitment && gig.status !== 'canceled';
    });
  }, [gigs, commitments]);

  // Sort gigs by date and status
  const sortedGigs = useMemo(() => {
    return [...gigs].sort((a, b) => {
      // First sort by date
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If dates are equal, put canceled gigs last
      if (a.status === 'canceled' && b.status !== 'canceled') return 1;
      if (a.status !== 'canceled' && b.status === 'canceled') return -1;
      
      return 0;
    });
  }, [gigs]);

  useEffect(() => {
    fetchGigs();
    fetchCommitments();
  }, []);

  const handleCommitment = (gigId: string, status: 'confirmed' | 'declined') => {
    if (!user) return;
    setSelectedGig(gigId);
    setSelectedStatus(status);
    setShowNoteModal(true);
  };

  const handleUncommit = (gigId: string) => {
    if (!user) return;
    setSelectedGig(gigId);
    setSelectedStatus(null);
    setNote('');
    setShowNoteModal(true);
  };

  const submitCommitment = () => {
    if (!user || !selectedGig || !selectedStatus) return;
    
    updateCommitment({
      gigId: selectedGig,
      userId: user.id,
      status: selectedStatus,
      notes: note.trim(),
    });
    
    setShowNoteModal(false);
    setSelectedGig(null);
    setSelectedStatus(null);
    setNote('');
  };

  const getUserCommitment = (gigId: string): GigCommitment | undefined => {
    return commitments.find(
      (c) => c.gigId === gigId && c.userId === user?.id
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-4 py-8">
      {sortedGigs.filter(gig => gig.status === 'canceled').length > 0 && (
        <div className="mb-8 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-yellow-500 mb-2">Canceled Gigs</h2>
              <p className="text-yellow-100 mb-3">
                You have {sortedGigs.filter(gig => gig.status === 'canceled').length} gig{sortedGigs.filter(gig => gig.status === 'canceled').length > 1 ? 's' : ''} that have been canceled:
              </p>
              <ul className="list-disc list-inside space-y-1 text-yellow-200">
                {sortedGigs.filter(gig => gig.status === 'canceled').map(gig => (
                  <li key={gig.id}>
                    {gig.title} - {new Date(gig.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {uncommittedGigs.length > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>You have {uncommittedGigs.length} gig{uncommittedGigs.length > 1 ? 's' : ''} that need{uncommittedGigs.length === 1 ? 's' : ''} your response</span>
          </div>
          <button 
            onClick={() => setIsGigsExpanded(true)} 
            className="text-sm underline hover:text-yellow-100 transition-colors"
          >
            View Gigs
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">My Calendar</h1>
        <button
          onClick={() => setShowHelp(true)}
          className="text-gray-400 hover:text-gray-300"
          aria-label="Show help"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      <Calendar gigs={gigs} />

      <div className="bg-dark-800 rounded-lg shadow-md p-6 mt-6 border border-dark-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-100">Gigs ({gigs.length})</h2>
          </div>
          <button
            onClick={() => setIsGigsExpanded(!isGigsExpanded)}
            className="text-gray-400 hover:text-gray-300 p-2"
            aria-label={isGigsExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isGigsExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {isGigsExpanded && (
          <div className="space-y-6 mt-4">
            {sortedGigs.map(gig => {
              const commitment = commitments.find(c => c.gigId === gig.id && c.userId === user?.id);
              const isAssigned = user?.role === 'admin' || gig.assignedMembers?.includes(user?.id || '');
              const needsResponse = isAssigned && !commitment && gig.status !== 'canceled';
              
              return (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onCommit={(status) => handleCommitment(gig.id, status)}
                  userCommitment={commitment}
                  needsResponse={needsResponse}
                  isAssigned={isAssigned}
                />
              );
            })}
          </div>
        )}
      </div>

      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Add Note (Optional)
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-32 bg-dark-700 text-gray-100 rounded-md p-2 mb-4"
              placeholder="Add any notes about your availability..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setSelectedGig(null);
                  setSelectedStatus(null);
                  setNote('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitCommitment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
};