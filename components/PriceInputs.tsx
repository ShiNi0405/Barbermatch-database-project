import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PriceInputsProps {
  priceType: 'fixed' | 'range' | 'starting_from';
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
}

export function PriceInputs({ priceType, priceMin, priceMax, onPriceMinChange, onPriceMaxChange }: PriceInputsProps) {
  const getMinPriceLabel = () => {
    switch (priceType) {
      case 'range':
        return 'Min Price *';
      case 'starting_from':
        return 'Starting Price *';
      default:
        return 'Price *';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.priceContainer}>
        <View style={styles.priceInputGroup}>
          <Text style={styles.label}>{getMinPriceLabel()}</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            value={priceMin}
            onChangeText={onPriceMinChange}
            keyboardType="numeric"
          />
        </View>

        {priceType === 'range' && (
          <View style={styles.priceInputGroup}>
            <Text style={styles.label}>Max Price *</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0"
              value={priceMax}
              onChangeText={onPriceMaxChange}
              keyboardType="numeric"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  priceInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
});

