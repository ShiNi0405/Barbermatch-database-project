import { useCallback, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { ServiceResult } from '@/types/common';
import { ErrorService } from '@/services/errorService';

// Types
interface SignUpData {
  email: string;
  password: string;
  name: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface UpdateUserRoleData {
  userId: string;
  role: 'customer' | 'barber';
}

export function useAuth() {
  const { user, userProfile, loading, initialized, setAuthState } = useAuthStore();
  const hasInitialized = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Initialize auth system
   * Should be called once when the app starts
   */
  const initialize = useCallback(async () => {
    if (hasInitialized.current) {
      console.log('🔐 Auth already initialized, skipping...');
      return;
    }

    console.log('🔐 Initializing auth...');
    hasInitialized.current = true;

    try {
      const result = await authService.initialize();
      console.log('🔐 Auth service result:', result);

      if (result.success && result.data) {
        // User is signed in
        setAuthState({
          user: result.data,
          userProfile: null,
          loading: true,
          initialized: true,
        });
        console.log('🔐 Auth initialized with user');
        
        // Load user profile
        await loadUserProfile(result.data.id);
      } else {
        // No user signed in
        setAuthState({
          user: null,
          userProfile: null,
          loading: false,
          initialized: true,
        });
        console.log('🔐 Auth initialized without user');
      }
    } catch (error) {
      console.error('🔐 Auth initialization error:', error);
      setAuthState({
        user: null,
        userProfile: null,
        loading: false,
        initialized: true,
      });
      console.log('🔐 Auth initialized with error');
    }
  }, []); // setAuthState is stable from Zustand

  /**
   * Set up auth state change listener
   * Should be called once when the app starts
   */
  const setupAuthStateListener = useCallback(() => {
    if (unsubscribeRef.current) {
      console.log('🔐 Auth listener already set up, skipping...');
      return unsubscribeRef.current;
    }

    console.log('🔐 Setting up auth state listener...');
    
    const unsubscribe = authService.setupAuthStateListener(
      // On signed in
      async (user: User) => {
        console.log('🔐 Auth state listener: User signed in', user.id);
        
        // Update user state immediately
        setAuthState({ user, loading: true });
        
        // Load user profile exactly once
        await loadUserProfile(user.id);
      },
      // On signed out
      () => {
        console.log('🔐 Auth state listener: User signed out');
        setAuthState({
          user: null,
          userProfile: null,
          loading: false,
        });
      }
    );

    unsubscribeRef.current = unsubscribe;
    console.log('🔐 Auth state listener set up successfully');
    return unsubscribe;
  }, []); // setAuthState is stable from Zustand

  /**
   * Load user profile
   * Internal function to load profile and update state
   */
  const loadUserProfile = useCallback(async (userId: string) => {
    console.log('🔐 Loading user profile for:', userId);
    
    try {
      const result = await authService.loadUserProfile(userId);
      console.log('🔐 Profile load result:', result);
      
      setAuthState({
        userProfile: result.success ? result.data || null : null,
        loading: false,
      });
      
      console.log('🔐 Profile loaded successfully');
    } catch (error) {
      console.error('🔐 Profile load error:', error);
      setAuthState({
        userProfile: null,
        loading: false,
      });
    }
  }, []); // setAuthState is stable from Zustand

  /**
   * Sign up a new user
   */
  const signUp = useCallback(async (data: SignUpData): Promise<ServiceResult<User>> => {
    console.log('🔐 Signing up user:', data.email);
    
    try {
      const result = await authService.signUp(data);
      console.log('🔐 Sign up result:', result);
      
      // Note: Sign up automatically signs in the user
      // The auth state listener will handle profile loading
      
      return result;
    } catch (error) {
      console.error('🔐 Sign up error:', error);
      return ErrorService.handleError(error, 'signUp');
    }
  }, []);

  /**
   * Sign in an existing user
   */
  const signIn = useCallback(async (data: SignInData): Promise<ServiceResult<User>> => {
    console.log('🔐 Signing in user:', data.email);
    
    try {
      const result = await authService.signIn(data);
      console.log('🔐 Sign in result:', result);
      
      // Note: Profile loading is handled by the auth state listener
      
      return result;
    } catch (error) {
      console.error('🔐 Sign in error:', error);
      return {
        success: false,
        error: 'Sign in failed',
      };
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async (): Promise<ServiceResult> => {
    console.log('🔐 Signing out user...');
    
    try {
      const result = await authService.signOut();
      console.log('🔐 Sign out result:', result);
      
      // Note: Auth state listener will handle state cleanup
      
      return result;
    } catch (error) {
      console.error('🔐 Sign out error:', error);
      return ErrorService.handleError(error, 'signOut');
    }
  }, []);

  /**
   * Update user role
   */
  const updateUserRole = useCallback(async (data: UpdateUserRoleData): Promise<ServiceResult> => {
    console.log('🔐 Updating user role:', data.role);
    
    try {
      const result = await authService.updateUserRole(data.userId, data.role);
      console.log('🔐 Role update result:', result);
      
      if (result.success && result.data) {
        // Update local state with new profile
        setAuthState({ userProfile: result.data });
        console.log('🔐 User role updated successfully');
      }
      
      return result;
    } catch (error) {
      console.error('🔐 Role update error:', error);
      return {
        success: false,
        error: 'Role update failed',
      };
    }
  }, [setAuthState]);

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    if (!hasInitialized.current) {
      initialize();
      setupAuthStateListener();
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        console.log('🔐 Cleaning up auth listener...');
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return {
    // State
    user,
    userProfile,
    loading,
    initialized,
    
    // Functions
    initialize,
    signUp,
    signIn,
    signOut,
    updateUserRole,
    loadUserProfile,
    setupAuthStateListener,
  };
}
