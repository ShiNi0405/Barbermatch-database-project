import { useCallback, useEffect, useState } from 'react';
import { appointmentService, CreateAppointmentData, UpdateAppointmentData, AppointmentStatus } from '@/services/appointmentService';
import { ServiceResult } from '@/types/common';
import { Database } from '@/types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'];

export function useAppointments(userId?: string, userRole?: 'customer' | 'barber') {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load appointments for the user
   */
  const loadAppointments = useCallback(async (): Promise<ServiceResult<Appointment[]>> => {
    if (!userId || !userRole) {
      return { success: false, error: 'User ID and role are required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await appointmentService.loadAppointments(userId, userRole);
      
      if (result.success) {
        setAppointments(result.data || []);
      } else {
        setError(result.error || 'Failed to load appointments');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to load appointments';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId, userRole]);

  /**
   * Create a new appointment
   */
  const createAppointment = useCallback(async (data: CreateAppointmentData): Promise<ServiceResult<Appointment>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await appointmentService.createAppointment(data);
      
      if (result.success && result.data) {
        setAppointments(prev => [result.data!, ...prev]);
      } else {
        setError(result.error || 'Failed to create appointment');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to create appointment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an appointment
   */
  const updateAppointment = useCallback(async (
    appointmentId: string, 
    data: UpdateAppointmentData
  ): Promise<ServiceResult<Appointment>> => {
    if (!userId || !userRole) {
      return { success: false, error: 'User ID and role are required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await appointmentService.updateAppointment(appointmentId, data, userId, userRole);
      
      if (result.success && result.data) {
        setAppointments(prev => 
          prev.map(appointment => 
            appointment.id === appointmentId ? result.data! : appointment
          )
        );
      } else {
        setError(result.error || 'Failed to update appointment');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to update appointment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId, userRole]);

  /**
   * Delete an appointment
   */
  const deleteAppointment = useCallback(async (appointmentId: string): Promise<ServiceResult> => {
    if (!userId || !userRole) {
      return { success: false, error: 'User ID and role are required' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await appointmentService.deleteAppointment(appointmentId, userId, userRole);
      
      if (result.success) {
        setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
      } else {
        setError(result.error || 'Failed to delete appointment');
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to delete appointment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId, userRole]);

  /**
   * Confirm an appointment (barber only)
   */
  const confirmAppointment = useCallback(async (appointmentId: string): Promise<ServiceResult<Appointment>> => {
    return updateAppointment(appointmentId, { status: AppointmentStatus.CONFIRMED });
  }, [updateAppointment]);

  /**
   * Cancel an appointment
   */
  const cancelAppointment = useCallback(async (appointmentId: string): Promise<ServiceResult<Appointment>> => {
    return updateAppointment(appointmentId, { status: AppointmentStatus.CANCELLED });
  }, [updateAppointment]);

  /**
   * Complete an appointment (customer only)
   */
  const completeAppointment = useCallback(async (appointmentId: string): Promise<ServiceResult<Appointment>> => {
    return updateAppointment(appointmentId, { status: AppointmentStatus.COMPLETED });
  }, [updateAppointment]);

  // Load appointments when userId or userRole changes
  useEffect(() => {
    if (userId && userRole) {
      loadAppointments();
    }
  }, [userId, userRole, loadAppointments]);

  return {
    appointments,
    loading,
    error,
    loadAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
  };
}

