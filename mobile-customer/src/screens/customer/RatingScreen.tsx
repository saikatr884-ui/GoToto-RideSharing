import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StarRatingDisplay, StarRatingWidget } from 'react-native-star-rating-widget';

const RatingScreen = ({ route, navigation }) => {
  const { rideId } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://your-backend-url/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId,
          rating,
          review,
          categories: {
            cleanliness: rating,
            driving: rating,
            communication: rating,
            behavior: rating,
          },
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for your rating!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'Failed to submit rating');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Ride</Text>
      <Text style={styles.subtitle}>How was your experience?</Text>

      <View style={styles.ratingContainer}>
        <StarRatingWidget
          rating={rating}
          onChange={setRating}
          color="#FF6B6B"
          starSize={50}
        />
      </View>

      <Text style={styles.label}>Additional Comments</Text>
      <TextInput
        style={styles.reviewInput}
        placeholder="Share your feedback here..."
        value={review}
        onChangeText={setReview}
        multiline
        numberOfLines={4}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmitRating}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Rating</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RatingScreen;
