import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const ProgressBarComponent = ({ progress, feedback }) => {

  <View style={styles.progressContainer}>
    <Text style={styles.progressText}>Progress: {(progress * 100).toFixed(0)}%</Text>
    <ProgressBar progress={Math.min(progress, 1)} color="#2D6A4F" style={styles.progressBar} />
    <Text style={styles.feedbackText}>{feedback}</Text>
  </View>
};

const styles = StyleSheet.create({
  progressContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  progressText: {
    fontSize: 16,
    color: '#2D6A4F',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  feedbackText: {
    fontSize: 14,
    color: '#2D6A4F',
    marginTop: 10,
  },
});


export default ProgressBarComponent;
