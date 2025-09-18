import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MapPin, Star, Heart, Navigation } from 'lucide-react-native';

interface BarberCardProps {
  barber: any;
  onPress: () => void;
  onDirections?: () => void;
  showDistance?: boolean;
  style?: ViewStyle;
}

export function BarberCard({ 
  barber, 
  onPress, 
  onDirections, 
  showDistance = false,
  style 
}: BarberCardProps) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image
        source={{ 
          uri: barber.profile_image || 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg' 
        }}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {barber.user?.name || barber.salon_name}
          </Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Heart size={16} color="#E5E7EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.ratingContainer}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.rating}>{barber.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>(24 reviews)</Text>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.address} numberOfLines={1}>
            {barber.address}
          </Text>
        </View>

        {showDistance && (
          <Text style={styles.distance}>0.5 km away</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.bookButton} onPress={onPress}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
          
          {onDirections && (
            <TouchableOpacity style={styles.directionButton} onPress={onDirections}>
              <Navigation size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  directionButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});