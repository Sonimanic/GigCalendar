export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'member';
  password?: string; // Only used during login/registration
}

export type GigStatus = 'canceled' | 'confirmed' | 'proposed';

export interface Gig {
  id: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  description: string;
  payment?: number;
  requirements?: string;
  status: GigStatus;
  assignedMembers: string[]; // Array of member IDs who are assigned to this gig
}

export interface GigCommitment {
  gigId: string;
  userId: string;
  status: 'confirmed' | 'declined' | 'pending';
  notes?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PublicViewSettings {
  showVenue: boolean;
  showAddress: boolean;
  showMap: boolean;
  showDate: boolean;
  showTime: boolean;
}