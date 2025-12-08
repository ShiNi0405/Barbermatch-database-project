/**
 * Discover List Component
 * Displays barbers in list view with search and filtering
 */

import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { BarberCard } from './BarberCard';

interface Barber {
  id: string;
  salon_name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  profile_image: string | null;
  user: {
    name: string;
  };
}

interface DiscoverListProps {
  barbers: Barber[];
  onBarberPress: (barberId: string) => void;
  onDirections: (barber: Barber) => void;
  onRetry: () => void;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

export function DiscoverList({
  barbers,
  onBarberPress,
  onDirections,
  onRetry,
  searchQuery,
  loading,
  error,
}: DiscoverListProps) {
  const renderBarberCard = ({ item: barber }: { item: Barber }) => (
    <BarberCard
      barber={barber}
      onPress={() => onBarberPress(barber.id)}
      onDirections={() => onDirections(barber)}
      showDistance
      style={styles.barberCard}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No barbers found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'Try adjusting your search terms' : 'No barbers are available in your area'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingState}>
        <Text style={styles.loadingText}>Loading barbers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={barbers}
      renderItem={renderBarberCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  barberCard: {
    marginBottom: 16,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

