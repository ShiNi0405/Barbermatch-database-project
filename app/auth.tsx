import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { t, getLanguages } from '@/lib/i18n';
import { useUIStore } from '@/stores/uiStore';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { signUp, signIn, loading: authLoading } = useAuth();
  const { language, setLanguage } = useUIStore();
  
  // Prevent multiple rapid button presses
  const isProcessing = useRef(false);
  const lastAuthAttempt = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAuth = async () => {
    // Debounce rapid button presses
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAuthAttempt.current;
    
    if (isProcessing.current || timeSinceLastAttempt < 2000) {
      console.log('🔐 Auth already in progress, skipping...', { 
        authLoading, 
        isProcessing: isProcessing.current, 
        timeSinceLastAttempt 
      });
      return;
    }

    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('🔐 Starting auth process...', isSignUp ? 'signUp' : 'signIn');
    isProcessing.current = true;
    lastAuthAttempt.current = now;
    setLoading(true);

    // Safety timeout to reset processing state
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      isProcessing.current = false;
      setLoading(false);
    }, 10000) as unknown as NodeJS.Timeout; // 10 second timeout
    
    try {
      const result = isSignUp
        ? await signUp({ email, password, name })
        : await signIn({ email, password });

      console.log('🔐 Auth result:', result);
      if (!result.success) {
        Alert.alert('Error', result.error || 'Authentication failed');
      } else {
        console.log('🔐 Auth successful, redirecting to index screen...');
        // Clear form fields
        setEmail('');
        setPassword('');
        setName('');
        // Redirect to index screen which will handle routing based on auth state
        router.replace('/');
      }
    } catch (error) {
      console.error('🔐 Auth error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      isProcessing.current = false;
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
  };

  const availableLanguages = getLanguages();
  const currentLanguage = availableLanguages.find(lang => lang.code === language) || availableLanguages[0];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp ? t('auth.signUpSubtitle') : t('auth.signInSubtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          {isSignUp && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.name')}</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('auth.namePlaceholder')}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.password')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.passwordPlaceholder')}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (loading || authLoading) && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading || authLoading}
          >
            <Text style={styles.buttonText}>
              {loading || authLoading ? t('auth.loading') : (isSignUp ? t('auth.signUp') : t('auth.signIn'))}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.languageSelector}>
          <Text style={styles.languageLabel}>{t('auth.language')}</Text>
          <View style={styles.languageButtons}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  language === lang.code && styles.languageButtonActive
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text style={[
                  styles.languageButtonText,
                  language === lang.code && styles.languageButtonTextActive
                ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    fontFamily: 'Inter-Regular',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    color: '#3B82F6',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  languageSelector: {
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  languageButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
});