import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'];

interface AppointmentStore {
  appointments: Appointment[];
  loading: boolean;
  createAppointment: (appointment: any) => Promise<{ error?: string }>;
  updateAppointmentStatus: (id: string, status: string) => Promise<{ error?: string }>;
  loadAppointments: (userId: string, role: 'customer' | 'barber') => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  loading: false,

  createAppointment: async (appointment) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert(appointment);

      if (error) return { error: error.message };

      return {};
    } catch (error) {
      return { error: 'Failed to create appointment' };
    }
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) return { error: error.message };

      const appointments = get().appointments.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      );
      set({ appointments });
      return {};
    } catch (error) {
      return { error: 'Failed to update appointment' };
    }
  },

  loadAppointments: async (userId: string, role: 'customer' | 'barber') => {
    set({ loading: true });
    try {
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

      if (error) throw error;

      set({ appointments: data || [] });
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      set({ loading: false });
    }
  },
}));