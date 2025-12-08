/**
 * Service Header Component
 * Header section for the services screen with title and add button
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Scissors, Plus } from 'lucide-react-native';

interface ServiceHeaderProps {
  onAddPress: () => void;
}

export function ServiceHeader({ onAddPress }: ServiceHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Scissors size={24} color="#3B82F6" />
        <Text style={styles.title}>Services</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddPress}
      >
        <Plus size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
  },
});

