import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

export default function ProcessingScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('Scanning...');
  const progress = useSharedValue(0);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setStatus('Analyzing face structure...');
    }, 1000);

    const timer2 = setTimeout(() => {
      setStatus('Generating hairstyles...');
    }, 2500);

    const timer3 = setTimeout(() => {
      setStatus('Completed');
      setTimeout(() => {
        router.replace('/ai/results');
      }, 500);
    }, 4000);

    // Animate progress bar
    progress.value = withSequence(
      withTiming(30, { duration: 1000 }),
      withDelay(1500, withTiming(70, { duration: 1000 })),
      withDelay(1500, withTiming(100, { duration: 500 }))
    );

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Sparkles size={64} color="#3B82F6" />
        </View>

        <Text style={styles.title}>AI Magic in Progress</Text>
        <Text style={styles.subtitle}>
          Our AI is analyzing your photo and generating personalized hairstyle recommendations
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});