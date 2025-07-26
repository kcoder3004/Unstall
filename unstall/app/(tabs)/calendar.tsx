import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Optional: Set locale for calendar
LocaleConfig.locales['en'] = {
  monthNames: [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ],
  monthNamesShort: [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ],
  dayNames: [
    'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
  ],
  dayNamesShort: [
    'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
  ]
};
LocaleConfig.defaultLocale = 'en';

export default function CalendarScreen() {
  const [deadlines, setDeadlines] = useState<{ title: string; date: string }[]>([]);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]); // Pomodoro history
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('themeMode');
      setIsDark(storedTheme === 'dark' || (storedTheme === null && systemColorScheme === 'dark'));
    };
    const interval = setInterval(loadTheme, 500);
    return () => clearInterval(interval);
  }, [systemColorScheme]);

  useEffect(() => {
    const loadData = async () => {
      const savedDeadlines = await AsyncStorage.getItem('deadlines');
      if (savedDeadlines) setDeadlines(JSON.parse(savedDeadlines));

      const savedSessions = await AsyncStorage.getItem('pomodoroHistory');
      if (savedSessions) setCompletedSessions(JSON.parse(savedSessions));
    };
    loadData();
  }, []);

  const addDeadline = async () => {
    if (title.trim() && selectedDate.trim()) {
      const newDeadlines = [...deadlines, { title, date: selectedDate }];
      setDeadlines(newDeadlines);
      setTitle('');
      setSelectedDate('');
      setModalVisible(false);
      await AsyncStorage.setItem('deadlines', JSON.stringify(newDeadlines));
    }
  };

  const removeDeadline = async (index: number) => {
    const newDeadlines = deadlines.filter((_, i) => i !== index);
    setDeadlines(newDeadlines);
    await AsyncStorage.setItem('deadlines', JSON.stringify(newDeadlines));
  };

  // Mark deadlines and completed Pomodoro sessions
  const markedDates: Record<string, any> = {};

  // Mark Pomodoro completions with green dots
  completedSessions.forEach(date => {
    markedDates[date] = {
      ...markedDates[date],
      marked: true,
      dots: [
        ...(markedDates[date]?.dots || []),
        { key: 'focus', color: '#34C759' }, // green dot
      ],
    };
  });

  // Mark deadlines with blue dots
  deadlines.forEach(({ date }) => {
    markedDates[date] = {
      ...markedDates[date],
      marked: true,
      dots: [
        ...(markedDates[date]?.dots || []),
        { key: 'deadline', color: '#007AFF' }, // blue dot
      ],
      selected: selectedDate === date,
      selectedColor: selectedDate === date ? '#007AFF' : undefined,
    };
  });

  const dynamicStyles = {
    background: isDark ? styles.darkBackground : styles.lightBackground,
    text: isDark ? styles.darkText : styles.lightText,
    input: isDark ? styles.darkInput : styles.lightInput,
    modal: isDark ? styles.darkModal : styles.lightModal,
  };

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <Text style={[styles.title, dynamicStyles.text]}>Calendar</Text>
      <Calendar 
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={day => {
          setSelectedDate(day.dateString);
          setModalVisible(true);
        }}
        theme={{
          backgroundColor: isDark ? '#17212C' : '#fff',
          calendarBackground: isDark ? '#17212C' : '#fff',
          dayTextColor: isDark ? '#fff' : '#222',
          monthTextColor: '#007AFF',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#fff',
          todayTextColor: '#007AFF',
          arrowColor: '#007AFF',
        }}
        style={styles.calendar}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, dynamicStyles.modal]}>
          <Text style={[styles.modalTitle, dynamicStyles.text]}>
            Add/Edit Deadline for {selectedDate}
          </Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="Deadline Title"
            placeholderTextColor={isDark ? "#ccc" : "#999"}
            value={title}
            onChangeText={setTitle}
          />
          <Button title="Save Deadline" onPress={addDeadline} color="#007AFF" />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="#888" />
        </View>
      </Modal>

      <Text style={[styles.subtitle, dynamicStyles.text]}>Deadlines</Text>
      <FlatList
        data={deadlines}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => removeDeadline(index)}>
            <View style={styles.deadlineItem}>
              <Text style={[styles.deadlineTitle, dynamicStyles.text]}>{item.title}</Text>
              <Text style={[styles.deadlineDate, dynamicStyles.text]}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.deadlineList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, textAlign: 'center' },
  calendar: { width: '100%', maxWidth: 400, marginBottom: 10 },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    maxWidth: 400,
    textAlign: 'center',
    borderWidth: 1,
  },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#17212C' },
  lightText: { color: '#222' },
  darkText: { color: 'white' },
  lightInput: {
    backgroundColor: '#fff',
    color: '#222',
    borderColor: '#ccc',
  },
  darkInput: {
    backgroundColor: '#2A2E38',
    color: 'white',
    borderColor: '#555',
  },
  lightModal: { backgroundColor: '#fff' },
  darkModal: { backgroundColor: '#222' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    margin: 24,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  deadlineList: {
    marginTop: 10,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  deadlineItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  deadlineTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  deadlineDate: {
    fontSize: 16,
    marginTop: 4,
  },
});
 