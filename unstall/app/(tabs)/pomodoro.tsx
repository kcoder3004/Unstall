import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOCUS_TIME = 25 * 60;
const INITIAL_BREAK_TIME = 5 * 60;

export default function PomodoroScreen() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [breakTime, setBreakTime] = useState(INITIAL_BREAK_TIME);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

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
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            // Switch between focus and break
            if (isFocus) {
              setIsFocus(false);
              setTimeLeft(breakTime);
            } else {
              setIsFocus(true);
              setTimeLeft(FOCUS_TIME);
              setBreakTime(prevBreak => prevBreak + 5 * 60); // Increase break by 5 min
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, isFocus, breakTime]);

  const handleReset = () => {
    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setIsFocus(true);
    setTimeLeft(FOCUS_TIME);
    setBreakTime(INITIAL_BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const dynamicStyles = {
    background: isDark ? styles.darkBackground : styles.lightBackground,
    session: isDark ? styles.darkSession : styles.lightSession,
    timer: isDark ? styles.darkTimer : styles.lightTimer,
    button: isDark ? styles.darkButton : styles.lightButton,
  };

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <Text style={[styles.session, dynamicStyles.session]}>
        {isFocus ? 'Focus Time' : 'Break Time'}
      </Text>
      <Text style={[styles.timer, dynamicStyles.timer]}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttons}>
        <Button
          title={isRunning ? 'Pause' : 'Start'}
          onPress={() => setIsRunning(!isRunning)}
          color="#007AFF" 
        />
        <Ionicons
          name={isRunning ? 'pause' : 'play'}
          size={32}
          color={isDark ? "#fff" : "#555"}
          style={{ marginLeft: 10, alignSelf: 'center' }}
          onPress={() => setIsRunning(!isRunning)}
        />
        <Button title="Reset" onPress={handleReset} color="#007AFF" /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#17212C' },
  session: { fontSize: 24, marginBottom: 10 },
  lightSession: { color: '#555' },
  darkSession: { color: '#fff' },
  timer: { fontSize: 64, fontWeight: 'bold', marginBottom: 20 },
  lightTimer: { color: '#222' },
  darkTimer: { color: '#fff' },
  buttons: {
    flexDirection: 'row',
    gap: 20,
  },
  lightButton: {},
  darkButton: {},
});
