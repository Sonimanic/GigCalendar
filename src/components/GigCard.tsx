import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Info, Users, Check, X, ChevronDown, ChevronUp, Phone, ExternalLink, Building, Trash2, MessageCircle, AlertTriangle } from 'lucide-react';
import { Gig, GigCommitment, User, GigStatus } from '../types';
import { formatDate } from '../utils/dateFormatter';
import { getGoogleMapsUrl } from '../utils/mapUtils';
import { useAuthStore } from '../store/authStore';
import { useGigStore } from '../store/gigStore';

interface GigCardProps {
  gig: Gig;
  onCommit?: (status: 'confirmed' | 'declined') => void;
  onUncommit?: () => void;
  isAdmin?: boolean;
  onEdit?: (gig: Gig) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (status: GigStatus) => void;
  commitments?: Array<GigCommitment & { user: User }>;
  userCommitment?: GigCommitment;
  defaultExpanded?: boolean;
  showMapLink?: boolean;
  needsResponse?: boolean;
  isAssigned?: boolean;
}

export const GigCard: React.FC<GigCardProps> = ({ 
  gig, 
  onCommit, 
  onUncommit,
  isAdmin, 
  onEdit,
  onDelete,
  onStatusChange,
  commitments,
  userCommitment,
  defaultExpanded = false,
  showMapLink = true,
  needsResponse = false,
  isAssigned = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { updateGig } = useGigStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const gigStatusColors = {
    confirmed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    proposed: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    canceled: 'bg-red-100 text-red-800 border border-red-200'
  };

  const memberStatusColors = {
    confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
    declined: 'bg-red-100 text-red-800 border border-red-200',
    pending: 'bg-gray-100 text-gray-800 border border-gray-200',
  };

  const getGigStatusLabel = (status: GigStatus) => {
    switch (status) {
      case 'confirmed':
        return 'Show Confirmed';
      case 'canceled':
        return 'Show Canceled';
      case 'proposed':
        return 'Show Pending';
    }
  };

  const getMemberStatusLabel = (status: 'confirmed' | 'declined' | 'pending') => {
    switch (status) {
      case 'confirmed':
        return 'Playing';
      case 'declined':
        return 'Not Playing';
      case 'pending':
        return 'No Response';
    }
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete?.(gig.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className={`bg-dark-800 rounded-lg shadow-lg overflow-hidden border ${
      needsResponse 
        ? 'border-yellow-500 shadow-yellow-500/20' 
        : gig.status === 'canceled'
          ? 'border-red-500/50 shadow-red-500/10'
          : !isAssigned
            ? 'border-gray-700'
            : 'border-dark-700'
    } ${
      gig.status === 'canceled' ? 'opacity-75' : !isAssigned ? 'opacity-50' : ''
    }`}>
      <div className="p-4 md:p-6">
        {needsResponse && (
          <div className="mb-4 flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Response needed</span>
          </div>
        )}
        {gig.status === 'canceled' && (
          <div className="mb-4 flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">This gig has been canceled</span>
          </div>
        )}
        {!isAssigned && (
          <div className="mb-4 flex items-center gap-2 text-gray-500">
            <Info className="w-5 h-5" />
            <span className="text-sm font-medium">You are not assigned to this gig</span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-100">{gig.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${gigStatusColors[gig.status]}`}>
                    {getGigStatusLabel(gig.status)}
                  </span>
                  {userCommitment && (
                    <span className={`hidden md:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${memberStatusColors[userCommitment.status]}`}>
                      {userCommitment.status === 'confirmed' ? "Playing" : "Little Bitch"}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-300 p-1"
                aria-label={isExpanded ? 'Show less' : 'Show more'}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {userCommitment && (
                <div className="md:hidden flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${memberStatusColors[userCommitment.status]}`}>
                    {userCommitment.status === 'confirmed' ? "Playing" : "Little Bitch"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-300">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">{formatDate(gig.date)}</span>
              </div>
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">{gig.venue}</span>
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <select
                value={gig.status}
                onChange={(e) => onStatusChange?.(e.target.value as GigStatus)}
                className="rounded-md border-dark-600 shadow-sm bg-dark-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="proposed">Show Pending</option>
                <option value="confirmed">Show Confirmed</option>
                <option value="canceled">Show Canceled</option>
              </select>
              <button
                onClick={() => onEdit?.(gig)}
                className="text-blue-400 hover:text-blue-300 whitespace-nowrap"
              >
                Edit
              </button>
              {showDeleteConfirm ? (
                <button
                  onClick={handleDeleteClick}
                  className="text-red-500 hover:text-red-400 whitespace-nowrap"
                >
                  Confirm Delete
                </button>
              ) : (
                <button
                  onClick={handleDeleteClick}
                  className="text-red-400 hover:text-red-300"
                  title="Delete gig"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-4 mt-4 pt-4 border-t border-dark-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-gray-300">{gig.address}</span>
                {showMapLink && !isAdmin && isAssigned && (
                  <a
                    href={getGoogleMapsUrl(gig.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 ml-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Map</span>
                  </a>
                )}
              </div>
            </div>

            {gig.payment && (
              <div className="flex items-center text-gray-300">
                <DollarSign className="w-5 h-5 mr-3 text-blue-500" />
                <span>${gig.payment}</span>
              </div>
            )}
            
            <div className="flex items-start text-gray-300">
              <Info className="w-5 h-5 mr-3 text-blue-500 mt-1" />
              <p className="leading-relaxed">{gig.description}</p>
            </div>

            {isAdmin && (
              <>
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-gray-100">Member Assignments</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {useAuthStore.getState().users
                      .filter(user => user.role === 'member')
                      .map((member) => {
                        const commitment = commitments?.find(c => c.userId === member.id);
                        const isAssigned = gig.assignedMembers?.includes(member.id);
                        
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 bg-dark-700 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={async (e) => {
                                  setIsUpdating(true);
                                  try {
                                    const updatedMembers = e.target.checked
                                      ? [...(gig.assignedMembers || []), member.id]
                                      : (gig.assignedMembers || []).filter(id => id !== member.id);
                                    
                                    await updateGig({
                                      ...gig,
                                      assignedMembers: updatedMembers
                                    });
                                  } catch (error) {
                                    console.error('Failed to update member assignment:', error);
                                  }
                                  setIsUpdating(false);
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-gray-500 bg-dark-800 focus:ring-blue-500"
                                disabled={isUpdating}
                              />
                              <span className="text-gray-200">{member.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isAssigned && (
                                <>
                                  {commitment ? (
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      memberStatusColors[commitment.status]
                                    }`}>
                                      {commitment.status === 'confirmed' ? "Playing" : "Little Bitch"}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                                      No Response
                                    </span>
                                  )}
                                </>
                              )}
                              {member.phone && (
                                <a
                                  href={`tel:${member.phone}`}
                                  className="text-blue-400 hover:text-blue-300 p-1"
                                  title="Call member"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-gray-100">Responses</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {useAuthStore.getState().users
                      .filter(user => user.role === 'member' && gig.assignedMembers?.includes(user.id))
                      .map((member) => {
                        const commitment = commitments?.find(c => c.userId === member.id);
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 bg-dark-700 rounded"
                          >
                            <span className="text-gray-200">{member.name}</span>
                            <div className="flex items-center gap-2">
                              {commitment ? (
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  memberStatusColors[commitment.status]
                                }`}>
                                  {commitment.status === 'confirmed' ? "Playing" : "Little Bitch"}
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                                  No Response
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              {userCommitment ? (
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${memberStatusColors[userCommitment.status]}`}>
                    {userCommitment.status === 'confirmed' ? "I'm Playing" : "I'm a little bitch"}
                  </span>
                  {isAssigned && (
                    <div className="flex items-center gap-2">
                      {userCommitment.status === 'confirmed' ? (
                        <button
                          onClick={() => onCommit?.('declined')}
                          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          I'm a little bitch
                        </button>
                      ) : (
                        <button
                          onClick={() => onCommit?.('confirmed')}
                          className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          I Can Play
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                !isAdmin && !gig.canceled && isAssigned && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCommit?.('confirmed')}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
                    >
                      <Check className="w-4 h-4" />
                      I Can Play
                    </button>
                    <button
                      onClick={() => onCommit?.('declined')}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                    >
                      <X className="w-4 h-4" />
                      I'm a little bitch
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};