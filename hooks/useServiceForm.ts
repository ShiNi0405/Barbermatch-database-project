/**
 * Custom hook for service form logic
 * Encapsulates form state and validation for service creation/editing
 */

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

interface UseServiceFormProps {
  categories: ServiceCategory[];
  onSubmit: (data: ServiceFormData) => Promise<{ success: boolean; error?: string }>;
  initialData?: Partial<ServiceFormData>;
  onSuccess?: () => void;
}

interface UseServiceFormReturn {
  // Form state
  formData: ServiceFormData;
  loading: boolean;
  errors: Record<string, string>;
  
  // Form actions
  updateField: (field: keyof ServiceFormData, value: any) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
  validateForm: () => boolean;
  
  // Computed values
  isValid: boolean;
  canSubmit: boolean;
}

const PRICE_TYPES = [
  { key: 'fixed', label: 'Fixed Price' },
  { key: 'range', label: 'Price Range' },
  { key: 'starting_from', label: 'Starting From' },
];

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export function useServiceForm({
  categories,
  onSubmit,
  initialData,
  onSuccess,
}: UseServiceFormProps): UseServiceFormReturn {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    category_id: '',
    description: '',
    price_type: 'fixed',
    price_min: '',
    price_max: '',
    duration: 30,
    ...initialData,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Set default category when categories change
  useEffect(() => {
    if (categories.length > 0 && !formData.category_id) {
      setFormData(prev => ({
        ...prev,
        category_id: categories[0].id,
      }));
    }
  }, [categories, formData.category_id]);

  const updateField = useCallback((field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    // Validate category
    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    // Validate price
    if (!formData.price_min || isNaN(Number(formData.price_min))) {
      newErrors.price_min = 'Please enter a valid minimum price';
    } else if (Number(formData.price_min) <= 0) {
      newErrors.price_min = 'Price must be greater than 0';
    }

    // Validate price range
    if (formData.price_type === 'range') {
      if (!formData.price_max || isNaN(Number(formData.price_max))) {
        newErrors.price_max = 'Please enter a valid maximum price';
      } else if (Number(formData.price_max) <= Number(formData.price_min)) {
        newErrors.price_max = 'Maximum price must be greater than minimum price';
      }
    }

    // Validate duration
    if (!DURATION_OPTIONS.includes(formData.duration)) {
      newErrors.duration = 'Please select a valid duration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        resetForm();
        onSuccess?.();
      } else {
        Alert.alert('Error', result.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Service form error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onSubmit, onSuccess]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      price_type: 'fixed',
      price_min: '',
      price_max: '',
      duration: 30,
    });
    setErrors({});
  }, [categories]);

  const isValid = Object.keys(errors).length === 0 && 
    formData.name.trim() !== '' && 
    formData.category_id !== '' && 
    formData.price_min !== '';

  const canSubmit = isValid && !loading;

  return {
    // Form state
    formData,
    loading,
    errors,
    
    // Form actions
    updateField,
    handleSubmit,
    resetForm,
    validateForm,
    
    // Computed values
    isValid,
    canSubmit,
  };
}

export { PRICE_TYPES, DURATION_OPTIONS };

