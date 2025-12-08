/**
 * Combined Barber Context
 * Composes BarberProfile, Portfolio, and Loading contexts
 */

import React from 'react';
import { BarberProfileProvider } from './BarberProfileContext';
import { PortfolioProvider } from './PortfolioContext';
import { BarberLoadingProvider } from './BarberLoadingContext';

interface BarberContextProviderProps {
  children: React.ReactNode;
  userId?: string;
}

/**
 * Combined provider that wraps all barber-related contexts
 */
export function BarberContextProvider({ children, userId }: BarberContextProviderProps) {
  return (
    <BarberLoadingProvider>
      <BarberProfileProvider userId={userId}>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </BarberProfileProvider>
    </BarberLoadingProvider>
  );
}

// Re-export all the hooks for convenience
export { useBarberProfileContext } from './BarberProfileContext';
export { usePortfolioContext } from './PortfolioContext';
export { useBarberLoadingContext } from './BarberLoadingContext';

