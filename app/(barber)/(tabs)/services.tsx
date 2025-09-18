import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useBarberStore } from '@/stores/barberStore';
import { ServiceCard } from '@/components/ServiceCard';
import { AddServiceModal } from '@/components/AddServiceModal';
import { useCategories } from '@/hooks/useCategories';
import { Scissors, Plus, X } from 'lucide-react-native';

export default function BarberServicesScreen() {
  const { userProfile } = useAuthStore();
  const { barberProfile, services, loadServices, deleteService, loadBarberProfile } = useBarberStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [categories, categoriesLoading, categoriesError, refreshCategories, addCategory, deleteCategory] = useCategories(barberProfile?.id);
  const categoriesFlatListRef = useRef<FlatList>(null);

  // First, ensure barberProfile is loaded
  useEffect(() => {
    if (userProfile?.id && !barberProfile) {
      loadBarberProfile(userProfile.id);
    }
  }, [userProfile?.id, barberProfile]);

  // Then, load services when barberProfile is available
  useEffect(() => {
    if (barberProfile?.id) {
      loadServices(barberProfile.id);
    }
  }, [barberProfile?.id]);

  // Filter services based on selected category
  const filteredServices = services.filter(service => {
    if (activeCategoryId === null) return true; // Show all
    return service.category_id === activeCategoryId;
  });

  // Show loading state while barberProfile is being loaded
  if (!barberProfile && userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Scissors size={24} color="#3B82F6" />
            <Text style={styles.title}>Services</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteService(serviceId),
        },
      ]
    );
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const result = await addCategory(newCategoryName.trim());
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${categoryName}"? This will not affect existing services.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteCategory(categoryId);
            if (result.error) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setActiveCategoryId(categoryId);
    
    // Auto-scroll to selected category
    if (categoryId && categoriesFlatListRef.current) {
      const index = allCategories.findIndex(cat => cat.id === categoryId);
      if (index !== -1) {
        categoriesFlatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // Center the selected category
        });
      }
    }
  };

  const renderCategory = (category: { id: string | null; name: string; isGlobal: boolean }) => (
    <TouchableOpacity
      key={category.id || 'all'}
      style={[
        styles.categoryChip,
        activeCategoryId === category.id && styles.activeCategoryChip
      ]}
      onPress={() => handleCategorySelect(category.id)}
    >
      <Text
        style={[
          styles.categoryText,
          activeCategoryId === category.id && styles.activeCategoryText
        ]}
      >
        {category.name}
      </Text>
      {!category.isGlobal && category.id && (
        <TouchableOpacity
          style={styles.deleteCategoryButton}
          onPress={() => handleDeleteCategory(category.id!, category.name)}
        >
          <X size={12} color="#EF4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderService = ({ item }: { item: any }) => (
    <ServiceCard
      service={item}
      onEdit={() => {
        // Navigate to edit service screen
        Alert.alert('Edit Service', 'Edit functionality coming soon');
      }}
      onDelete={() => handleDeleteService(item.id)}
      style={styles.serviceCard}
    />
  );

  // Build categories list with "All" option
  const allCategories = [
    { id: null, name: 'All', isGlobal: true },
    ...categories
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Scissors size={24} color="#3B82F6" />
          <Text style={styles.title}>Services</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.addButton, !barberProfile && styles.addButtonDisabled]}
          onPress={() => setShowAddModal(true)}
          disabled={!barberProfile}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Sticky Categories Filter */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesScrollContainer}>
          <FlatList
            ref={categoriesFlatListRef}
            data={allCategories}
            renderItem={({ item }) => renderCategory(item)}
            keyExtractor={(item) => item.id || 'all'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
            style={styles.categoriesList}
            decelerationRate="fast"
            snapToInterval={120} // Snap to each category chip width + margin
            snapToAlignment="start"
            bounces={false}
            scrollEventThrottle={16}
            ItemSeparatorComponent={() => <View style={styles.categorySeparator} />}
            ListFooterComponent={() => <View style={styles.categoriesFooter} />}
            onScrollToIndexFailed={(info) => {
              // Handle scroll to index failure gracefully
              console.warn('Scroll to index failed:', info);
            }}
          />
        </View>
        
        {/* Add Category Button */}
        <View style={styles.addCategoryContainer}>
          {!showAddCategory ? (
            <TouchableOpacity
              style={styles.addCategoryButton}
              onPress={() => setShowAddCategory(true)}
            >
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.addCategoryText}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addCategoryInput}>
              <TextInput
                style={styles.categoryInput}
                placeholder="Category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
                onSubmitEditing={handleAddCategory}
              />
              <TouchableOpacity
                style={styles.confirmCategoryButton}
                onPress={handleAddCategory}
              >
                <Text style={styles.confirmCategoryText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelCategoryButton}
                onPress={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
              >
                <Text style={styles.cancelCategoryText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Scissors size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No services found</Text>
          <Text style={styles.emptySubtitle}>
            {activeCategoryId === null 
              ? 'Add your first service to get started'
              : `No services in this category`
            }
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.emptyButtonText}>Add Service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddServiceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        barberId={barberProfile?.id}
        categories={categories}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    height: 60, // Fixed height for consistent layout
  },
  categoriesScrollContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  categoriesList: {
    flexGrow: 0, // Don't grow to fill space
  },
  categories: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categorySeparator: {
    width: 8, // Space between category chips
  },
  categoriesFooter: {
    width: 20, // Extra space at the end
  },
  addCategoryContainer: {
    paddingHorizontal: 20,
    paddingLeft: 12,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80, // Ensure minimum width for better touch targets
  },
  activeCategoryChip: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  deleteCategoryButton: {
    marginLeft: 6,
    padding: 2,
  },
  addCategoryButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60, // Consistent minimum width
  },
  addCategoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginLeft: 4,
  },
  addCategoryInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  categoryInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minWidth: 120,
  },
  confirmCategoryButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  confirmCategoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  cancelCategoryButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  cancelCategoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  servicesList: {
    padding: 20,
  },
  serviceCard: {
    marginBottom: 16,
  },
});