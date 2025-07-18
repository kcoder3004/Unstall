import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function GoalsScreen() {
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState<string[]>([]);

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
    <View style={styles.container}>
      <Text style={styles.title}> Set Your Goals</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a goal"
        placeholderTextColor="#999"
        value={goal}
        onChangeText={setGoal}
      />
      <Button title="Add Goal" onPress={addGoal} color="#007AFF" />

      <FlatList
        data={goals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => removeGoal(index)}>
            <Text style={styles.goal}>• {item}</Text>
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
    backgroundColor: '#17212C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60, 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 5,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#2A2E38',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    maxWidth: 400,
    textAlign: 'center'
  },
  goalList: {
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  goal: {
    fontSize: 18,
    color: 'white',
    marginVertical: 6,
    paddingLeft: 10,
    textAlign: 'center'
  }
});
