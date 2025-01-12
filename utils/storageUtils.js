import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadHabits = async () => {
  const storedHabits = await AsyncStorage.getItem('habits');
  return storedHabits ? JSON.parse(storedHabits) : [];
};

export const saveHabits = async (habits) => {
  await AsyncStorage.setItem('habits', JSON.stringify(habits));
};

export const resetHabitsDaily = async (setHabits) => {
  const lastReset = await AsyncStorage.getItem('lastReset');
  const today = new Date().toDateString();
  if (lastReset !== today) {
    setHabits([]);
    await AsyncStorage.setItem('lastReset', today);
  }
};
