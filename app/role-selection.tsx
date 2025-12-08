import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Scissors, User } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'barber' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user, updateUserRole, loading: authLoading } = useAuth();

  // Show loading if auth is still loading
  if (authLoading || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </View>
    );
  }

  const handleRoleSelection = async () => {
    if (!selectedRole || !user?.id) {
      console.log('❌ Missing selectedRole or user ID:', { selectedRole, userId: user?.id });
      return;
    }

    console.log('🔄 Starting role selection:', { selectedRole, userId: user.id });
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateUserRole({
        userId: user.id,
        role: selectedRole
      });
      
      console.log('✅ Role update result:', result);
      
      if (result.success) {
        console.log('🎉 Role updated successfully, navigating to:', selectedRole);
        if (selectedRole === 'customer') {
          router.replace('/(customer)/(tabs)');
        } else {
          router.replace('/(barber)/(tabs)');
        }
      } else {
        console.error('❌ Error updating role:', result.error);
        setError(result.error || 'Failed to update role. Please try again.');
      }
    } catch (error) {
      console.error('❌ Exception during role update:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>How would you like to use BarberMatch?</Text>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'customer' && styles.roleCardSelected
          ]}
          onPress={() => setSelectedRole('customer')}
        >
          <User size={48} color={selectedRole === 'customer' ? '#3B82F6' : '#6B7280'} />
          <Text style={[
            styles.roleTitle,
            selectedRole === 'customer' && styles.roleTextSelected
          ]}>
            Customer
          </Text>
          <Text style={styles.roleDescription}>
            Find and book appointments with local barbers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'barber' && styles.roleCardSelected
          ]}
          onPress={() => setSelectedRole('barber')}
        >
          <Scissors size={48} color={selectedRole === 'barber' ? '#3B82F6' : '#6B7280'} />
          <Text style={[
            styles.roleTitle,
            selectedRole === 'barber' && styles.roleTextSelected
          ]}>
            Barber
          </Text>
          <Text style={styles.roleDescription}>
            Manage your business and connect with customers
          </Text>
        </TouchableOpacity>

        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled
          ]}
          onPress={handleRoleSelection}
          disabled={!selectedRole || loading}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Setting up...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  roleCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  roleTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  roleTextSelected: {
    color: '#3B82F6',
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
});