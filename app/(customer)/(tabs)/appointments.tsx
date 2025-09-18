import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { AppointmentCard } from '@/components/AppointmentCard';
import { Calendar, Clock } from 'lucide-react-native';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'requested', label: 'Requested' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function CustomerAppointmentsScreen() {
  const { userProfile } = useAuthStore();
  const { appointments, loading, loadAppointments } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (userProfile) {
      loadAppointments(userProfile.id, 'customer');
    }
  }, [userProfile]);

  const filteredAppointments = appointments.filter(apt => 
    activeTab === 'all' || apt.status === activeTab
  );

  const renderAppointment = ({ item }: { item: any }) => (
    <AppointmentCard
      appointment={item}
      userRole="customer"
      style={styles.appointmentCard}
    />
  );

  const renderTab = (tab: typeof STATUS_TABS[0]) => (
    <TouchableOpacity
      key={tab.key}
      style={[styles.tab, activeTab === tab.key && styles.activeTab]}
      onPress={() => setActiveTab(tab.key)}
    >
      <Text
        style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Calendar size={24} color="#3B82F6" />
        <Text style={styles.title}>My Appointments</Text>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          data={STATUS_TABS}
          renderItem={({ item }) => renderTab(item)}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Clock size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No appointments found</Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'all' 
              ? 'Book your first appointment to get started'
              : `No ${activeTab} appointments`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.appointmentsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabs: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  appointmentsList: {
    padding: 20,
  },
  appointmentCard: {
    marginBottom: 16,
  },
});