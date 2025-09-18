import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function IndexScreen() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth');
      } else if (!userProfile?.role) {
        router.replace('/role-selection');
      } else if (userProfile.role === 'customer') {
        router.replace('/(customer)/(tabs)');
      } else {
        router.replace('/(barber)/(tabs)');
      }
    }
  }, [user, userProfile, loading, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}