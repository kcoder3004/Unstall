import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

// Correct logo import for assets/images/logo.png
const logo = require('../../assets/images/logo.png');

export default function Home() {
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
      <Link href="/dashboard" style={styles.link}>Go to Dashboard</Link>
      <Link href="/pomodoro" style={styles.link}>Start Pomodoro</Link>
      <Link href="/goals" style={styles.link}>Track your Goals</Link>
      <Link href="/calendar" style={styles.link}>View Calendar</Link>
      <Link href="/profile" style={styles.link}>My Profile</Link>
      <Link href="/settings" style={styles.link}>Settings</Link>
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
