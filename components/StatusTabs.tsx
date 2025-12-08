import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface StatusTab {
  key: string;
  label: string;
}

interface StatusTabsProps {
  tabs: StatusTab[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
}

export function StatusTabs({ tabs, activeTab, onTabPress }: StatusTabsProps) {
  const renderTab = (tab: StatusTab) => (
    <TouchableOpacity
      key={tab.key}
      style={[styles.tab, activeTab === tab.key && styles.activeTab]}
      onPress={() => onTabPress(tab.key)}
    >
      <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.tabContainer}>
      {tabs.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: '#fff',
  },
});

