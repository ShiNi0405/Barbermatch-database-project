/**
 * Custom hook for service screen logic
 * Encapsulates all business logic for the services screen
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useServiceManagement } from './useServiceManagement';

interface Service {
  id: string;
  name: string;
  description: string;
  price_min: number;
  price_max?: number | null;
  duration: number;
  category_id?: string | null;
}

interface Category {
  id: string | null;
  name: string;
}

export function useServiceScreen(barberId: string | undefined) {
  const {
    services,
    categories,
    loading,
    createService,
    updateService,
    deleteService,
    createCategory,
    deleteCategory,
  } = useServiceManagement(barberId);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Filter services based on selected category
  const filteredServices = (services || []).filter(service => {
    if (activeCategoryId === null) return true; // Show all
    return service.category_id === activeCategoryId;
  });

  const handleDeleteService = useCallback(async (serviceId: string) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteService(serviceId);
            if (!result.success) {
              Alert.alert('Error', result.error || 'Failed to delete service');
            }
          },
        },
      ]
    );
  }, [deleteService]);

  const handleAddCategory = useCallback(async (name: string) => {
    if (!barberId) {
      return { success: false, error: 'Barber profile not found' };
    }

    const result = await createCategory({
      barber_id: barberId,
      name: name.trim(),
    });

    return result;
  }, [barberId, createCategory]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    const result = await deleteCategory(categoryId);
    if (result.success) {
      // Reset active category if it was deleted
      if (activeCategoryId === categoryId) {
        setActiveCategoryId(null);
      }
    }
    return result;
  }, [deleteCategory, activeCategoryId]);

  const handleCreateService = useCallback(async (serviceData: any) => {
    if (!barberId) {
      Alert.alert('Error', 'Barber profile not found');
      return { success: false };
    }

    const result = await createService({
      barber_id: barberId,
      ...serviceData,
    });

    return result;
  }, [barberId, createService]);

  const handleEditService = useCallback((service: Service) => {
    // TODO: Implement edit functionality
    Alert.alert('Edit Service', 'Edit functionality coming soon');
  }, []);

  return {
    // Data
    services: filteredServices,
    categories,
    loading,
    activeCategoryId,
    
    // Actions
    setActiveCategoryId,
    handleDeleteService,
    handleAddCategory,
    handleDeleteCategory,
    handleCreateService,
    handleEditService,
  };
}
