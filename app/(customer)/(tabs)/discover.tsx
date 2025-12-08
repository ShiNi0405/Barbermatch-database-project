import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { DiscoverHeader } from '@/components/DiscoverHeader';
import { DiscoverList } from '@/components/DiscoverList';
import { FilterBottomSheet } from '@/components/FilterBottomSheet';
import { useDiscover } from '@/hooks/useDiscover';

export default function DiscoverScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    barbers,
    filteredBarbers,
    userLocation,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    loadBarbers,
    openDirections,
  } = useDiscover();

  const handleBarberPress = (barberId: string) => {
    router.push(`/profile/${barberId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DiscoverHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterPress={() => setShowFilters(true)}
      />

      {viewMode === 'list' ? (
        <DiscoverList
          barbers={filteredBarbers}
          onBarberPress={handleBarberPress}
          onDirections={openDirections}
          onRetry={loadBarbers}
          searchQuery={searchQuery}
          loading={loading}
          error={error}
        />
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>Map View Coming Soon</Text>
          <Text style={styles.mapSubtext}>
            {filteredBarbers.length} barber{filteredBarbers.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      <FilterBottomSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={(filters) => {
          console.log('Applied filters:', filters);
          setShowFilters(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholder: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});