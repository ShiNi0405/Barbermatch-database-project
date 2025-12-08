import { useCallback, useEffect, useState } from 'react';
import { barberService, BarberProfileData, PortfolioItemData } from '@/services/barberService';
import { ServiceResult } from '@/types/common';
import { Database } from '@/types/database';

type Barber = Database['public']['Tables']['barbers']['Row'];
type PortfolioItem = Database['public']['Tables']['portfolio']['Row'];

export function useBarberProfile(userId?: string) {
  const [barberProfile, setBarberProfile] = useState<Barber | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load barber profile
   */
  const loadProfile = useCallback(async (): Promise<ServiceResult<Barber>> => {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await barberService.loadProfile(userId);
      
      if (result.success) {
        setBarberProfile(result.data || null);
      } else {
        setError(result.error || 'Failed to load profile');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to load barber profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Create or update barber profile
   */
  const createOrUpdateProfile = useCallback(async (data: BarberProfileData): Promise<ServiceResult<Barber>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await barberService.createOrUpdateProfile(data);
      
      if (result.success) {
        setBarberProfile(result.data || null);
      } else {
        setError(result.error || 'Failed to create/update profile');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to create/update barber profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load portfolio items
   */
  const loadPortfolio = useCallback(async (barberId: string): Promise<ServiceResult<PortfolioItem[]>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await barberService.loadPortfolio(barberId);
      
      if (result.success) {
        setPortfolio(result.data || []);
      } else {
        setError(result.error || 'Failed to load portfolio');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to load portfolio';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add portfolio item
   */
  const addPortfolioItem = useCallback(async (data: PortfolioItemData): Promise<ServiceResult<PortfolioItem>> => {
    try {
      const result = await barberService.addPortfolioItem(data);
      
      if (result.success && result.data) {
        setPortfolio(prev => [result.data!, ...prev]);
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to add portfolio item' };
    }
  }, []);

  /**
   * Delete portfolio item
   */
  const deletePortfolioItem = useCallback(async (itemId: string, barberId: string): Promise<ServiceResult> => {
    try {
      const result = await barberService.deletePortfolioItem(itemId, barberId);
      
      if (result.success) {
        setPortfolio(prev => prev.filter(item => item.id !== itemId));
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to delete portfolio item' };
    }
  }, []);

  // Load profile when userId changes
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId, loadProfile]);

  return {
    barberProfile,
    portfolio,
    loading,
    error,
    loadProfile,
    createOrUpdateProfile,
    loadPortfolio,
    addPortfolioItem,
    deletePortfolioItem,
  };
}

