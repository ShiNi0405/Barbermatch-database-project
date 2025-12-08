import React from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Database } from '@/types/database';
import { useAddServiceForm } from '@/hooks/useAddServiceForm';
import { ServiceFormHeader } from '@/components/ServiceFormHeader';
import { ServiceFormFields } from '@/components/ServiceFormFields';
import { CategorySelector } from '@/components/CategorySelector';
import { PriceTypeSelector } from '@/components/PriceTypeSelector';
import { PriceInputs } from '@/components/PriceInputs';
import { DurationSelector } from '@/components/DurationSelector';
import { ServiceFormFooter } from '@/components/ServiceFormFooter';

type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

interface AddServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (serviceData: any) => Promise<void>;
  categories: ServiceCategory[];
}

export function AddServiceModal({ visible, onClose, onSubmit, categories }: AddServiceModalProps) {
  const {
    formData,
    loading,
    updateField,
    handleSubmit,
  } = useAddServiceForm({ visible, categories, onSubmit, onClose });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ServiceFormHeader title="Add New Service" onClose={onClose} />

          <ScrollView style={styles.content}>
            <ServiceFormFields 
              formData={formData} 
              onFieldChange={updateField} 
            />

            <CategorySelector 
              categories={categories}
              selectedCategoryId={formData.category_id}
              onCategorySelect={(categoryId) => updateField('category_id', categoryId)}
            />

            <PriceTypeSelector 
              selectedType={formData.price_type}
              onTypeSelect={(type) => updateField('price_type', type)}
            />

            <PriceInputs 
              priceType={formData.price_type}
              priceMin={formData.price_min}
              priceMax={formData.price_max}
              onPriceMinChange={(value) => updateField('price_min', value)}
              onPriceMaxChange={(value) => updateField('price_max', value)}
            />

            <DurationSelector 
              selectedDuration={formData.duration}
              onDurationSelect={(duration) => updateField('duration', duration)}
            />
          </ScrollView>

          <ServiceFormFooter 
            loading={loading}
            hasCategories={categories.length > 0}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
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
  content: {
    maxHeight: 400,
  },
});