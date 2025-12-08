/**
 * Custom hook for appointment filtering and management
 * Encapsulates appointment filtering logic and status management
 */

import { useState, useMemo, useCallback } from 'react';
import { Database } from '@/types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'];

interface StatusTab {
  key: string;
  label: string;
}

interface UseAppointmentFiltersProps {
  appointments: Appointment[];
  userRole: 'customer' | 'barber';
}

interface UseAppointmentFiltersReturn {
  // State
  activeTab: string;
  filteredAppointments: Appointment[];
  
  // Actions
  setActiveTab: (tab: string) => void;
  
  // Computed values
  statusTabs: StatusTab[];
  appointmentCounts: Record<string, number>;
  hasAppointments: boolean;
}

const CUSTOMER_STATUS_TABS: StatusTab[] = [
  { key: 'all', label: 'All' },
  { key: 'requested', label: 'Requested' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const BARBER_STATUS_TABS: StatusTab[] = [
  { key: 'all', label: 'All' },
  { key: 'requested', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function useAppointmentFilters({
  appointments,
  userRole,
}: UseAppointmentFiltersProps): UseAppointmentFiltersReturn {
  const [activeTab, setActiveTab] = useState('all');

  const statusTabs = userRole === 'customer' ? CUSTOMER_STATUS_TABS : BARBER_STATUS_TABS;

  const appointmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Count all appointments
    counts.all = appointments.length;
    
    // Count by status
    statusTabs.forEach(tab => {
      if (tab.key !== 'all') {
        counts[tab.key] = appointments.filter(apt => apt.status === tab.key).length;
      }
    });
    
    return counts;
  }, [appointments, statusTabs]);

  const filteredAppointments = useMemo(() => {
    if (activeTab === 'all') {
      return appointments;
    }
    
    return appointments.filter(apt => apt.status === activeTab);
  }, [appointments, activeTab]);

  const hasAppointments = appointments.length > 0;

  return {
    // State
    activeTab,
    filteredAppointments,
    
    // Actions
    setActiveTab,
    
    // Computed values
    statusTabs,
    appointmentCounts,
    hasAppointments,
  };
}

