import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

export type Category = {
  id: string;
  name: string;
  barber_id: string | null;
  isGlobal: boolean;
};

// Returns: [categories, loading, error, refresh, addCategory, deleteCategory]
export function useCategories(
  barberId?: string | null
): [
  Category[],
  boolean,
  string | null,
  () => Promise<void>,
  (name: string) => Promise<{ error?: string }>,
  (id: string) => Promise<{ error?: string }>
] {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!barberId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Fetch both global categories (barber_id IS NULL) and barber-specific categories
      const { data, error: fetchError } = await supabase
        .from('service_categories')
        .select('*')
        .or(`barber_id.eq.${barberId},barber_id.is.null`)
        .order('barber_id', { ascending: true }) // Global categories first
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      const formattedCategories: Category[] = (data || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        barber_id: cat.barber_id,
        isGlobal: cat.barber_id === null,
      }));

      setCategories(formattedCategories);
    } catch (err: any) {
      setError(err?.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = useCallback(
    async (name: string): Promise<{ error?: string }> => {
      if (!barberId) {
        return { error: 'Missing barber ID' };
      }

      const trimmedName = name.trim();
      if (!trimmedName) {
        return { error: 'Category name cannot be empty' };
      }

      // Check if category already exists for this barber
      const existingCategory = categories.find(
        cat => cat.name.toLowerCase() === trimmedName.toLowerCase() && 
               cat.barber_id === barberId
      );
      
      if (existingCategory) {
        return { error: 'Category already exists' };
      }

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticCategory: Category = {
        id: tempId,
        name: trimmedName,
        barber_id: barberId,
        isGlobal: false,
      };

      setCategories(prev => [...prev, optimisticCategory]);

      try {
        const { data, error: insertError } = await supabase
          .from('service_categories')
          .insert({
            barber_id: barberId,
            name: trimmedName,
          } as any)
          .select()
          .single();

        if (insertError) throw insertError;

        // Replace optimistic update with real data
        setCategories(prev => 
          prev.map(cat => 
            cat.id === tempId 
              ? { ...(data as any), isGlobal: false }
              : cat
          )
        );

        return {};
      } catch (err: any) {
        // Rollback optimistic update
        setCategories(prev => prev.filter(cat => cat.id !== tempId));
        return { error: err?.message || 'Failed to add category' };
      }
    },
    [barberId, categories]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<{ error?: string }> => {
      if (!barberId) {
        return { error: 'Missing barber ID' };
      }

      const category = categories.find(cat => cat.id === id);
      if (!category) {
        return { error: 'Category not found' };
      }

      // Cannot delete global categories
      if (category.isGlobal) {
        return { error: 'Cannot delete global category' };
      }

      // Cannot delete categories that belong to other barbers
      if (category.barber_id !== barberId) {
        return { error: 'Cannot delete category' };
      }

      // Optimistic update
      setCategories(prev => prev.filter(cat => cat.id !== id));

      try {
        const { error: deleteError } = await supabase
          .from('service_categories')
          .delete()
          .eq('id', id)
          .eq('barber_id', barberId);

        if (deleteError) throw deleteError;

        return {};
      } catch (err: any) {
        // Rollback optimistic update
        setCategories(prev => [...prev, category]);
        return { error: err?.message || 'Failed to delete category' };
      }
    },
    [barberId, categories]
  );

  return [
    useMemo(() => categories, [categories]),
    loading,
    error,
    loadCategories,
    addCategory,
    deleteCategory,
  ];
}