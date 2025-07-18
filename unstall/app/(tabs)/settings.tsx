import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, useColorScheme, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [focusMinutes, setFocusMinutes] = useState('25');
  const [breakMinutes, setBreakMinutes] = useState('5');
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const focus = await AsyncStorage.getItem('focusMinutes');
      const brk = await AsyncStorage.getItem('breakMinutes');
      if (focus) setFocusMinutes(focus);
      if (brk) setBreakMinutes(brk);
      const storedTheme = await AsyncStorage.getItem('themeMode');
      if (storedTheme) setIsDark(storedTheme === 'dark');
    } catch (err) {
      console.log('Failed to load settings', err);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('focusMinutes', focusMinutes);
      await AsyncStorage.setItem('breakMinutes', breakMinutes);
      Alert.alert('Settings saved!');
    } catch (err) {
      console.log('Failed to save settings', err);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    await AsyncStorage.setItem('themeMode', newTheme);
  };

  // Shared styles for light/dark mode
  const dynamicStyles = {
    background: isDark ? styles.darkBackground : styles.lightBackground,
    text: isDark ? styles.darkText : styles.lightText,
    input: isDark ? styles.darkInput : styles.lightInput,
  };

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <Text style={[styles.title, dynamicStyles.text]}>Settings</Text>

      <View style={styles.toggleRow}>
        <Text style={[styles.label, dynamicStyles.text]}>Dark Mode:</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <Text style={[styles.label, dynamicStyles.text]}>Focus Time (minutes):</Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        keyboardType="numeric"
        value={focusMinutes}
        onChangeText={setFocusMinutes}
      />

      <Text style={[styles.label, dynamicStyles.text]}>Break Time (minutes):</Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        keyboardType="numeric"
        value={breakMinutes}
        onChangeText={setBreakMinutes}
      />

      <Button title="Save Settings" onPress={saveSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
  },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#1c1c1c' },
  lightText: { color: '#222' },
  darkText: { color: '#fff' },
  lightInput: {
    backgroundColor: '#fff',
    color: '#222',
    borderColor: '#ccc',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderColor: '#555',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
});
