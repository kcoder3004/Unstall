import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FOCUS_TIME = 25 * 60;
const INITIAL_BREAK_TIME = 5 * 60;

export default function PomodoroScreen() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [breakTime, setBreakTime] = useState(INITIAL_BREAK_TIME);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.session}>
        {isFocus ? 'Focus Time' : 'Break Time'}
      </Text>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttons}>
        <Button
          title={isRunning ? 'Pause' : 'Start'}
          onPress={() => setIsRunning(!isRunning)}
        />
        <Ionicons
          name={isRunning ? 'pause' : 'play'}
          size={32}
          color="#555"
          style={{ marginLeft: 10, alignSelf: 'center' }}
          onPress={() => setIsRunning(!isRunning)}
        />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  session: {
    fontSize: 24, marginBottom: 10, color: '#555',
  },
  timer: {
    fontSize: 64, fontWeight: 'bold', marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
  },
});
