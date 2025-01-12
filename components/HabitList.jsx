import React from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HabitList = ({ habits, setHabits }) => {
  const toggleCompletion = (id) => {
    setHabits(habits.map(habit => (habit.id === id ? { ...habit, isCompleted: !habit.isCompleted } : habit)));
  };

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.habitItem}>
          <Text style={[styles.habitText, item.isCompleted && styles.completedText]}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleCompletion(item.id)}>
            <Text style={styles.completeButton}>✅</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
    habitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      marginVertical: 5,
      padding: 10,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    habitText: {
      flex: 1,
      fontSize: 18,
      color: '#2D6A4F',
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
    completeButton: {
      fontSize: 18,
      color: 'green',
      marginLeft: 10,
    },
  });
  

export default HabitList;
