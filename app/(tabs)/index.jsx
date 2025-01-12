import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { loadHabits, saveHabits, resetHabitsDaily } from '@/utils/storageUtils';
import { generateFeedback, suggestHabits } from '@/utils/cohereUtils';

const HabitTrackerScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  const dogImages = [
    require('@/assets/images/stage1.gif'),
    require('@/assets/images/stage2.gif'),
    require('@/assets/images/stage3.gif'),
    require('@/assets/images/stage4.gif'),
    require('@/assets/images/stage5.gif'),
  ];

  // Initialize habits on app launch
  useEffect(() => {
    const initialize = async () => {
      await resetHabitsDaily(setHabits);
      const loadedHabits = await loadHabits();
      setHabits(loadedHabits || []);
    };
    initialize();
  }, []);

  // Save habits and calculate progress whenever habits change
  useEffect(() => {
    saveHabits(habits);
    const completed = habits.filter((habit) => habit.isCompleted).length;
    setCompletedCount(completed);
    setFeedback(generateFeedback(completed, habits.length));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) {
      alert('Habit name cannot be empty!');
      return;
    }
    setHabits([...habits, { id: Date.now().toString(), name: newHabit, isCompleted: false, advice: null }]);
    setNewHabit('');
  };

  const toggleHabitCompletion = (habitId) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === habitId ? { ...habit, isCompleted: !habit.isCompleted } : habit
    );
    setHabits(updatedHabits);
  };

  const fetchAdvice = async (habit) => {
    try {
      const suggestions = await suggestHabits([habit]);
      const updatedHabits = habits.map((h) =>
        h.id === habit.id ? { ...h, advice: suggestions } : h
      );
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error fetching advice:', error);
      alert('Unable to generate advice at this time.');
    }
  };

  const toggleAdviceVisibility = (habitId) => {
    setSelectedHabitId(selectedHabitId === habitId ? null : habitId);
  };

  const getDogImage = () => {
    if (habits.length === 0) return dogImages[0];
    const progressIndex = Math.min(
      Math.floor((completedCount / habits.length) * dogImages.length),
      dogImages.length - 1
    );
    return dogImages[progressIndex];
  };

  const handleLogin = () => {
    if (username && password) {
      setIsLoggedIn(true);
    } else {
      alert('Please enter a valid username and password.');
    }
  };

  const handleSignup = () => {
    // Signup logic can be added here
    alert('Signup functionality coming soon!');
  };

  return (
    <View style={styles.container}>
      {/* Login Popup */}
      {!isLoggedIn && (
        <Modal visible={!isLoggedIn} transparent animationType="slide">
          <View style={styles.loginContainer}>
            <Image
              source={require('@/assets/images/Paw Logos Brown.png')}
              style={styles.logoImage}
            />
            
            <Image
              source={require('@/assets/images/Paw Logo Brown.png')}
              style={styles.headerImage}
            />
            
            <TextInput
              style={styles.loginInput}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.loginInput}
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {/* Habit Tracker Content */}
      {isLoggedIn && (
        <>
          <Image
            source={require('@/assets/images/Paw Logo Brown.png')}
            style={styles.headerImage}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a new habit"
              value={newHabit}
              onChangeText={setNewHabit}
            />
            <TouchableOpacity style={styles.addButton} onPress={addHabit}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: habits.length > 0 ? `${(completedCount / habits.length) * 100}%` : '0%' },
              ]}
            />
            <Text style={styles.progressText}>
              {completedCount}/{habits.length} completed
            </Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.habitContainer}>
                <View style={styles.habitHeader}>
                  <Text
                    style={[
                      styles.habitText,
                      item.isCompleted && styles.completedHabitText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.checkButton}
                      onPress={() => toggleHabitCompletion(item.id)}
                    >
                      <Text style={styles.checkButtonText}>
                        {item.isCompleted ? 'Undo' : 'Complete'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.adviceButton}
                      onPress={() => fetchAdvice(item)}
                    >
                      <Text style={styles.adviceButtonText}>Get Advice</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {item.advice && (
                  <TouchableOpacity
                    onPress={() => toggleAdviceVisibility(item.id)}
                    style={styles.toggleButton}
                  >
                    <Text style={styles.toggleButtonText}>
                      {selectedHabitId === item.id ? 'Hide Advice' : 'Show Advice'}
                    </Text>
                  </TouchableOpacity>
                )}
                {selectedHabitId === item.id && item.advice && (
                  <View style={styles.adviceContainer}>
                    <Text style={styles.adviceText}>{item.advice}</Text>
                  </View>
                )}
              </View>
            )}
            contentContainerStyle={styles.habitsList}
          />
          <View style={styles.dogImageContainer}>
            <Image source={getDogImage()} style={styles.dogImage} />
          </View>
        </>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE6',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loginHeader: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#6F4E37',
    padding: 15,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6F4E37',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#D2B48C',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D2B48C',
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B4513',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#6F4E37',
    fontSize: 16,
  },
  feedbackText: {
    textAlign: 'center',
    color: '#6F4E37',
    fontSize: 14,
  },
  habitsList: {
    paddingBottom: 20,
  },
  habitContainer: {
    backgroundColor: '#FFF8DC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6F4E37',
  },
  completedHabitText: {
    textDecorationLine: 'line-through',
    color: '#A9A9A9',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  checkButton: {
    backgroundColor: '#A0522D',
    padding: 10,
    borderRadius: 5,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 14,
  },
  adviceButton: {
    backgroundColor: '#6F4E37',
    padding: 10,
    borderRadius: 5,
  },
  adviceButtonText: {
    color: 'white',
    fontSize: 14,
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleButtonText: {
    color: '#A0522D',
    fontSize: 14,
    textAlign: 'center',
  },
  adviceContainer: {
    marginTop: 10,
    backgroundColor: '#FFF8DC',
    padding: 10,
    borderRadius: 5,
  },
  adviceText: {
    fontSize: 16,
    color: '#6F4E37',
  },
  dogImageContainer: {
    marginTop: Platform.OS === 'ios' ? -20 : 20, // Slide up on iOS
    alignItems: 'center',
  },
  dogImage: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
  },
  logoImage: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 5,
  },
  headerImage: {
    width: width * 0.8,
    height: width * 0.3,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 5,
  },
});

export default HabitTrackerScreen;
