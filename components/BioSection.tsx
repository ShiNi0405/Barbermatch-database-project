import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BioSectionProps {
  bio?: string | null;
}

export function BioSection({ bio }: BioSectionProps) {
  if (!bio) {
    return null;
  }

  return (
    <View style={styles.bioSection}>
      <Text style={styles.bioTitle}>About</Text>
      <Text style={styles.bioText}>{bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bioSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});

