import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { CreditCard as Edit3, Trash2, Clock } from 'lucide-react-native';
import { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'];

interface ServiceWithCategory extends Omit<Service, 'category'> {
  category?: {
    id: string;
    name: string;
  } | null;
}

interface ServiceCardProps {
  service: ServiceWithCategory;
  onEdit: () => void;
  onDelete: () => void;
  style?: ViewStyle;
}

export function ServiceCard({ service, onEdit, onDelete, style }: ServiceCardProps) {
  const formatPrice = () => {
    if (service.price_type === 'fixed') {
      return `$${service.price_min}`;
    } else if (service.price_type === 'range') {
      return `$${service.price_min} - $${service.price_max}`;
    } else {
      return `From $${service.price_min}`;
    }
  };

  const getCategoryColor = () => {
    // Use a hash function to generate consistent colors for dynamic categories
    const categoryName = service.category?.name || 'other';
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];
    const hash = categoryName.split('').reduce((a: number, b: string) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const getCategoryLabel = () => {
    // Use the category name if available
    if (service.category?.name) {
      return service.category.name;
    }
    return 'Other';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: service.image_url || 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg' 
          }}
          style={styles.image}
        />
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
          <Text style={styles.categoryText}>
            {getCategoryLabel()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.price}>{formatPrice()}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>

        <View style={styles.duration}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.durationText}>{service.duration} minutes</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Edit3 size={16} color="#3B82F6" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  editButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});