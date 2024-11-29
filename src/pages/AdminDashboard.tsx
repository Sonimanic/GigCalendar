import React, { useState, useEffect } from 'react';
import { Plus, Download, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useGigStore } from '../store/gigStore';
import { useAuthStore } from '../store/authStore';
import { GigCard } from '../components/GigCard';
import { GigForm } from '../components/GigForm';
import { CsvUploader } from '../components/CsvUploader';
import { MemberManagement } from '../components/MemberManagement';
import { PublicViewSettings } from '../components/PublicViewSettings';
import { Calendar } from '../components/Calendar';
import { Gig, GigStatus } from '../types';
import { exportGigsToCSV } from '../utils/csvExporter';
import { v4 as uuidv4 } from 'uuid';

export const AdminDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGig, setEditingGig] = useState<Gig | null>(null);
  const [isGigsExpanded, setIsGigsExpanded] = useState(false);
  const { gigs, addGig, updateGig, deleteGig, commitments, fetchGigs, fetchCommitments } = useGigStore();
  const { getUsers } = useAuthStore();

  useEffect(() => {
    fetchGigs();
    fetchCommitments();
  }, []);

  const handleSubmit = (data: Gig) => {
    if (editingGig) {
      updateGig({ ...data, id: editingGig.id, status: editingGig.status });
    } else {
      addGig({ ...data, id: uuidv4(), status: 'proposed' });
    }
    setShowForm(false);
    setEditingGig(null);
  };

  const handleGigsUploaded = (uploadedGigs: Omit<Gig, 'id' | 'status'>[]) => {
    uploadedGigs.forEach((gig) => {
      addGig({ ...gig, id: uuidv4(), status: 'proposed' });
    });
  };

  const handleStatusChange = (gigId: string, status: GigStatus) => {
    const gig = gigs.find((g) => g.id === gigId);
    if (gig) {
      updateGig({ ...gig, status });
    }
  };

  const handleExportGigs = () => {
    exportGigsToCSV(gigs);
  };

  const handleDeleteGig = (gigId: string) => {
    deleteGig(gigId);
  };

  const getGigCommitments = (gigId: string) => {
    const gigCommitments = commitments.filter((c) => c.gigId === gigId);
    return gigCommitments.map((commitment) => ({
      ...commitment,
      user: getUsers().find((u) => u.id === commitment.userId)!,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-6">Admin Dashboard</h1>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleExportGigs}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap w-[160px]"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <p className="text-xs text-gray-400">
                  Export all gigs to CSV format
                </p>
              </div>
              <CsvUploader onGigsUploaded={handleGigsUploaded} />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap w-[160px] md:self-start"
            >
              <Plus className="w-4 h-4" />
              Add New Gig
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-800 p-6 rounded-lg shadow-md border border-dark-700 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">
                  {editingGig ? 'Edit Gig' : 'Add New Gig'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingGig(null);
                  }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              <GigForm onSubmit={handleSubmit} initialData={editingGig || undefined} />
            </div>
          )}
        </div>

        <Calendar gigs={gigs} />
        <PublicViewSettings />

        <div className="bg-dark-800 rounded-lg shadow-md p-6 border border-dark-700">
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
            <div className="space-y-4 mt-4">
              {gigs.map((gig) => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  isAdmin
                  onEdit={() => {
                    setEditingGig(gig);
                    setShowForm(true);
                  }}
                  onDelete={() => handleDeleteGig(gig.id)}
                  onStatusChange={(status) => handleStatusChange(gig.id, status)}
                  commitments={getGigCommitments(gig.id)}
                />
              ))}
            </div>
          )}
        </div>

        <MemberManagement />
      </div>
    </div>
  );
};