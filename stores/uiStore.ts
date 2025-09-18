import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '@/lib/i18n';

interface UIStore {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useUIStore = create<UIStore>((set, get) => ({
  language: 'en',
  setLanguage: async (lang) => {
    set({ language: lang });
    try {
      await AsyncStorage.setItem('app_language', lang);
    } catch {}
  },
  hydrate: async () => {
    try {
      const saved = await AsyncStorage.getItem('app_language');
      if (saved === 'en' || saved === 'zh') set({ language: saved });
    } catch {}
  },
}));


