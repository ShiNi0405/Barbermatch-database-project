/**
 * Portfolio Context
 * Manages barber portfolio state and operations
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { barberService, PortfolioItemData } from '@/services/barberService';
import { ServiceResult } from '@/types/common';
import { Database } from '@/types/database';

type PortfolioItem = Database['public']['Tables']['portfolio']['Row'];

interface PortfolioState {
  portfolio: PortfolioItem[];
  loading: boolean;
}

interface PortfolioContextType {
  portfolio: PortfolioItem[];
  loading: boolean;
  loadPortfolio: (barberId: string) => Promise<ServiceResult<PortfolioItem[]>>;
  addPortfolioItem: (data: PortfolioItemData) => Promise<ServiceResult<PortfolioItem>>;
  deletePortfolioItem: (itemId: string, barberId: string) => Promise<ServiceResult>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

interface PortfolioProviderProps {
  children: React.ReactNode;
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [state, setState] = useState<PortfolioState>({
    portfolio: [],
    loading: false,
  });

  /**
   * Load portfolio items
   */
  const loadPortfolio = useCallback(async (barberId: string): Promise<ServiceResult<PortfolioItem[]>> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const result = await barberService.loadPortfolio(barberId);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          portfolio: result.data || [],
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }

      return result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Failed to load portfolio' };
    }
  }, []);

  /**
   * Add portfolio item
   */
  const addPortfolioItem = useCallback(async (data: PortfolioItemData): Promise<ServiceResult<PortfolioItem>> => {
    try {
      const result = await barberService.addPortfolioItem(data);
      
      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          portfolio: [result.data!, ...prev.portfolio],
        }));
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
        setState(prev => ({
          ...prev,
          portfolio: prev.portfolio.filter(item => item.id !== itemId),
        }));
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to delete portfolio item' };
    }
  }, []);

  const value: PortfolioContextType = {
    portfolio: state.portfolio,
    loading: state.loading,
    loadPortfolio,
    addPortfolioItem,
    deletePortfolioItem,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  return context;
}

