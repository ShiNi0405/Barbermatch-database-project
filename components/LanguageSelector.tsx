import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getLanguages, t } from '@/lib/i18n';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <View style={styles.langRow}>
      <Text style={styles.langLabel}>{t('choose_language')}</Text>
      <View style={styles.langButtons}>
        {getLanguages().map((opt) => (
          <TouchableOpacity
            key={opt.code}
            style={[
              styles.langBtn,
              currentLanguage === opt.code && styles.langBtnActive
            ]}
            onPress={() => onLanguageChange(opt.code as any)}
          >
            <Text
              style={[
                styles.langBtnText,
                currentLanguage === opt.code && styles.langBtnTextActive
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  langLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  langButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  langBtnActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  langBtnText: {
    color: '#1F2937',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  langBtnTextActive: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
  },
});

