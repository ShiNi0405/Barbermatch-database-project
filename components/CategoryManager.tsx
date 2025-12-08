/**
 * Category Manager Component
 * Manages service categories with add/delete functionality
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Plus, X } from 'lucide-react-native';

interface Category {
  id: string | null;
  name: string;
}

interface CategoryManagerProps {
  categories: Category[];
  activeCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onAddCategory: (name: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteCategory: (categoryId: string) => Promise<{ success: boolean; error?: string }>;
}

export function CategoryManager({
  categories,
  activeCategoryId,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const categoriesFlatListRef = useRef<FlatList>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const result = await onAddCategory(newCategoryName.trim());
    if (result.success) {
      setNewCategoryName('');
      setShowAddCategory(false);
    } else {
      Alert.alert('Error', result.error || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category? Services in this category will be uncategorized.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await onDeleteCategory(categoryId);
            if (!result.success) {
              Alert.alert('Error', result.error || 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        activeCategoryId === item.id && styles.activeCategoryChip,
      ]}
      onPress={() => onCategorySelect(activeCategoryId === item.id ? null : item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          activeCategoryId === item.id && styles.activeCategoryChipText,
        ]}
      >
        {item.name}
      </Text>
      {item.id && (
        <TouchableOpacity
          onPress={() => handleDeleteCategory(item.id!)}
          style={styles.deleteCategoryButton}
        >
          <X size={16} color={activeCategoryId === item.id ? '#fff' : '#6B7280'} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.categoriesSection}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setShowAddCategory(true)}
        >
          <Plus size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={categoriesFlatListRef}
        data={[{ id: null, name: 'All' }, ...categories]}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id || 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {showAddCategory && (
        <View style={styles.addCategoryContainer}>
          <TextInput
            style={styles.addCategoryInput}
            placeholder="Enter category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            autoFocus
          />
          <TouchableOpacity
            style={styles.addCategoryConfirmButton}
            onPress={handleAddCategory}
          >
            <Text style={styles.addCategoryConfirmButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addCategoryCancelButton}
            onPress={() => {
              setShowAddCategory(false);
              setNewCategoryName('');
            }}
          >
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addCategoryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryChipText: {
    color: '#fff',
  },
  deleteCategoryButton: {
    marginLeft: 8,
    padding: 2,
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  addCategoryInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
  },
  addCategoryConfirmButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  addCategoryConfirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  addCategoryCancelButton: {
    padding: 8,
    marginLeft: 8,
  },
});

