/**
 * Barber Loading Context
 * Manages loading states for barber-related operations
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface BarberLoadingState {
  isLoadingProfile: boolean;
  isLoadingPortfolio: boolean;
  isCreatingProfile: boolean;
  isUpdatingProfile: boolean;
  isAddingPortfolioItem: boolean;
  isDeletingPortfolioItem: boolean;
}

interface BarberLoadingContextType {
  // State
  isLoadingProfile: boolean;
  isLoadingPortfolio: boolean;
  isCreatingProfile: boolean;
  isUpdatingProfile: boolean;
  isAddingPortfolioItem: boolean;
  isDeletingPortfolioItem: boolean;
  
  // Actions
  setLoadingProfile: (loading: boolean) => void;
  setLoadingPortfolio: (loading: boolean) => void;
  setCreatingProfile: (loading: boolean) => void;
  setUpdatingProfile: (loading: boolean) => void;
  setAddingPortfolioItem: (loading: boolean) => void;
  setDeletingPortfolioItem: (loading: boolean) => void;
  
  // Helper methods
  isAnyLoading: () => boolean;
  resetAllLoading: () => void;
}

const BarberLoadingContext = createContext<BarberLoadingContextType | null>(null);

interface BarberLoadingProviderProps {
  children: React.ReactNode;
}

export function BarberLoadingProvider({ children }: BarberLoadingProviderProps) {
  const [state, setState] = useState<BarberLoadingState>({
    isLoadingProfile: false,
    isLoadingPortfolio: false,
    isCreatingProfile: false,
    isUpdatingProfile: false,
    isAddingPortfolioItem: false,
    isDeletingPortfolioItem: false,
  });

  const setLoadingProfile = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoadingProfile: loading }));
  }, []);

  const setLoadingPortfolio = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoadingPortfolio: loading }));
  }, []);

  const setCreatingProfile = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isCreatingProfile: loading }));
  }, []);

  const setUpdatingProfile = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isUpdatingProfile: loading }));
  }, []);

  const setAddingPortfolioItem = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isAddingPortfolioItem: loading }));
  }, []);

  const setDeletingPortfolioItem = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isDeletingPortfolioItem: loading }));
  }, []);

  const isAnyLoading = useCallback(() => {
    return Object.values(state).some(loading => loading);
  }, [state]);

  const resetAllLoading = useCallback(() => {
    setState({
      isLoadingProfile: false,
      isLoadingPortfolio: false,
      isCreatingProfile: false,
      isUpdatingProfile: false,
      isAddingPortfolioItem: false,
      isDeletingPortfolioItem: false,
    });
  }, []);

  const value: BarberLoadingContextType = {
    // State
    isLoadingProfile: state.isLoadingProfile,
    isLoadingPortfolio: state.isLoadingPortfolio,
    isCreatingProfile: state.isCreatingProfile,
    isUpdatingProfile: state.isUpdatingProfile,
    isAddingPortfolioItem: state.isAddingPortfolioItem,
    isDeletingPortfolioItem: state.isDeletingPortfolioItem,
    
    // Actions
    setLoadingProfile,
    setLoadingPortfolio,
    setCreatingProfile,
    setUpdatingProfile,
    setAddingPortfolioItem,
    setDeletingPortfolioItem,
    
    // Helper methods
    isAnyLoading,
    resetAllLoading,
  };

  return (
    <BarberLoadingContext.Provider value={value}>
      {children}
    </BarberLoadingContext.Provider>
  );
}

export function useBarberLoadingContext() {
  const context = useContext(BarberLoadingContext);
  if (!context) {
    throw new Error('useBarberLoadingContext must be used within a BarberLoadingProvider');
  }
  return context;
}

