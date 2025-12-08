import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Phone, Clock } from 'lucide-react-native';

interface BarberProfile {
  address: string;
  phone: string;
  operating_hours?: any;
}

interface InfoSectionProps {
  barberProfile: BarberProfile;
}

export function InfoSection({ barberProfile }: InfoSectionProps) {
  const formatOperatingHours = () => {
    if (!barberProfile.operating_hours) {
      return 'Mon-Fri: 9:00 AM - 6:00 PM';
    }
    
    // Simple fallback for now - could be enhanced to parse operating_hours JSON
    return 'Mon-Fri: 9:00 AM - 6:00 PM';
  };

  return (
    <View style={styles.infoSection}>
      <View style={styles.infoItem}>
        <MapPin size={20} color="#6B7280" />
        <Text style={styles.infoText}>{barberProfile.address}</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Phone size={20} color="#6B7280" />
        <Text style={styles.infoText}>{barberProfile.phone}</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Clock size={20} color="#6B7280" />
        <Text style={styles.infoText}>{formatOperatingHours()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
});

