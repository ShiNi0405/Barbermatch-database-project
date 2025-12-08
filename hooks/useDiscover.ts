/**
 * Custom hook for discover screen logic
 * Encapsulates all business logic for the discover screen
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { barberService } from '@/services/barberService';

interface Barber {
  id: string;
  salon_name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  profile_image: string | null;
  user: {
    name: string;
  };
}

interface UseDiscoverReturn {
  // State
  barbers: Barber[];
  filteredBarbers: Barber[];
  userLocation: Location.LocationObject['coords'] | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  loadBarbers: () => Promise<void>;
  openDirections: (barber: Barber) => void;
  requestLocationPermission: () => Promise<void>;
}

export function useDiscover(): UseDiscoverReturn {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject['coords'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Unable to get your location');
    }
  }, []);

  const loadBarbers = useCallback(async () => {
    try {
      console.log('🔍 Loading barbers...');
      setLoading(true);
      setError(null);

      const result = await barberService.loadAllBarbers();
      
      if (result.success) {
        console.log('🔍 Barbers loaded:', result.data?.length || 0);
        setBarbers(result.data || []);
        setFilteredBarbers(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to load barbers');
      }
    } catch (error) {
      console.error('Error loading barbers:', error);
      setError('Failed to load barbers');
      Alert.alert('Error', 'Failed to load barbers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterBarbers = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredBarbers(barbers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = (barbers || []).filter((barber) =>
      barber.salon_name.toLowerCase().includes(query) ||
      barber.address.toLowerCase().includes(query) ||
      barber.user.name.toLowerCase().includes(query)
    );
    setFilteredBarbers(filtered);
  }, [searchQuery, barbers]);

  const openDirections = useCallback((barber: Barber) => {
    const url = `maps:0,0?q=${barber.latitude},${barber.longitude}`;
    // In a real app, use Linking.openURL(url)
    Alert.alert('Directions', `Opening directions to ${barber.salon_name}`);
  }, []);

  // Filter barbers when search query or barbers change
  useEffect(() => {
    filterBarbers();
  }, [filterBarbers]);

  // Load barbers and request location on mount
  useEffect(() => {
    requestLocationPermission();
    loadBarbers();
  }, [requestLocationPermission, loadBarbers]);

  return {
    // State
    barbers,
    filteredBarbers,
    userLocation,
    loading,
    error,
    searchQuery,
    
    // Actions
    setSearchQuery,
    loadBarbers,
    openDirections,
    requestLocationPermission,
  };
}
