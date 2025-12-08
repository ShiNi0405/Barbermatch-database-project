import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

interface ServiceFormFooterProps {
  loading: boolean;
  hasCategories: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ServiceFormFooter({ loading, hasCategories, onCancel, onSubmit }: ServiceFormFooterProps) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.addButton, 
          (loading || !hasCategories) && styles.addButtonDisabled
        ]} 
        onPress={onSubmit}
        disabled={loading || !hasCategories}
      >
        <Plus size={16} color="#FFFFFF" />
        <Text style={styles.addButtonText}>
          {loading ? 'Adding...' : 'Add Service'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});

