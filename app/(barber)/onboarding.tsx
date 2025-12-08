import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBarberProfileContext } from '@/contexts/BarberProfileContext';
import { MapPin, Clock, User } from 'lucide-react-native';

export default function BarberOnboardingScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { barberProfile, createOrUpdateProfile, loading } = useBarberProfileContext();
  const hasRedirected = useRef(false);

  const [formData, setFormData] = useState({
    salonName: '',
    phone: '',
    address: '',
    bio: '',
    operatingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true },
    },
  });
  const [submitting, setSubmitting] = useState(false);

  // Profile is loaded automatically by the useBarberProfile hook when userProfile changes

  useEffect(() => {
    // Only redirect if we're not currently submitting, profile exists, and haven't redirected yet
    if (!loading && !submitting && barberProfile && !hasRedirected.current) {
      console.log('🏪 Redirecting to barber tabs after profile loaded');
      hasRedirected.current = true;
      router.replace('/(barber)/(tabs)');
    }
  }, [loading, submitting, barberProfile]);

  const handleSubmit = async () => {
    if (!formData.salonName || !formData.phone || !formData.address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    console.log('🏪 Submitting barber profile...');
    setSubmitting(true);

    try {
      const result = await createOrUpdateProfile({
        user_id: userProfile?.id!,
        salon_name: formData.salonName,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        latitude: 37.7749, // Default coordinates - in real app, geocode the address
        longitude: -122.4194,
        operating_hours: formData.operatingHours,
      });

      console.log('🏪 Profile creation result:', result);

      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to create barber profile');
      } else {
        console.log('🏪 Profile created successfully, redirecting...');
        hasRedirected.current = true;
        router.replace('/(barber)/(tabs)');
      }
    } catch (error) {
      console.error('🏪 Error creating profile:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <User size={32} color="#3B82F6" />
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Let's set up your barber profile to start connecting with customers
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Salon Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.salonName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, salonName: text }))}
              placeholder="Enter your salon name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <View style={styles.addressContainer}>
              <MapPin size={20} color="#6B7280" style={styles.addressIcon} />
              <TextInput
                style={styles.addressInput}
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                placeholder="Enter your salon address"
                placeholderTextColor="#9CA3AF"
                multiline
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              placeholder="Tell customers about your services and experience"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Operating Hours</Text>
            <View style={styles.hoursContainer}>
              <Clock size={20} color="#6B7280" style={styles.hoursIcon} />
              <Text style={styles.hoursText}>
                Monday - Friday: 9:00 AM - 6:00 PM{'\n'}
                Saturday: 9:00 AM - 5:00 PM{'\n'}
                Sunday: Closed
              </Text>
            </View>
            <Text style={styles.hoursNote}>
              You can customize your hours later in your profile settings
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (loading || submitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || submitting}
        >
          <Text style={styles.submitButtonText}>
            {loading || submitting ? 'Creating Profile...' : 'Complete Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  hoursIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  hoursText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  hoursNote: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});