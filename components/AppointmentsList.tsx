import React from 'react';
import { FlatList, StyleSheet, ViewStyle } from 'react-native';
import { AppointmentCard } from './AppointmentCard';
import { EmptyState } from './EmptyState';
import { Calendar } from 'lucide-react-native';
import { Database } from '@/types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'];

interface AppointmentsListProps {
  appointments: Appointment[];
  userRole: 'customer' | 'barber';
  activeTab: string;
  onAppointmentPress?: (appointment: Appointment) => void;
  style?: ViewStyle;
}

export function AppointmentsList({ 
  appointments, 
  userRole, 
  activeTab, 
  onAppointmentPress,
  style 
}: AppointmentsListProps) {
  const renderAppointment = ({ item }: { item: Appointment }) => (
    <AppointmentCard
      appointment={item}
      userRole={userRole}
      style={styles.appointmentCard}
      onPress={onAppointmentPress ? () => onAppointmentPress(item) : undefined}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon={Calendar}
      title="No appointments found"
      message={
        activeTab === 'all' 
          ? "You don't have any appointments yet"
          : `No ${activeTab} appointments found`
      }
    />
  );

  return (
    <FlatList
      data={appointments}
      renderItem={renderAppointment}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.listContainer, style]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  appointmentCard: {
    marginBottom: 16,
  },
});

