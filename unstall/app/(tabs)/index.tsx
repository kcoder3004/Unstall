import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Unstall </Text>
      <Text style={styles.paragraph}>Your productivity companion</Text>
      <Link href="/dashboard" style={styles.link}>Dashboard</Link>
      <Link href="/pomodoro" style={styles.link}>Start Pomodoro</Link>
      <Link href="/calendar" style={styles.link}>View Calendar</Link>
      <Link href="/profile" style={styles.link}>My Profile</Link>
      <Link href="/settings" style={styles.link}>Settings</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  link: { fontSize: 18, color: '#007AFF', marginVertical: 10 },
  paragraph: { fontSize: 16, color: 'white', marginTop: 50, marginBottom: 20 },
});
