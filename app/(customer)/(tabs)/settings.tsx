import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUIStore } from '@/stores/uiStore';
import { getLanguages, t } from '@/lib/i18n';
import { useAuthStore } from '@/stores/authStore';
import { User, Settings as SettingsIcon, Heart, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

const SETTINGS_OPTIONS = [
  {
    icon: User,
    label: 'Edit Profile',
    description: 'Update your personal information',
    action: 'profile',
  },
  {
    icon: Heart,
    label: 'Favourite Barbers',
    description: 'Manage your saved barbers',
    action: 'favourites',
  },
  {
    icon: Bell,
    label: 'Notifications',
    description: 'Manage notification preferences',
    action: 'notifications',
  },
  {
    icon: Shield,
    label: 'Privacy & Security',
    description: 'Manage your privacy settings',
    action: 'privacy',
  },
  {
    icon: HelpCircle,
    label: 'Help & Support',
    description: 'Get help or contact support',
    action: 'help',
  },
];

export default function CustomerSettingsScreen() {
  const router = useRouter();
  const { userProfile, signOut } = useAuthStore();
  const { language, setLanguage } = useUIStore();

  const handleSettingPress = (action: string) => {
    // Navigate to specific setting screens
    Alert.alert('Coming Soon', `${action} settings will be available soon`);
  };

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

  const renderSettingOption = (option: typeof SETTINGS_OPTIONS[0]) => {
    const IconComponent = option.icon;
    
    return (
      <TouchableOpacity
        key={option.action}
        style={styles.settingOption}
        onPress={() => handleSettingPress(option.action)}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIconContainer}>
            <IconComponent size={20} color="#3B82F6" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{option.label}</Text>
            <Text style={styles.settingDescription}>{option.description}</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SettingsIcon size={24} color="#3B82F6" />
        <Text style={styles.title}>Settings</Text>
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

      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.profileName}>{userProfile?.name}</Text>
            <Text style={styles.profileEmail}>{userProfile?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        {SETTINGS_OPTIONS.map(renderSettingOption)}
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  profileSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
});