/**
 * Barber Profile Context
 * Manages barber profile state and operations
 */

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { barberService, BarberProfileData } from '@/services/barberService';
import { ServiceResult } from '@/types/common';
import { Database } from '@/types/database';

type Barber = Database['public']['Tables']['barbers']['Row'];

interface BarberProfileState {
  barberProfile: Barber | null;
  loading: boolean;
  isLoadingProfile: boolean;
}

interface BarberProfileContextType {
  barberProfile: Barber | null;
  loading: boolean;
  loadProfile: () => Promise<ServiceResult<Barber>>;
  createOrUpdateProfile: (data: BarberProfileData) => Promise<ServiceResult<Barber>>;
}

const BarberProfileContext = createContext<BarberProfileContextType | null>(null);

interface BarberProfileProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function BarberProfileProvider({ children, userId }: BarberProfileProviderProps) {
  const [state, setState] = useState<BarberProfileState>({
    barberProfile: null,
    loading: false,
    isLoadingProfile: false,
  });
  
  const hasLoadedProfile = useRef(false);
  const lastUserId = useRef<string | undefined>(undefined);

  /**
   * Load barber profile
   */
  const loadProfile = useCallback(async (): Promise<ServiceResult<Barber>> => {
    // Validate input
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Prevent multiple simultaneous loads
    if (state.isLoadingProfile) {
      console.log('🏪 Profile already loading, skipping...');
      return { success: false, error: 'Profile already loading' };
    }

    // Start loading
    setLoadingState(true);

    try {
      const result = await barberService.loadProfile(userId);
      handleLoadProfileResult(result);
      return result;
    } catch (error) {
      console.error('🏪 Error loading barber profile:', error);
      setLoadingState(false);
      return { success: false, error: 'Failed to load barber profile' };
    }
  }, [userId, state.isLoadingProfile]);

  /**
   * Set loading state
   */
  const setLoadingState = useCallback((isLoading: boolean) => {
    setState(prev => ({ 
      ...prev, 
      loading: isLoading, 
      isLoadingProfile: isLoading 
    }));
  }, []);

  /**
   * Handle load profile result
   */
  const handleLoadProfileResult = useCallback((result: ServiceResult<Barber>) => {
    if (result.success) {
      console.log('🏪 Barber profile loaded successfully:', result.data ? 'Profile exists' : 'No profile');
      setState(prev => ({
        ...prev,
        barberProfile: result.data || null,
        loading: false,
        isLoadingProfile: false,
      }));
    } else {
      console.log('🏪 Failed to load barber profile:', result.error);
      setState(prev => ({ ...prev, loading: false, isLoadingProfile: false }));
    }
  }, []);

  /**
   * Create or update barber profile
   */
  const createOrUpdateProfile = useCallback(async (data: BarberProfileData): Promise<ServiceResult<Barber>> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const result = await barberService.createOrUpdateProfile(data);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          barberProfile: result.data || null,
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }

      return result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Failed to create or update barber profile' };
    }
  }, []);

  /**
   * Load profile when userId changes
   */
  useEffect(() => {
    // Only load if userId has actually changed and we haven't loaded for this user yet
    if (userId && userId !== lastUserId.current && !hasLoadedProfile.current) {
      console.log('🏪 Context useEffect triggered - loading profile for userId:', userId);
      lastUserId.current = userId;
      hasLoadedProfile.current = true;
      loadProfile();
    }
  }, [userId]); // Only depend on userId, not loadProfile or state.barberProfile

  const value: BarberProfileContextType = {
    barberProfile: state.barberProfile,
    loading: state.loading,
    loadProfile,
    createOrUpdateProfile,
  };

  return (
    <BarberProfileContext.Provider value={value}>
      {children}
    </BarberProfileContext.Provider>
  );
}

export function useBarberProfileContext() {
  const context = useContext(BarberProfileContext);
  if (!context) {
    throw new Error('useBarberProfileContext must be used within a BarberProfileProvider');
  }
  return context;
}