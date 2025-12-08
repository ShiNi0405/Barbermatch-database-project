import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { useAppointmentScreen } from '@/hooks/useAppointmentScreen';
import { StatusTabs } from '@/components/StatusTabs';
import { AppointmentsList } from '@/components/AppointmentsList';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

export default function CustomerAppointmentsScreen() {
  const {
    appointments,
    loading,
    error,
    activeTab,
    loadAppointments,
    handleTabPress,
    handleRetry,
    statusTabs,
  } = useAppointmentScreen();

  // Load appointments when component mounts
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Calendar size={24} color="#3B82F6" />
      <Text style={styles.title}>Appointments</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <LoadingState message="Loading appointments..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ErrorState
          title="Failed to load appointments"
          message={error}
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <StatusTabs
        tabs={statusTabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      <AppointmentsList
        appointments={appointments}
        userRole="customer"
        activeTab={activeTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
    fontFamily: 'Inter-Bold',
  },
});