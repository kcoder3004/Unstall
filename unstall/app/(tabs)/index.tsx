import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen() {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  const [pomodoroStreak, setPomodoroStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);

  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('themeMode');
      setIsDark(storedTheme ? storedTheme === 'dark' : systemColorScheme === 'dark');
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

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get('https://zenquotes.io/api/today');
        const data = res.data && Array.isArray(res.data) ? res.data[0] : null;
        if (data && data.q && data.a) {
          setQuote(data.q);
          setAuthor(data.a);
        } else {
          throw new Error('Invalid quote format');
        }
      } catch (err) {
        setQuote('Stay focused and keep pushing forward.');
        setAuthor('Unknown');
      } finally {
        setLoadingQuote(false);
      }
    };
    fetchQuote();
  }, []);

  const dynamicStyles = {
    background: isDark ? styles.darkBackground : styles.lightBackground,
    card: isDark ? styles.darkCard : styles.lightCard,
    text: isDark ? styles.darkText : styles.lightText,
    stat: isDark ? styles.darkStat : styles.lightStat,
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, dynamicStyles.background]}>
      <Text style={[styles.title, dynamicStyles.text]}>Dashboard</Text>

      {/* Quote of the Day */}
      <View style={[styles.quoteCard, dynamicStyles.card]}>
        {loadingQuote ? (
          <ActivityIndicator size="small" color={isDark ? '#fff' : '#000'} />
        ) : (
          <>
            <Text style={[styles.quote, dynamicStyles.text]}>"{quote}"</Text>
            <Text style={[styles.author, dynamicStyles.text]}>— {author}</Text>
          </>
        )}
      </View>

      {/* Stats */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  quoteCard: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    textAlign: 'right',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 2,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  stat: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#17212C' },
  lightCard: { backgroundColor: '#f6f6f6' },
  darkCard: { backgroundColor: '#222' },
  lightText: { color: '#222' },
  darkText: { color: '#fff' },
  lightStat: { color: '#000' },
  darkStat: { color: '#00ff00' },
});
