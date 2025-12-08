import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PRICE_TYPES = [
  { key: 'fixed', label: 'Fixed Price' },
  { key: 'range', label: 'Price Range' },
  { key: 'starting_from', label: 'Starting From' },
];

interface PriceTypeSelectorProps {
  selectedType: 'fixed' | 'range' | 'starting_from';
  onTypeSelect: (type: 'fixed' | 'range' | 'starting_from') => void;
}

export function PriceTypeSelector({ selectedType, onTypeSelect }: PriceTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price Type *</Text>
      <View style={styles.chipContainer}>
        {PRICE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.chip,
              selectedType === type.key && styles.chipSelected
            ]}
            onPress={() => onTypeSelect(type.key as any)}
          >
            <Text
              style={[
                styles.chipText,
                selectedType === type.key && styles.chipTextSelected
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
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
});

