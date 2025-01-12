import axios from 'axios';

const COHERE_API_URL = 'https://api.cohere.ai/chat';
const COHERE_API_KEY = 'CEdU9W9r4Vo1kv6McqDv64k9TCKPcC4JqOdlvsx7'; // Replace with your actual API key

export const generateFeedback = (completed, total) => {
  if (total === 0) return '';
  const percentage = completed / total;
  if (percentage > 0.8) return "Great job! You're completing most of your habits.";
  if (percentage > 0.5) return "You're doing well. Try focusing on consistent habits.";
  return "Let's try completing more habits. You can do it!";
};

export const suggestHabits = async (habits) => {
    try {
      if (!habits || habits.length === 0) {
        throw new Error('No habits provided to generate suggestions.');
      }
  
      const habitDescriptions = habits
        .map(habit => `Habit: ${habit.name}, Completed: ${habit.isCompleted}`)
        .join('\n');
  
      const response = await axios.post(
        'https://api.cohere.ai/chat',
        {
          query: `Based on these habits: \n${habitDescriptions}\n Suggest personalized improvements or new habits.`,
          temperature: 0.7,
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const suggestions = response?.data?.text?.trim();
      if (!suggestions) {
        throw new Error('No valid response from Cohere API.');
      }
  
      return suggestions;
    } catch (error) {
      console.error('Error in suggestHabits function:', error);
      throw new Error('Unable to generate habit suggestions at this time.');
    }
  };
  
