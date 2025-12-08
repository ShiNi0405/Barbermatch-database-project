import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';

interface PortfolioItem {
  id: string;
  title: string;
  category: 'men' | 'women';
}

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
  activeTab: 'men' | 'women';
  onTabChange: (tab: 'men' | 'women') => void;
  onAddPortfolio?: () => void;
}

export function PortfolioSection({ 
  portfolio, 
  activeTab, 
  onTabChange, 
  onAddPortfolio 
}: PortfolioSectionProps) {
  const filteredPortfolio = (portfolio || []).filter(item => item.category === activeTab);

  return (
    <View style={styles.portfolioSection}>
      <View style={styles.portfolioHeader}>
        <View style={styles.portfolioTitle}>
          <ImageIcon size={20} color="#3B82F6" />
          <Text style={styles.portfolioTitleText}>Portfolio</Text>
        </View>
        
        <View style={styles.portfolioTabs}>
          <TouchableOpacity
            style={[
              styles.portfolioTab, 
              activeTab === 'men' && styles.activePortfolioTab
            ]}
            onPress={() => onTabChange('men')}
          >
            <Text
              style={[
                styles.portfolioTabText, 
                activeTab === 'men' && styles.activePortfolioTabText
              ]}
            >
              Men
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.portfolioTab, 
              activeTab === 'women' && styles.activePortfolioTab
            ]}
            onPress={() => onTabChange('women')}
          >
            <Text
              style={[
                styles.portfolioTabText, 
                activeTab === 'women' && styles.activePortfolioTabText
              ]}
            >
              Women
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredPortfolio.length === 0 ? (
        <View style={styles.emptyPortfolio}>
          <Text style={styles.emptyPortfolioText}>
            No {activeTab}'s portfolio items yet
          </Text>
          <TouchableOpacity style={styles.addPortfolioButton} onPress={onAddPortfolio}>
            <Text style={styles.addPortfolioButtonText}>Add Portfolio Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.portfolioGrid}>
          {filteredPortfolio.map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              <Text style={styles.portfolioItemTitle}>{item.title}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  portfolioSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  portfolioTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioTitleText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  portfolioTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  portfolioTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePortfolioTab: {
    backgroundColor: '#3B82F6',
  },
  portfolioTabText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activePortfolioTabText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  emptyPortfolio: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyPortfolioText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  addPortfolioButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addPortfolioButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  portfolioItem: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  portfolioItemTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
});

