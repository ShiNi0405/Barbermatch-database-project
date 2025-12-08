import { useCallback, useEffect, useState } from 'react';
import { 
  serviceManagementService, 
  CreateServiceData, 
  UpdateServiceData, 
  CreateCategoryData,
  ServiceWithCategory 
} from '@/services/serviceManagementService';
import { ServiceResult } from '@/types/common';
import { Database } from '@/types/database';

type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

export function useServiceManagement(barberId?: string) {
  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load services for the barber
   */
  const loadServices = useCallback(async (): Promise<ServiceResult<ServiceWithCategory[]>> => {
    if (!barberId) {
      return { success: false, error: 'Barber ID is required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await serviceManagementService.loadServices(barberId);
      
      if (result.success) {
        setServices(result.data || []);
      } else {
        setError(result.error || 'Failed to load services');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to load services';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  /**
   * Load categories for the barber
   */
  const loadCategories = useCallback(async (): Promise<ServiceResult<ServiceCategory[]>> => {
    if (!barberId) {
      return { success: false, error: 'Barber ID is required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await serviceManagementService.loadCategories(barberId);
      
      if (result.success) {
        setCategories(result.data || []);
      } else {
        setError(result.error || 'Failed to load categories');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to load categories';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  /**
   * Create a new service
   */
  const createService = useCallback(async (data: CreateServiceData): Promise<ServiceResult<ServiceWithCategory>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await serviceManagementService.createService(data);
      
      if (result.success && result.data) {
        setServices(prev => [result.data!, ...prev]);
      } else {
        setError(result.error || 'Failed to create service');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to create service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a service
   */
  const updateService = useCallback(async (
    serviceId: string, 
    data: UpdateServiceData
  ): Promise<ServiceResult<ServiceWithCategory>> => {
    if (!barberId) {
      return { success: false, error: 'Barber ID is required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await serviceManagementService.updateService(serviceId, data, barberId);
      
      if (result.success && result.data) {
        setServices(prev => 
          prev.map(service => 
            service.id === serviceId ? result.data! : service
          )
        );
      } else {
        setError(result.error || 'Failed to update service');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to update service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  /**
   * Delete a service
   */
  const deleteService = useCallback(async (serviceId: string): Promise<ServiceResult> => {
    if (!barberId) {
      return { success: false, error: 'Barber ID is required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await serviceManagementService.deleteService(serviceId, barberId);
      
      if (result.success) {
        setServices(prev => prev.filter(service => service.id !== serviceId));
      } else {
        setError(result.error || 'Failed to delete service');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to delete service';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  /**
   * Create a new category
   */
  const createCategory = useCallback(async (data: CreateCategoryData): Promise<ServiceResult<ServiceCategory>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await serviceManagementService.createCategory(data);
      
      if (result.success && result.data) {
        setCategories(prev => [...prev, result.data!]);
      } else {
        setError(result.error || 'Failed to create category');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to create category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a category
   */
  const deleteCategory = useCallback(async (categoryId: string): Promise<ServiceResult> => {
    if (!barberId) {
      return { success: false, error: 'Barber ID is required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await serviceManagementService.deleteCategory(categoryId, barberId);
      
      if (result.success) {
        setCategories(prev => prev.filter(category => category.id !== categoryId));
        // Remove category from services
        setServices(prev => 
          prev.map(service => 
            service.category_id === categoryId 
              ? { ...service, category_id: null, category: null }
              : service
          )
        );
      } else {
        setError(result.error || 'Failed to delete category');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to delete category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  // Load services and categories when barberId changes
  useEffect(() => {
    if (barberId) {
      loadServices();
      loadCategories();
    }
  }, [barberId, loadServices, loadCategories]);

  return {
    services,
    categories,
    loading,
    error,
    loadServices,
    loadCategories,
    createService,
    updateService,
    deleteService,
    createCategory,
    deleteCategory,
  };
}

