import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, CreditCard as Edit3 } from 'lucide-react-native';

interface BarberProfile {
  salon_name: string;
  rating: number;
}

interface UserProfile {
  name?: string;
}

interface ProfileCardProps {
  barberProfile: BarberProfile;
  userProfile?: UserProfile | null;
  onEditPress?: () => void;
}

export function ProfileCard({ barberProfile, userProfile, onEditPress }: ProfileCardProps) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={32} color="#FFFFFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.salonName}>{barberProfile.salon_name}</Text>
          <Text style={styles.userName}>{userProfile?.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {barberProfile.rating.toFixed(1)}</Text>
            <Text style={styles.ratingText}>Average Rating</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editProfileButton} onPress={onEditPress}>
          <Edit3 size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  editProfileButton: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
  },
});

