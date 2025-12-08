import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Calendar, Clock, User, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { AppointmentWithDetails, AppointmentStatus } from '@/models/appointment';

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
  userRole: 'customer' | 'barber';
  onAccept?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
  style?: ViewStyle;
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.REQUESTED]: '#F59E0B',
  [AppointmentStatus.CONFIRMED]: '#10B981',
  [AppointmentStatus.COMPLETED]: '#8B5CF6',
  [AppointmentStatus.CANCELLED]: '#EF4444',
};

const STATUS_BACKGROUNDS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.REQUESTED]: '#FEF3C7',
  [AppointmentStatus.CONFIRMED]: '#D1FAE5',
  [AppointmentStatus.COMPLETED]: '#E9D5FF',
  [AppointmentStatus.CANCELLED]: '#FEE2E2',
};

export function AppointmentCard({ 
  appointment, 
  userRole, 
  onAccept, 
  onReject, 
  onComplete,
  style 
}: AppointmentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getServicesText = () => {
    if (typeof appointment.services === 'string') {
      return appointment.services;
    }
    return 'Haircut & Styling'; // Default text
  };

  const displayName = userRole === 'customer' 
    ? appointment.barber?.salon_name 
    : appointment.customer?.name;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#3B82F6" />
          <Text style={styles.date}>{formatDate(appointment.start_time)}</Text>
        </View>

        <View style={[
          styles.statusBadge,
          { backgroundColor: STATUS_BACKGROUNDS[appointment.status as AppointmentStatus] }
        ]}>
          <Text style={[
            styles.statusText,
            { color: STATUS_COLORS[appointment.status as AppointmentStatus] }
          ]}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <View style={styles.nameContainer}>
            <User size={16} color="#6B7280" />
            <Text style={styles.name}>{displayName}</Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.time}>{formatTime(appointment.start_time)}</Text>
          </View>
        </View>

        <Text style={styles.services}>{getServicesText()}</Text>

        {appointment.notes && (
          <Text style={styles.notes}>Notes: {appointment.notes}</Text>
        )}
      </View>

      {appointment.status === 'requested' && userRole === 'barber' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <XCircle size={16} color="#FFFFFF" />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {appointment.status === 'confirmed' && userRole === 'barber' && (
        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
          <CheckCircle size={16} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>Mark Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    marginBottom: 12,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  services: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});