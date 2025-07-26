import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
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

  const dynamicStyles = {
    background: isDark ? styles.darkBackground : styles.lightBackground,
    title: isDark ? styles.darkTitle : styles.lightTitle,
    label: isDark ? styles.darkLabel : styles.lightLabel,
    value: isDark ? styles.darkValue : styles.lightValue,
  };

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <Text style={[styles.title, dynamicStyles.title]}>Profile</Text>/*
      <View style={styles.infoBox}>
        <Text style={[styles.label, dynamicStyles.label]}>Name:</Text>
        <Text style={[styles.value, dynamicStyles.value]}>Jane Doe</Text>
      </View>    <View style={styles.infoBox}>
        <Text style={[styles.label, dynamicStyles.label]}>Email:</Text>
        <Text style={[styles.value, dynamicStyles.value]}>jane.doe@email.com</Text>
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
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  lightTitle: { color: '#222' },
  darkTitle: { color: '#fff' },
  infoBox: {
    flexDirection: 'row', marginBottom: 12,
  },
  label: { fontSize: 18, fontWeight: '600', marginRight: 8 },
  lightLabel: { color: '#222' },
  darkLabel: { color: '#fff' },
  value: { fontSize: 18 },
  lightValue: { color: '#555' },
  darkValue: { color: '#fff' },
});