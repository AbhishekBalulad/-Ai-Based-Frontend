import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import apiClient from '../api/client';

const CATEGORIES = [
  { id: 'SCHEME_SIMPLIFICATION', label: '📜 Policy Information' },
  { id: 'AI_CHATBOT', label: '🤖 AI Chatbot' },
  { id: 'TRANSLATION_QUALITY', label: '🌐 Translation' },
  { id: 'TTS_AUDIO', label: '🔊 Text-to-Speech' },
  { id: 'OCR_SCANNER', label: '📷 OCR Scanner' },
  { id: 'JOB_PORTAL', label: '💼 Job Portal' },
  { id: 'FRAUD_DETECTION', label: '🛡️ Fraud Detection' },
  { id: 'GENERAL_APP', label: '⭐ General App' }
];

const FeedbackScreen = () => {
  const [selectedType, setSelectedType] = useState('SCHEME_SIMPLIFICATION');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [myFeedbackList, setMyFeedbackList] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  const fetchMyFeedback = async () => {
    setFetchingHistory(true);
    try {
      const response = await apiClient.get('/feedback/my');
      if (response.success && response.data) {
        setMyFeedbackList(response.data.feedbackList || []);
      }
    } catch (err) {
      console.warn('Failed to load feedback history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const handleSubmitFeedback = async () => {
    if (!comment.trim()) {
      Alert.alert('Validation Error', 'Please enter a brief comment describing your feedback');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/feedback', {
        feedbackType: selectedType,
        rating,
        comment: comment.trim()
      });

      if (response.success) {
        Alert.alert('Thank You!', 'Your feedback has been recorded securely.');
        setComment('');
        fetchMyFeedback();
      }
    } catch (err) {
      Alert.alert('Submission Error', err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBox}>
          <Text style={styles.title}>⭐ Citizen Feedback</Text>
          <Text style={styles.subtitle}>Rate policies, AI simplifications, translations & job features</Text>
        </View>

        {/* Feedback Form */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Select Feedback Topic:</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, selectedType === cat.id && styles.catChipActive]}
                onPress={() => setSelectedType(cat.id)}
              >
                <Text style={[styles.catChipText, selectedType === cat.id && styles.catChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Your Rating (1 to 5 Stars):</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={styles.starIcon}>{star <= rating ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Comments & Suggestions:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Share your experience or report an issue..."
            placeholderTextColor="#888"
            value={comment}
            onChangeText={setComment}
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmitFeedback}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Citizen Feedback</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Feedback History List */}
        <Text style={styles.historyTitle}>Your Submitted Feedback History</Text>
        {fetchingHistory ? (
          <ActivityIndicator color="#003366" style={{ marginVertical: 10 }} />
        ) : myFeedbackList.length === 0 ? (
          <Text style={styles.emptyHistoryText}>No feedback submitted yet.</Text>
        ) : (
          myFeedbackList.map((item) => (
            <View key={item._id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyCatBadge}>{item.feedbackType}</Text>
                <Text style={styles.historyRating}>{'⭐'.repeat(item.rating)}</Text>
              </View>
              <Text style={styles.historyComment}>{item.comment}</Text>
              <Text style={styles.historyDate}>Submitted on: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: 20 },
  headerBox: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003366' },
  subtitle: { fontSize: 13, color: '#555', marginTop: 4, textAlign: 'center' },
  formCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#EAEAEA', borderWidth: 1, borderColor: '#DDD' },
  catChipActive: { backgroundColor: '#003366', borderColor: '#003366' },
  catChipText: { fontSize: 12, color: '#444' },
  catChipTextActive: { color: '#FFF', fontWeight: 'bold' },
  starRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  starIcon: { fontSize: 32 },
  textArea: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, fontSize: 14, color: '#222', textAlignVertical: 'top', minHeight: 100, marginBottom: 16 },
  submitButton: { backgroundColor: '#003366', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  historyTitle: { fontSize: 16, fontWeight: 'bold', color: '#003366', marginBottom: 12 },
  emptyHistoryText: { fontSize: 13, color: '#777', fontStyle: 'italic' },
  historyCard: { backgroundColor: '#FFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E5E5E5' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyCatBadge: { backgroundColor: '#E6F0FA', color: '#003366', fontWeight: 'bold', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  historyRating: { fontSize: 12 },
  historyComment: { fontSize: 14, color: '#333', marginBottom: 6 },
  historyDate: { fontSize: 11, color: '#888' }
});
