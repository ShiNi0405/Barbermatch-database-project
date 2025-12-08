/**
 * Service List Component
 * Displays a list of services with filtering and empty states
 */

import React from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Scissors } from 'lucide-react-native';
import { ServiceCard } from './ServiceCard';

interface Service {
  id: string;
  name: string;
  description: string;
  price_min: number;
  price_max?: number | null;
  duration: number;
  category?: {
    name: string;
  } | null;
}

interface ServiceListProps {
  services: Service[];
  onEditService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onAddService: () => void;
  loading?: boolean;
}

export function ServiceList({
  services,
  onEditService,
  onDeleteService,
  onAddService,
  loading = false,
}: ServiceListProps) {
  const renderService = ({ item }: { item: Service }) => (
    <ServiceCard
      service={item}
      onEdit={() => onEditService(item)}
      onDelete={() => onDeleteService(item.id)}
      style={styles.serviceCard}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Scissors size={48} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No services found</Text>
      <Text style={styles.emptyText}>
        You haven't added any services yet
      </Text>
      <TouchableOpacity
        style={styles.addFirstServiceButton}
        onPress={onAddService}
      >
        <Text style={styles.addFirstServiceButtonText}>Add Your First Service</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={services}
      renderItem={renderService}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.servicesList}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
    />
  );
}

const styles = StyleSheet.create({
  servicesList: {
    padding: 20,
    flexGrow: 1,
  },
  serviceCard: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addFirstServiceButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstServiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

