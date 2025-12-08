import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { ServiceResult, createSuccessResult, createErrorResult } from '@/types/common';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceWithCategory = Service & {
  service_categories: {
    id: string;
    name: string;
    barber_id: string | null;
  };
};

export type ServiceData = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

/**
 * Model layer for service-related database operations
 * Handles all Supabase queries and data transformations
 */
export class ServiceModel {
  /**
   * Add a new service
   */
  static async addService(data: ServiceData): Promise<ServiceResult<Service>> {
    try {
      const { data: result, error } = await supabase
        .from('services')
        .insert(data as any)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult('Failed to add service');
    }
  }

  /**
   * Update an existing service
   */
  static async updateService(id: string, updates: ServiceUpdate): Promise<ServiceResult<Service>> {
    try {
      const { data: result, error } = await (supabase as any)
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult('Failed to update service');
    }
  }

  /**
   * Delete a service
   */
  static async deleteService(id: string): Promise<ServiceResult<void>> {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult('Failed to delete service');
    }
  }

  /**
   * Load services by barber ID with category information
   */
  static async loadServicesByBarberId(barberId: string): Promise<{ data: ServiceWithCategory[]; error?: string }> {
    try {
      if (!barberId) {
        return { data: [], error: 'Invalid barber ID provided' };
      }

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories!inner(
            id,
            name,
            barber_id
          )
        `)
        .eq('barber_id', barberId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to load services' };
    }
  }

  /**
   * Load a single service by ID with category information
   */
  static async loadServiceById(id: string): Promise<{ data: ServiceWithCategory | null; error?: string }> {
    try {
      if (!id) {
        return { data: null, error: 'Invalid service ID provided' };
      }

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories!inner(
            id,
            name,
            barber_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        if ((error as any).code === 'PGRST116') {
          return { data: null };
        }
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      return { data: null, error: 'Failed to load service' };
    }
  }

  /**
   * Get service count for a barber
   */
  static async getServiceCount(barberId: string): Promise<{ count: number; error?: string }> {
    try {
      if (!barberId) {
        return { count: 0, error: 'Invalid barber ID provided' };
      }

      const { count, error } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('barber_id', barberId);

      if (error) {
        return { count: 0, error: error.message };
      }

      return { count: count || 0 };
    } catch (error) {
      return { count: 0, error: 'Failed to get service count' };
    }
  }

  /**
   * Search services by name or description
   */
  static async searchServices(
    barberId: string, 
    searchTerm: string
  ): Promise<{ data: ServiceWithCategory[]; error?: string }> {
    try {
      if (!barberId || !searchTerm) {
        return { data: [], error: 'Invalid search parameters' };
      }

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories!inner(
            id,
            name,
            barber_id
          )
        `)
        .eq('barber_id', barberId)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to search services' };
    }
  }

  /**
   * Get services by category
   */
  static async getServicesByCategory(
    barberId: string, 
    categoryId: string
  ): Promise<{ data: ServiceWithCategory[]; error?: string }> {
    try {
      if (!barberId || !categoryId) {
        return { data: [], error: 'Invalid parameters' };
      }

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories!inner(
            id,
            name,
            barber_id
          )
        `)
        .eq('barber_id', barberId)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to load services by category' };
    }
  }
}
