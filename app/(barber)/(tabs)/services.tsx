import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useBarberProfileContext } from '@/contexts/BarberProfileContext';
import { useServiceScreen } from '@/hooks/useServiceScreen';
import { AddServiceModal } from '@/components/AddServiceModal';
import { ServiceHeader } from '@/components/ServiceHeader';
import { CategoryManager } from '@/components/CategoryManager';
import { ServiceList } from '@/components/ServiceList';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function BarberServicesScreen() {
  const { userProfile } = useAuth();
  const { barberProfile } = useBarberProfileContext();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const {
    services,
    categories,
    loading,
    activeCategoryId,
    setActiveCategoryId,
    handleDeleteService,
    handleAddCategory,
    handleDeleteCategory,
    handleCreateService,
    handleEditService,
  } = useServiceScreen(barberProfile?.id);

  // Show loading state while barberProfile is being loaded
  if (!barberProfile && userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <ServiceHeader onAddPress={() => {}} />
        <LoadingSpinner message="Loading your services..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ServiceHeader onAddPress={() => setShowAddModal(true)} />
      
      <CategoryManager
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategorySelect={setActiveCategoryId}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ServiceList
        services={services}
        onEditService={handleEditService}
        onDeleteService={handleDeleteService}
        onAddService={() => setShowAddModal(true)}
        loading={loading}
      />

      <AddServiceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (serviceData: any) => {
          const result = await handleCreateService(serviceData);
          if (result.success) {
            setShowAddModal(false);
          } else {
            Alert.alert('Error', result.error || 'Failed to create service');
          }
        }}
        categories={categories as any}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});