import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationSelect: (duration: number) => void;
}

export function DurationSelector({ selectedDuration, onDurationSelect }: DurationSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Duration *</Text>
      <View style={styles.chipContainer}>
        {DURATION_OPTIONS.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.chip,
              selectedDuration === duration && styles.chipSelected
            ]}
            onPress={() => onDurationSelect(duration)}
          >
            <Text
              style={[
                styles.chipText,
                selectedDuration === duration && styles.chipTextSelected
              ]}
            >
              {duration} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
});

