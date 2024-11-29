import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PublicViewSettings } from '../types';

interface SettingsState {
  publicViewSettings: PublicViewSettings;
  updatePublicViewSettings: (settings: Partial<PublicViewSettings>) => void;
}

const DEFAULT_SETTINGS: PublicViewSettings = {
  showVenue: true,
  showAddress: true,
  showMap: true,
  showDate: true,
  showTime: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      publicViewSettings: DEFAULT_SETTINGS,
      updatePublicViewSettings: (settings) =>
        set((state) => ({
          publicViewSettings: {
            ...state.publicViewSettings,
            ...settings,
          },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
);