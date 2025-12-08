import { Stack } from 'expo-router';
import { BarberContextProvider } from '@/contexts/BarberContext';
import { useAuth } from '@/hooks/useAuth';

export default function BarberLayout() {
  const { userProfile } = useAuth();

  return (
    <BarberContextProvider userId={userProfile?.id}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </BarberContextProvider>
  );
}