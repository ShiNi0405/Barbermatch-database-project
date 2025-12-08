import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useBarberProfileScreen } from '@/hooks/useBarberProfileScreen';
import { ProfileHeader } from '@/components/ProfileHeader';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ProfileCard } from '@/components/ProfileCard';
import { InfoSection } from '@/components/InfoSection';
import { BioSection } from '@/components/BioSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ActionsSection } from '@/components/ActionsSection';

export default function BarberProfileScreen() {
  const {
    userProfile,
    barberProfile,
    portfolio,
    loading,
    activePortfolioTab,
    language,
    handleSignOut,
    handleEditProfile,
    handleOperatingHours,
    handleAddPortfolio,
    handleDeleteAccount,
    handleLanguageChange,
    handlePortfolioTabChange,
  } = useBarberProfileScreen();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!barberProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No profile found. Redirecting to onboarding...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileHeader title="Profile & Settings" />

        <LanguageSelector 
          currentLanguage={language} 
          onLanguageChange={handleLanguageChange} 
        />

        <ProfileCard 
          barberProfile={barberProfile} 
          userProfile={userProfile} 
          onEditPress={handleEditProfile} 
        />

        <InfoSection barberProfile={barberProfile} />

        <BioSection bio={barberProfile.bio} />

        <PortfolioSection 
          portfolio={portfolio} 
          activeTab={activePortfolioTab} 
          onTabChange={handlePortfolioTabChange} 
          onAddPortfolio={handleAddPortfolio} 
        />

        <ActionsSection 
          onEditProfile={handleEditProfile} 
          onOperatingHours={handleOperatingHours} 
          onSignOut={handleSignOut} 
          onDeleteAccount={handleDeleteAccount} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});