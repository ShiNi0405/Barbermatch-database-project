import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Database } from '@/types/database';

type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

interface CategorySelectorProps {
  categories: ServiceCategory[];
  selectedCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedCategoryId, onCategorySelect }: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category *</Text>
      <View style={styles.chipContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.chip,
              selectedCategoryId === category.id && styles.chipSelected
            ]}
            onPress={() => onCategorySelect(category.id)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategoryId === category.id && styles.chipTextSelected
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
  noCategoriesText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

