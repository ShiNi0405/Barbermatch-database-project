import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Search, MapPin, Filter, List, Map as MapIcon, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { BarberCard } from '@/components/BarberCard';
import { FilterBottomSheet } from '@/components/FilterBottomSheet';

export default function DiscoverScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    loadBarbers();
  }, []);

  useEffect(() => {
    filterBarbers();
  }, [searchQuery, barbers]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get your location');
    }
  };

  const loadBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select(`
          id,
          salon_name,
          address,
          latitude,
          longitude,
          rating,
          profile_image,
          user:users!barbers_user_id_fkey(name)
        `);

      if (error) throw error;

      setBarbers(data || []);
      setFilteredBarbers(data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    }
  };

  const filterBarbers = () => {
    if (!searchQuery) {
      setFilteredBarbers(barbers);
      return;
    }

    const filtered = barbers.filter((barber: any) =>
      barber.salon_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      barber.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBarbers(filtered);
  };

  const openDirections = (barber: any) => {
    const url = `maps:0,0?q=${barber.latitude},${barber.longitude}`;
    // In a real app, use Linking.openURL(url)
    Alert.alert('Directions', `Opening directions to ${barber.salon_name}`);
  };

  const renderBarberCard = ({ item: barber }: { item: any }) => (
    <BarberCard
      barber={barber}
      onPress={() => router.push(`/profile/${barber.id}`)}
      onDirections={() => openDirections(barber)}
      showDistance
      style={styles.listBarberCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search barbers or location"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color="#3B82F6" />
          </TouchableOpacity>

          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
              onPress={() => setViewMode('map')}
            >
              <MapIcon size={16} color={viewMode === 'map' ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <List size={16} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {viewMode === 'map' ? (
        <View style={styles.mapPlaceholder}>
          <MapIcon size={48} color="#9CA3AF" />
          <Text style={styles.mapPlaceholderText}>Map view coming soon</Text>
          <Text style={styles.mapPlaceholderSubtext}>Switch to list view to browse barbers</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBarbers}
          renderItem={renderBarberCard}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterBottomSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={(filters) => {
          // Apply filters logic here
          setShowFilters(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#3B82F6',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  listBarberCard: {
    marginBottom: 16,
  },
});