import { useState, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useAppointments } from './useAppointments';
import { Database } from '@/types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'];

export interface StatusTab {
  key: string;
  label: string;
}

const STATUS_TABS: StatusTab[] = [
  { key: 'all', label: 'All' },
  { key: 'requested', label: 'Requested' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function useAppointmentScreen() {
  const { userProfile } = useAuth();
  const { appointments, loading, error, loadAppointments } = useAppointments(
    userProfile?.id,
    'customer'
  );
  const [activeTab, setActiveTab] = useState('all');

  // Filter appointments based on active tab
  const filteredAppointments = useMemo(() => {
    return (appointments || []).filter(apt => 
      activeTab === 'all' || apt.status === activeTab
    );
  }, [appointments, activeTab]);

  // Handle tab selection
  const handleTabPress = useCallback((tabKey: string) => {
    setActiveTab(tabKey);
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    loadAppointments();
  }, [loadAppointments]);

  return {
    // Data
    appointments: filteredAppointments,
    allAppointments: appointments || [],
    loading,
    error,
    activeTab,
    userProfile,
    
    // Actions
    loadAppointments,
    handleTabPress,
    handleRetry,
    
    // Constants
    statusTabs: STATUS_TABS,
  };
}

