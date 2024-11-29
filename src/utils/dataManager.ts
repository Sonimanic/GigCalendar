import { Gig, GigCommitment } from '../types';

// Use environment variable for API URL, fallback to local development URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const saveGigs = async (gig: Gig) => {
  try {
    console.log('Making POST request to:', `${API_URL}/gigs`);
    console.log('With gig data:', gig);
    const response = await fetch(`${API_URL}/gigs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gig),
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('Response data:', responseData);
  } catch (error) {
    console.error('Failed to save gigs:', error);
    throw error;
  }
};

export const saveCommitments = async (commitments: GigCommitment[]) => {
  try {
    console.log('Making POST request to:', `${API_URL}/commitments`);
    console.log('With commitments data:', commitments);
    const response = await fetch(`${API_URL}/commitments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commitments),
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('Response data:', responseData);
  } catch (error) {
    console.error('Failed to save commitments:', error);
    throw error;
  }
};

export const loadGigs = async (): Promise<Gig[]> => {
  try {
    console.log('Making GET request to:', `${API_URL}/gigs`);
    const response = await fetch(`${API_URL}/gigs`);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('Response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Failed to load gigs:', error);
    return [];
  }
};

export const loadCommitments = async (): Promise<GigCommitment[]> => {
  try {
    console.log('Making GET request to:', `${API_URL}/commitments`);
    const response = await fetch(`${API_URL}/commitments`);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('Response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Failed to load commitments:', error);
    return [];
  }
};

export const deleteGig = async (id: string): Promise<void> => {
  try {
    console.log('Making DELETE request to:', `${API_URL}/gigs/${id}`);
    const response = await fetch(`${API_URL}/gigs/${id}`, {
      method: 'DELETE',
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete gig:', error);
    throw error;
  }
};

export const updateGig = async (gig: Gig): Promise<void> => {
  try {
    console.log('Making PUT request to:', `${API_URL}/gigs/${gig.id}`);
    console.log('With gig data:', gig);
    const response = await fetch(`${API_URL}/gigs/${gig.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gig),
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('Response data:', responseData);
  } catch (error) {
    console.error('Failed to update gig:', error);
    throw error;
  }
};