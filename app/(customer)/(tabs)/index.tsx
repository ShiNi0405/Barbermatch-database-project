import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Sparkles, Heart } from 'lucide-react-native';
import { BarberCard } from '@/components/BarberCard';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const [favouriteBarbers, setFavouriteBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavouriteBarbers();
  }, []);

  const loadFavouriteBarbers = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('favourites')
        .select(`
          barber:barbers(
            id,
            salon_name,
            address,
            rating,
            profile_image
          )
        `)
        .eq('customer_id', userProfile.id);

      if (error) throw error;

      setFavouriteBarbers(data?.map(item => item.barber) || []);
    } catch (error) {
      console.error('Error loading favourite barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userProfile?.name}</Text>
          <Text style={styles.subGreeting}>Ready for your next great look?</Text>
        </View>

        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => router.push('/ai/tryout')}
        >
          <Sparkles size={24} color="#FFFFFF" />
          <Text style={styles.aiButtonText}>Create your look with AI hairstyle</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Your Favourite Barbers</Text>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : favouriteBarbers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No favourite barbers yet</Text>
              <Text style={styles.emptySubtext}>
                Discover barbers and save your favourites
              </Text>
              <TouchableOpacity
                style={styles.discoverButton}
                onPress={() => router.push('/(customer)/(tabs)/discover')}
              >
                <Text style={styles.discoverButtonText}>Explore Barbers</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.barbersScroll}
            >
              {favouriteBarbers.map((barber: any) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  onPress={() => router.push(`/profile/${barber.id}`)}
                  style={styles.barberCard}
                />
              ))}
            </ScrollView>
          )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  aiButton: {
    backgroundColor: '#3B82F6',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  discoverButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  barbersScroll: {
    paddingRight: 20,
  },
  barberCard: {
    width: 200,
    marginRight: 16,
  },
});