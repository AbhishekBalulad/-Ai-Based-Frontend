import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import apiClient from '../api/client';

const LANG_TRACKS = [
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'mr', label: 'Marathi (मराठी)' }
];

const VideoExplanationScreen = () => {
  const [videos, setVideos] = useState([]);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchVideos = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await apiClient.get('/videos', {
        params: { language: selectedLang }
      });
      if (response.success && response.data) {
        setVideos(response.data.videos || []);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load policy explainer videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedLang]);

  const handlePlayVideo = (videoUrl) => {
    if (videoUrl) {
      Linking.openURL(videoUrl).catch(() => Alert.alert('Error', 'Unable to play video stream'));
    }
  };

  const renderVideoCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.thumbnailBox}>
        <Text style={styles.playIcon}>▶</Text>
        <Text style={styles.durationBadge}>{item.durationText}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.schemeTag}>{item.schemeTitle}</Text>
        <Text style={styles.videoTitle}>{item.videoTitle}</Text>
        <Text style={styles.publisherText}>Source: {item.sourcePublisher}</Text>

        <TouchableOpacity style={styles.playButton} onPress={() => handlePlayVideo(item.streamUrl || item.videoUrl)}>
          <Text style={styles.playButtonText}>▶ Watch Video Explanation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 Policy Explainer Videos</Text>
        <Text style={styles.subtitle}>Watch simple visual guides for official government schemes</Text>
      </View>

      {/* Multilingual Video Track Selector */}
      <View style={styles.trackSelector}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={LANG_TRACKS}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.trackChip, selectedLang === item.code && styles.trackChipActive]}
              onPress={() => setSelectedLang(item.code)}
            >
              <Text style={[styles.trackChipText, selectedLang === item.code && styles.trackChipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading video explainer stream...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.videoId}
          renderItem={renderVideoCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No videos found for selected language track.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default VideoExplanationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 18, backgroundColor: '#003366', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#FFCC00', marginTop: 4, textAlign: 'center' },
  trackSelector: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  trackChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#EAEAEA', marginRight: 8, borderWidth: 1, borderColor: '#DDD' },
  trackChipActive: { backgroundColor: '#003366', borderColor: '#003366' },
  trackChipText: { fontSize: 13, color: '#444' },
  trackChipTextActive: { color: '#FFF', fontWeight: 'bold' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5', elevation: 2 },
  thumbnailBox: { height: 140, backgroundColor: '#1A237E', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  playIcon: { fontSize: 48, color: '#FFCC00' },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.8)', color: '#FFF', fontSize: 11, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cardBody: { padding: 14 },
  schemeTag: { fontSize: 12, fontWeight: 'bold', color: '#003366', marginBottom: 4 },
  videoTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 6 },
  publisherText: { fontSize: 12, color: '#666', marginBottom: 12 },
  playButton: { backgroundColor: '#137333', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  playButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorContainer: { padding: 20, alignItems: 'center' },
  errorText: { color: '#C5221F', fontSize: 14 },
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#777', fontSize: 14 }
});
