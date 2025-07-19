import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [pomodoroStreak, setPomodoroStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('themeMode');
      if (storedTheme) {
        setIsDark(storedTheme === 'dark');
      } else {
        setIsDark(systemColorScheme === 'dark');
      }
    };
    const interval = setInterval(loadTheme, 500);
    return () => clearInterval(interval);
  }, [systemColorScheme]);

  useEffect(() => {
    const loadStats = async () => {
      const streak = await AsyncStorage.getItem('pomodoroStreak');
      const sessions = await AsyncStorage.getItem('totalSessions');
      const goals = await AsyncStorage.getItem('goalsCompleted');
      setPomodoroStreak(streak ? Number(streak) : 0);
      setTotalSessions(sessions ? Number(sessions) : 0);
      setGoalsCompleted(goals ? Number(goals) : 0);
    };
    loadStats();
  }, []);

  const dynamicStyles = {
    background: isDark ? styles.darkBackground : styles.lightBackground,
    card: isDark ? styles.darkCard : styles.lightCard,
    text: isDark ? styles.darkText : styles.lightText,
    stat: isDark ? styles.darkStat : styles.lightStat,
  };

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <Text style={[styles.title, dynamicStyles.text]}>Dashboard</Text>
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.statLabel, dynamicStyles.text]}>Pomodoro Streak</Text>
        <Text style={[styles.stat, dynamicStyles.stat]}>{pomodoroStreak} days</Text>
      </View>
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.statLabel, dynamicStyles.text]}>Total Sessions</Text>
        <Text style={[styles.stat, dynamicStyles.stat]}>{totalSessions}</Text>
      </View>
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.statLabel, dynamicStyles.text]}>Goals Completed</Text>
        <Text style={[styles.stat, dynamicStyles.stat]}>{goalsCompleted}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32 },
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 2,
  },
  statLabel: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  stat: { fontSize: 28, fontWeight: 'bold' },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#17212C' },
  lightCard: { backgroundColor: '#f6f6f6' },
  darkCard: { backgroundColor: '#222' },
  lightText: { color: '#222' },
  darkText: { color: '#fff' },
  lightStat: { color: '#000' },
  darkStat: { color: '#00ff00' },
});