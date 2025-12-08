import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBarberProfileContext, usePortfolioContext } from '@/contexts/BarberContext';
import { useUIStore } from '@/stores/uiStore';

export function useBarberProfileScreen() {
  const router = useRouter();
  const { userProfile, signOut } = useAuth();
  const { barberProfile, loading } = useBarberProfileContext();
  const { portfolio, loadPortfolio } = usePortfolioContext();
  const { language, setLanguage } = useUIStore();
  const [activePortfolioTab, setActivePortfolioTab] = useState<'men' | 'women'>('men');

  // Load portfolio when barber profile is available
  useEffect(() => {
    if (barberProfile?.id) {
      loadPortfolio(barberProfile.id);
    }
  }, [barberProfile?.id, loadPortfolio]);

  // Redirect to onboarding if no profile found after loading
  useEffect(() => {
    if (!loading && !barberProfile) {
      router.replace('/(barber)/onboarding');
    }
  }, [loading, barberProfile, router]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/auth');
  }, [signOut, router]);

  const handleEditProfile = useCallback(() => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile pressed');
  }, []);

  const handleOperatingHours = useCallback(() => {
    // TODO: Navigate to operating hours screen
    console.log('Operating hours pressed');
  }, []);

  const handleAddPortfolio = useCallback(() => {
    // TODO: Navigate to add portfolio screen
    console.log('Add portfolio pressed');
  }, []);

  const handleDeleteAccount = useCallback(() => {
    // TODO: Implement delete account functionality
    console.log('Delete account pressed');
  }, []);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage as any);
  }, [setLanguage]);

  const handlePortfolioTabChange = useCallback((tab: 'men' | 'women') => {
    setActivePortfolioTab(tab);
  }, []);

  return {
    // State
    userProfile,
    barberProfile,
    portfolio,
    loading,
    activePortfolioTab,
    language,
    
    // Actions
    handleSignOut,
    handleEditProfile,
    handleOperatingHours,
    handleAddPortfolio,
    handleDeleteAccount,
    handleLanguageChange,
    handlePortfolioTabChange,
  };
}

