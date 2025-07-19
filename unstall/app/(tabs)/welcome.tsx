import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../../assets/images/logo.png');

export default function OnboardingScreen() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (seen) {
        setShowOnboarding(false);
        router.replace('/dashboard');
      }
    };
    checkOnboarding();
  }, []);

  const handleContinue = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    router.replace('/dashboard');
  };

  if (!showOnboarding) return null;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Welcome to Unstall </Text>
      <Text style={styles.paragraph}>
        Your productivity companion
      </Text>
      <Text style={styles.paragraph}>
        Unstall helps you beat procrastination with a simple Pomodoro timer, goal tracker, and daily progress insights — all in one clean, focused app. Stay on track, one session at a time.
        {'\n'}
        {'\n'}
        Start your journey to better productivity today!
      </Text>
      <Link href="#" style={styles.link} onPress={handleContinue}>Continue</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#17212C' },
  logoContainer: {
    position: 'absolute',
    top: 5,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 144,
    height: 144,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 2 },
  link: { fontSize: 18, color: '#007AFF', marginVertical: 10 },
  paragraph: { fontSize: 16, color: 'white', marginTop: 10, marginBottom: 20, textAlign: 'center' },
});
