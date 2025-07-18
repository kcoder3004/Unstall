import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>Jane Doe</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>jane.doe@email.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  title: {
    fontSize: 32, fontWeight: 'bold', marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row', marginBottom: 12,
  },
  label: {
    fontSize: 18, fontWeight: '600', marginRight: 8,
  },
  value: {
    fontSize: 18, color: '#555',
  },
});