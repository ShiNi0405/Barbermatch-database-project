import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { ServiceResult, createSuccessResult, createErrorResult } from '@/types/common';

type Appointment = Database['public']['Tables']['appointments']['Row'];

export type AppointmentData = Database['public']['Tables']['appointments']['Insert'];
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export type AppointmentWithDetails = Appointment & {
  customer?: {
    name: string;
  };
  barber?: {
    salon_name: string;
  };
};

export enum AppointmentStatus {
  REQUESTED = 'requested',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Model layer for appointment-related database operations
 * Handles all Supabase queries and data transformations
 */
export class AppointmentModel {
  /**
   * Create a new appointment
   */
  static async createAppointment(data: AppointmentData): Promise<ServiceResult<Appointment>> {
    try {
      const { data: result, error } = await supabase
        .from('appointments')
        .insert(data as any)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult('Failed to create appointment');
    }
  }

  /**
   * Update appointment status
   */
  static async updateAppointmentStatus(
    id: string, 
    status: AppointmentStatus
  ): Promise<ServiceResult<Appointment>> {
    try {
      const { data: result, error } = await (supabase as any)
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult('Failed to update appointment status');
    }
  }

  /**
   * Update appointment with full data
   */
  static async updateAppointment(
    id: string, 
    updates: AppointmentUpdate
  ): Promise<ServiceResult<Appointment>> {
    try {
      const { data: result, error } = await (supabase as any)
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult('Failed to update appointment');
    }
  }

  /**
   * Delete an appointment
   */
  static async deleteAppointment(id: string): Promise<ServiceResult<void>> {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        return createErrorResult(error.message);
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult('Failed to delete appointment');
    }
  }

  /**
   * Load appointments by user ID and role with details
   */
  static async loadAppointmentsByUser(
    userId: string, 
    role: 'customer' | 'barber'
  ): Promise<{ data: AppointmentWithDetails[]; error?: string }> {
    try {
      if (!userId || !role) {
        return { data: [], error: 'Invalid user ID or role provided' };
      }

      const column = role === 'customer' ? 'customer_id' : 'barber_id';
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customer:users!appointments_customer_id_fkey(name),
          barber:barbers!appointments_barber_id_fkey(salon_name)
        `)
        .eq(column, userId)
        .order('start_time', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to load appointments' };
    }
  }

  /**
   * Load appointments by status and user
   */
  static async loadAppointmentsByStatus(
    userId: string,
    role: 'customer' | 'barber',
    status: AppointmentStatus
  ): Promise<{ data: AppointmentWithDetails[]; error?: string }> {
    try {
      if (!userId || !role || !status) {
        return { data: [], error: 'Invalid parameters provided' };
      }

      const column = role === 'customer' ? 'customer_id' : 'barber_id';
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customer:users!appointments_customer_id_fkey(name),
          barber:barbers!appointments_barber_id_fkey(salon_name)
        `)
        .eq(column, userId)
        .eq('status', status)
        .order('start_time', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to load appointments by status' };
    }
  }

  /**
   * Load a single appointment by ID with details
   */
  static async loadAppointmentById(id: string): Promise<{ data: AppointmentWithDetails | null; error?: string }> {
    try {
      if (!id) {
        return { data: null, error: 'Invalid appointment ID provided' };
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customer:users!appointments_customer_id_fkey(name),
          barber:barbers!appointments_barber_id_fkey(salon_name)
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
      return { data: null, error: 'Failed to load appointment' };
    }
  }

  /**
   * Get appointment count by user and status
   */
  static async getAppointmentCount(
    userId: string,
    role: 'customer' | 'barber',
    status?: AppointmentStatus
  ): Promise<{ count: number; error?: string }> {
    try {
      if (!userId || !role) {
        return { count: 0, error: 'Invalid user ID or role provided' };
      }

      const column = role === 'customer' ? 'customer_id' : 'barber_id';
      let query = supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq(column, userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { count, error } = await query;

      if (error) {
        return { count: 0, error: error.message };
      }

      return { count: count || 0 };
    } catch (error) {
      return { count: 0, error: 'Failed to get appointment count' };
    }
  }

  /**
   * Search appointments by date range
   */
  static async getAppointmentsByDateRange(
    userId: string,
    role: 'customer' | 'barber',
    startDate: string,
    endDate: string
  ): Promise<{ data: AppointmentWithDetails[]; error?: string }> {
    try {
      if (!userId || !role || !startDate || !endDate) {
        return { data: [], error: 'Invalid parameters provided' };
      }

      const column = role === 'customer' ? 'customer_id' : 'barber_id';
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customer:users!appointments_customer_id_fkey(name),
          barber:barbers!appointments_barber_id_fkey(salon_name)
        `)
        .eq(column, userId)
        .gte('start_time', startDate)
        .lte('start_time', endDate)
        .order('start_time', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to load appointments by date range' };
    }
  }

  /**
   * Check for appointment conflicts (overlapping appointments for barber)
   */
  static async checkAppointmentConflicts(
    barberId: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: string
  ): Promise<{ hasConflicts: boolean; conflicts: AppointmentWithDetails[]; error?: string }> {
    try {
      if (!barberId || !startTime || !endTime) {
        return { hasConflicts: false, conflicts: [], error: 'Invalid parameters provided' };
      }

      let query = supabase
        .from('appointments')
        .select(`
          *,
          customer:users!appointments_customer_id_fkey(name),
          barber:barbers!appointments_barber_id_fkey(salon_name)
        `)
        .eq('barber_id', barberId)
        .in('status', [AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED])
        .lt('start_time', endTime)
        .gt('start_time', startTime);

      if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId);
      }

      const { data, error } = await query;

      if (error) {
        return { hasConflicts: false, conflicts: [], error: error.message };
      }

      const conflicts = data || [];
      return { 
        hasConflicts: conflicts.length > 0, 
        conflicts,
        error: undefined 
      };
    } catch (error) {
      return { hasConflicts: false, conflicts: [], error: 'Failed to check appointment conflicts' };
    }
  }
}
