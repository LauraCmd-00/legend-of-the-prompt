import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStoreState {
  language: 'en' | 'fr';
  textOnly: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  isPremium: boolean;
  sessionToken: string | null;

  setLanguage: (lang: 'en' | 'fr') => void;
  setTextOnly: (textOnly: boolean) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setPremium: (isPremium: boolean) => void;
  setSessionToken: (token: string) => void;
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      language: 'en',
      textOnly: false,
      fontSize: 'md',
      isPremium: false,
      sessionToken: null,

      setLanguage: (language) => set({ language }),
      setTextOnly: (textOnly) => set({ textOnly }),
      setFontSize: (fontSize) => set({ fontSize }),
      setPremium: (isPremium) => set({ isPremium }),
      setSessionToken: (sessionToken) => set({ sessionToken }),
    }),
    { name: 'txtrpg-settings' },
  ),
);
