import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { useBarberStore } from '@/stores/barberStore';
import { Category } from '@/hooks/useCategories';

interface AddServiceModalProps {
  visible: boolean;
  onClose: () => void;
  barberId?: string;
  categories: Category[];
}

const PRICE_TYPES = [
  { key: 'fixed', label: 'Fixed Price' },
  { key: 'range', label: 'Price Range' },
  { key: 'starting_from', label: 'Starting From' },
];

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export function AddServiceModal({ visible, onClose, barberId, categories }: AddServiceModalProps) {
  const { addService } = useBarberStore();
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price_type: 'fixed',
    price_min: '',
    price_max: '',
    duration: 30,
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      // Set default category to first available category
      const defaultCategory = categories.find(cat => cat.isGlobal) || categories[0];
      setFormData(prev => ({
        ...prev,
        category_id: defaultCategory?.id || '',
      }));
    } else {
      // Reset form when modal closes
      setFormData({
        name: '',
        category_id: '',
        description: '',
        price_type: 'fixed',
        price_min: '',
        price_max: '',
        duration: 30,
      });
    }
  }, [visible, categories]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.price_min) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.category_id) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!barberId) {
      Alert.alert('Error', 'Barber profile not loaded. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const serviceData = {
        barber_id: barberId,
        name: formData.name,
        category_id: formData.category_id,
        description: formData.description,
        price_type: formData.price_type,
        price_min: parseFloat(formData.price_min),
        price_max: formData.price_max ? parseFloat(formData.price_max) : null,
        duration: formData.duration,
      };

      const result = await addService(serviceData);

      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        Alert.alert('Success', 'Service added successfully');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category_id);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Service</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Classic Haircut"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.chipContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.chip,
                      formData.category_id === category.id && styles.chipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, category_id: category.id })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        formData.category_id === category.id && styles.chipTextSelected
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {categories.length === 0 && (
                <Text style={styles.noCategoriesText}>
                  No categories available. Please add a category first.
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your service..."
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price Type *</Text>
              <View style={styles.chipContainer}>
                {PRICE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.chip,
                      formData.price_type === type.key && styles.chipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, price_type: type.key })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        formData.price_type === type.key && styles.chipTextSelected
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.priceContainer}>
              <View style={styles.priceInputGroup}>
                <Text style={styles.label}>
                  {formData.price_type === 'range' ? 'Min Price *' : 
                   formData.price_type === 'starting_from' ? 'Starting Price *' : 'Price *'}
                </Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0"
                  value={formData.price_min}
                  onChangeText={(text) => setFormData({ ...formData, price_min: text })}
                  keyboardType="numeric"
                />
              </View>

              {formData.price_type === 'range' && (
                <View style={styles.priceInputGroup}>
                  <Text style={styles.label}>Max Price *</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    value={formData.price_max}
                    onChangeText={(text) => setFormData({ ...formData, price_max: text })}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration *</Text>
              <View style={styles.chipContainer}>
                {DURATION_OPTIONS.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.chip,
                      formData.duration === duration && styles.chipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, duration })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        formData.duration === duration && styles.chipTextSelected
                      ]}
                    >
                      {duration} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.addButton, 
                (loading || categories.length === 0) && styles.addButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={loading || categories.length === 0}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>
                {loading ? 'Adding...' : 'Add Service'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  noCategoriesText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    fontStyle: 'italic',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputGroup: {
    flex: 1,
  },
  priceInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});