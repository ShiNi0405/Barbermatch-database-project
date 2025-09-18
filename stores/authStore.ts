import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'barber';
}

interface AuthStore {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateUserRole: (role: 'customer' | 'barber') => Promise<{ error?: string }>;
  loadUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,

  signUp: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error: error.message };

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name,
            email,
            role: 'customer', // default role
          });

        if (profileError) return { error: profileError.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };

      set({ user: data.user });
      await get().loadUserProfile();
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, userProfile: null });
  },

  updateUserRole: async (role: 'customer' | 'barber') => {
    const { user } = get();
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', user.id);

      if (error) return { error: error.message };

      await get().loadUserProfile();
      return {};
    } catch (error) {
      return { error: 'Failed to update role' };
    }
  },

  loadUserProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      set({ userProfile: data });
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      set({ loading: false });
    }
  },
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  const { loadUserProfile } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.setState({ user: session.user });
    loadUserProfile();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, userProfile: null, loading: false });
  }
});

// Load initial session
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    useAuthStore.setState({ user: session.user });
    useAuthStore.getState().loadUserProfile();
  } else {
    useAuthStore.setState({ loading: false });
  }
});