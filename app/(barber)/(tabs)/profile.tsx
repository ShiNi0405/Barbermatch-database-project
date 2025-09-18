import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useBarberStore } from '@/stores/barberStore';
import { User, Settings as SettingsIcon, MapPin, Phone, Clock, Image as ImageIcon, CreditCard as Edit3, LogOut, Trash2 } from 'lucide-react-native';
import { useUIStore } from '@/stores/uiStore';
import { getLanguages, t } from '@/lib/i18n';

export default function BarberProfileScreen() {
  const router = useRouter();
  const { userProfile, signOut } = useAuthStore();
  const { barberProfile, portfolio, loadPortfolio } = useBarberStore();
  const [activePortfolioTab, setActivePortfolioTab] = useState<'men' | 'women'>('men');
  const { language, setLanguage } = useUIStore();

  useEffect(() => {
    if (barberProfile) {
      loadPortfolio(barberProfile.id);
    }
  }, [barberProfile]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const filteredPortfolio = portfolio.filter(item => item.category === activePortfolioTab);

  if (!barberProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <SettingsIcon size={24} color="#3B82F6" />
          <Text style={styles.title}>Profile & Settings</Text>
        </View>

        <View style={styles.langRow}>
          <Text style={styles.langLabel}>{t('choose_language')}</Text>
          <View style={styles.langButtons}>
            {getLanguages().map((opt) => (
              <TouchableOpacity
                key={opt.code}
                style={[styles.langBtn, language === opt.code && styles.langBtnActive]}
                onPress={() => setLanguage(opt.code as any)}
              >
                <Text style={[styles.langBtnText, language === opt.code && styles.langBtnTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.salonName}>{barberProfile.salon_name}</Text>
              <Text style={styles.userName}>{userProfile?.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {barberProfile.rating.toFixed(1)}</Text>
                <Text style={styles.ratingText}>Average Rating</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Edit3 size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MapPin size={20} color="#6B7280" />
            <Text style={styles.infoText}>{barberProfile.address}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.infoText}>{barberProfile.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={20} color="#6B7280" />
            <Text style={styles.infoText}>Mon-Fri: 9:00 AM - 6:00 PM</Text>
          </View>
        </View>

        {barberProfile.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.bioTitle}>About</Text>
            <Text style={styles.bioText}>{barberProfile.bio}</Text>
          </View>
        )}

        <View style={styles.portfolioSection}>
          <View style={styles.portfolioHeader}>
            <View style={styles.portfolioTitle}>
              <ImageIcon size={20} color="#3B82F6" />
              <Text style={styles.portfolioTitleText}>Portfolio</Text>
            </View>
            
            <View style={styles.portfolioTabs}>
              <TouchableOpacity
                style={[styles.portfolioTab, activePortfolioTab === 'men' && styles.activePortfolioTab]}
                onPress={() => setActivePortfolioTab('men')}
              >
                <Text
                  style={[styles.portfolioTabText, activePortfolioTab === 'men' && styles.activePortfolioTabText]}
                >
                  Men
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.portfolioTab, activePortfolioTab === 'women' && styles.activePortfolioTab]}
                onPress={() => setActivePortfolioTab('women')}
              >
                <Text
                  style={[styles.portfolioTabText, activePortfolioTab === 'women' && styles.activePortfolioTabText]}
                >
                  Women
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {filteredPortfolio.length === 0 ? (
            <View style={styles.emptyPortfolio}>
              <Text style={styles.emptyPortfolioText}>
                No {activePortfolioTab}'s portfolio items yet
              </Text>
              <TouchableOpacity style={styles.addPortfolioButton}>
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

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit3 size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Clock size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Operating Hours</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton}>
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 12,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  editProfileButton: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
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
  actionsSection: {
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  signOutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginLeft: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginLeft: 12,
  },
});