import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { ServiceResult, createSuccessResult, createErrorResult } from '@/types/common';

type Barber = Database['public']['Tables']['barbers']['Row'];
type Portfolio = Database['public']['Tables']['portfolio']['Row'];

export type BarberProfileData = Database['public']['Tables']['barbers']['Insert'];
export type PortfolioItemData = Database['public']['Tables']['portfolio']['Insert'];

/**
 * Model layer for barber-related database operations
 * Handles all Supabase queries and data transformations
 */
export class BarberModel {
  /**
   * Create or update barber profile (upsert operation)
   */
  static async createOrUpdateProfile(data: BarberProfileData): Promise<{ data: Barber | null; error?: string }> {
    try {
      const { data: upserted, error } = await supabase
        .from('barbers')
        .upsert(data as any, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: upserted as Barber };
    } catch (error) {
      return { data: null, error: 'Failed to create barber profile' };
    }
  }

  /**
   * Load barber profile by user ID
   */
  static async loadProfileByUserId(userId: string): Promise<{ data: Barber | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // PGRST116 = No rows returned
        if ((error as any).code === 'PGRST116') {
          return { data: null };
        }
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      return { data: null, error: 'Failed to load barber profile' };
    }
  }

  /**
   * Add portfolio item
   */
  static async addPortfolioItem(item: PortfolioItemData): Promise<ServiceResult<Portfolio>> {
    try {
      const { data: result, error } = await supabase
        .from('portfolio')
        .insert(item as any)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult('Failed to add portfolio item');
    }
  }

  /**
   * Load portfolio items by barber ID
   */
  static async loadPortfolioByBarberId(barberId: string): Promise<{ data: Portfolio[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('barber_id', barberId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to load portfolio' };
    }
  }

  /**
   * Delete portfolio item by ID
   */
  static async deletePortfolioItem(itemId: string): Promise<ServiceResult<void>> {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', itemId);

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult('Failed to delete portfolio item');
    }
  }

  /**
   * Get portfolio count for a barber
   */
  static async getPortfolioCount(barberId: string): Promise<{ count: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('portfolio')
        .select('*', { count: 'exact', head: true })
        .eq('barber_id', barberId);

      if (error) {
        return { count: 0, error: error.message };
      }

      return { count: count || 0 };
    } catch (error) {
      return { count: 0, error: 'Failed to get portfolio count' };
    }
  }
}
