import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBarberProfileContext } from '@/contexts/BarberProfileContext';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentCard } from '@/components/AppointmentCard';
import { AppointmentWithDetails } from '@/models/appointment';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Scissors, 
  Image as ImageIcon,
  Plus 
} from 'lucide-react-native';
import { t } from '@/lib/i18n';

export default function BarberDashboardScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { barberProfile, loading } = useBarberProfileContext();
  const { appointments, loadAppointments, confirmAppointment, cancelAppointment } = useAppointments(userProfile?.id, 'barber');

  useEffect(() => {
    if (userProfile) {
      loadAppointments();
    }
  }, [userProfile?.id]); // Only depend on userProfile.id, not the function

  useEffect(() => {
    // Redirect only after loading completes and no profile exists
    if (!loading && userProfile && barberProfile === null) {
      router.replace('/(barber)/onboarding');
    }
  }, [loading, barberProfile, userProfile]);

  const pendingAppointments = (appointments || []).filter(apt => apt.status === 'requested');
  const todayAppointments = (appointments || []).filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.start_time).toDateString();
    return aptDate === today && apt.status === 'confirmed';
  });

  const handleAppointmentAction = async (id: string, status: string) => {
    if (status === 'confirmed') {
      await confirmAppointment(id);
    } else if (status === 'cancelled') {
      await cancelAppointment(id);
    }
  };

  const renderPendingAppointment = ({ item }: { item: AppointmentWithDetails }) => (
    <AppointmentCard
      appointment={item}
      userRole="barber"
      onAccept={() => handleAppointmentAction(item.id, 'confirmed')}
      onReject={() => handleAppointmentAction(item.id, 'cancelled')}
      style={styles.appointmentCard}
    />
  );

  const renderTodayAppointment = ({ item }: { item: any }) => (
    <AppointmentCard
      appointment={item}
      userRole="barber"
      onComplete={() => handleAppointmentAction(item.id, 'completed')}
      style={styles.appointmentCard}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#6B7280' }}>Loading your barber dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!barberProfile) {
    // No profile and not loading: effect will navigate to onboarding via replace
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <LayoutDashboard size={24} color="#3B82F6" />
          <Text style={styles.title}>{t('dashboard')}</Text>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.salonName}>{barberProfile.salon_name}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#F97316" />
            <Text style={styles.sectionTitle}>{t('pending_requests')}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingAppointments.length}</Text>
            </View>
          </View>

          {pendingAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('no_pending')}</Text>
            </View>
          ) : (
            <FlatList
              data={pendingAppointments.slice(0, 3)}
              renderItem={renderPendingAppointment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>{t('todays_schedule')}</Text>
          </View>

          {todayAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('no_appointments_today')}</Text>
            </View>
          ) : (
            <FlatList
              data={todayAppointments}
              renderItem={renderTodayAppointment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>{t('quick_actions')}</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(barber)/(tabs)/services')}
            >
              <Scissors size={24} color="#3B82F6" />
              <Text style={styles.actionText}>Manage Services</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(barber)/(tabs)/profile')}
            >
              <ImageIcon size={24} color="#3B82F6" />
              <Text style={styles.actionText}>Manage Portfolio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100,
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
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  salonName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  appointmentCard: {
    marginBottom: 12,
  },
  quickActions: {
    marginHorizontal: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
});