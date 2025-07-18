import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoalsScreen() {
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
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
    // Listen for changes to themeMode in AsyncStorage
    const interval = setInterval(loadTheme, 500);
    return () => clearInterval(interval);
  }, [systemColorScheme]);

  const dynamicStyles = {
    background: isDark ? styles.darkBackground : styles.lightBackground,
    text: isDark ? styles.darkText : styles.lightText,
    input: isDark ? styles.darkInput : styles.lightInput,
  };

  const addGoal = () => {
    if (goal.trim()) {
      setGoals([...goals, goal]);
      setGoal('');
    }
  };

  const removeGoal = (index: number) => {
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals);
  };

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <Text style={[styles.title, dynamicStyles.text]}> Set Your Goals</Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Enter a goal"
        placeholderTextColor={isDark ? "#ccc" : "#999"}
        value={goal}
        onChangeText={setGoal}
      />
      <Button title="Add Goal" onPress={addGoal} color="#007AFF" />

      <FlatList
        data={goals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => removeGoal(index)}>
            <Text style={[styles.goal, dynamicStyles.text]}>• {item}</Text>
          </TouchableOpacity>
        )}
        style={styles.goalList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60, 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 5,
    textAlign: 'center'
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    maxWidth: 400,
    textAlign: 'center'
  },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#17212C' },
  lightText: { color: '#222' },
  darkText: { color: 'white' },
  lightInput: {
    backgroundColor: '#fff',
    color: '#222'
  },
  darkInput: {
    backgroundColor: '#2A2E38',
    color: 'white'
  },
  goalList: {
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  goal: {
    fontSize: 18,
    marginVertical: 6,
    paddingLeft: 10,
    textAlign: 'center'
  }
});
