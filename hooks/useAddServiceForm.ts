import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
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

interface UseAddServiceFormProps {
  visible: boolean;
  categories: ServiceCategory[];
  onSubmit: (serviceData: any) => Promise<void>;
  onClose: () => void;
}

export function useAddServiceForm({ visible, categories, onSubmit, onClose }: UseAddServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
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
  useEffect(() => {
    if (visible) {
      // Set default category to first available category
      const defaultCategory = categories[0];
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

  const updateField = useCallback((field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.name || !formData.price_min) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!formData.category_id) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const serviceData = {
        name: formData.name,
        category_id: formData.category_id || null,
        description: formData.description,
        price_type: formData.price_type,
        price_min: parseFloat(formData.price_min),
        price_max: formData.price_max ? parseFloat(formData.price_max) : null,
        duration: formData.duration,
      };

      await onSubmit(serviceData);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add service');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onSubmit, onClose]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      category_id: '',
      description: '',
      price_type: 'fixed',
      price_min: '',
      price_max: '',
      duration: 30,
    });
  }, []);

  return {
    formData,
    loading,
    updateField,
    handleSubmit,
    resetForm,
    validateForm,
  };
}

