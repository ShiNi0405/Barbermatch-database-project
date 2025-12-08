import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function IndexScreen() {
  const router = useRouter();
  const { user, userProfile, loading, initialized } = useAuth();

  useEffect(() => {
    console.log('🏠 Index screen routing check:', { 
      initialized, 
      loading, 
      hasUser: !!user, 
      hasUserProfile: !!userProfile, 
      userRole: userProfile?.role
    });

    // Wait for initialized && !loading before redirecting
    if (!initialized || loading) {
      console.log('🏠 Auth not ready yet, waiting...');
      return;
    }

    // Redirect to auth if no user or no userProfile
    if (!user || !userProfile) {
      console.log('🏠 No user or profile, redirecting to auth');
      router.replace('/auth');
      return;
    }

    // Both user and userProfile are ready - redirect based on role
    if (userProfile.role === 'customer') {
      console.log('🏠 Customer user, redirecting to customer tabs');
      router.replace('/(customer)/(tabs)');
    } else if (userProfile.role === 'barber') {
      console.log('🏠 Barber user, redirecting to barber tabs');
      router.replace('/(barber)/(tabs)');
    } else {
      console.log('🏠 User profile exists but no role, redirecting to role selection');
      router.replace('/role-selection');
    }
  }, [user, userProfile, loading, initialized, router]);

  // Show SplashScreen or loading indicator while initializing or loading profile
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#fff' 
    }}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={{ 
        marginTop: 16, 
        fontSize: 16, 
        color: '#666',
        fontFamily: 'Inter-Regular'
      }}>
        {!initialized ? 'Initializing...' : 'Loading profile...'}
      </Text>
    </View>
  );
}