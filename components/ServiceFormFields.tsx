import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Database } from '@/types/database';

type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

interface ServiceFormData {
  name: string;
  category_id: string;
  description: string;
  price_type: 'fixed' | 'range' | 'starting_from';
  price_min: string;
  price_max: string;
  duration: number;
}

interface ServiceFormFieldsProps {
  formData: ServiceFormData;
  onFieldChange: (field: keyof ServiceFormData, value: any) => void;
}

export function ServiceFormFields({ formData, onFieldChange }: ServiceFormFieldsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Classic Haircut"
          value={formData.name}
          onChangeText={(text) => onFieldChange('name', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your service..."
          value={formData.description}
          onChangeText={(text) => onFieldChange('description', text)}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
});

