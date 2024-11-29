import { create } from 'zustand';
import { Gig, GigCommitment } from '../types';
import { loadGigs, loadCommitments, saveGigs, saveCommitments, deleteGig as apiDeleteGig, updateGig as apiUpdateGig } from '../utils/dataManager';
import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const socket = io(WS_URL);

interface GigState {
  gigs: Gig[];
  commitments: GigCommitment[];
  loading: boolean;
  error: string | null;
  fetchGigs: () => Promise<void>;
  fetchCommitments: () => Promise<void>;
  addGig: (gig: Gig) => Promise<void>;
  updateGig: (gig: Gig) => Promise<void>;
  deleteGig: (id: string) => Promise<void>;
  updateCommitment: (commitment: GigCommitment) => Promise<void>;
  setGigs: (gigs: Gig[]) => void;
}

export const useGigStore = create<GigState>((set, get) => {
  // Set up Socket.IO listeners
  socket.on('dataUpdate', ({ type, data }) => {
    if (type === 'gigs') {
      set({ gigs: data });
    }
  });

  return {
    gigs: [],
    commitments: [],
    loading: false,
    error: null,

    fetchGigs: async () => {
      set({ loading: true });
      try {
        const gigs = await loadGigs();
        set({ gigs, loading: false, error: null });
      } catch (error) {
        console.error('Failed to load gigs:', error);
        set({ error: 'Failed to fetch gigs', loading: false });
      }
    },

    fetchCommitments: async () => {
      try {
        const commitments = await loadCommitments();
        set({ commitments, error: null });
      } catch (error) {
        console.error('Failed to load commitments:', error);
        set({ error: 'Failed to fetch commitments' });
      }
    },

    addGig: async (gig) => {
      try {
        console.log('Adding gig:', gig);
        await saveGigs(gig);
        console.log('Gig saved successfully');
        set((state) => ({ 
          gigs: [...state.gigs, gig],
          error: null 
        }));
      } catch (error) {
        console.error('Failed to add gig:', error);
        set({ error: 'Failed to add gig' });
      }
    },

    updateGig: async (gig) => {
      try {
        await apiUpdateGig(gig);
        set((state) => ({
          gigs: state.gigs.map((g) => (g.id === gig.id ? gig : g)),
          error: null
        }));
      } catch (error) {
        console.error('Failed to update gig:', error);
        set({ error: 'Failed to update gig' });
      }
    },

    deleteGig: async (id) => {
      try {
        await apiDeleteGig(id);
        set((state) => ({
          gigs: state.gigs.filter((g) => g.id !== id),
          commitments: state.commitments.filter((c) => c.gigId !== id),
          error: null
        }));
      } catch (error) {
        console.error('Failed to delete gig:', error);
        set({ error: 'Failed to delete gig' });
      }
    },

    updateCommitment: async (commitment) => {
      try {
        const updatedCommitments = [
          ...get().commitments.filter(
            (c) => c.gigId !== commitment.gigId || c.userId !== commitment.userId
          ),
          commitment,
        ];
        await saveCommitments(updatedCommitments);
        set((state) => ({
          commitments: updatedCommitments,
          error: null
        }));
      } catch (error) {
        console.error('Failed to update commitment:', error);
        set({ error: 'Failed to update commitment' });
      }
    },

    setGigs: (gigs) => set({ gigs }),
  };
});