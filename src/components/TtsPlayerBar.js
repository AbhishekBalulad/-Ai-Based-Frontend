import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import apiClient from '../api/client';

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' }
];

const TtsPlayerBar = ({ textToRead, defaultLanguage = 'en' }) => {
  const [selectedLang, setSelectedLang] = useState(defaultLanguage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const handlePlayAudio = async () => {
    if (!textToRead || !textToRead.trim()) {
      Alert.alert('TTS Error', 'No text available for audio playback');
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/ai/tts', {
        text: textToRead,
        language: selectedLang
      });

      if (response.success && response.data) {
        setAudioUrl(response.data.audioUrl);
        setIsPlaying(true);
        setIsPaused(false);
        Alert.alert('🔊 Audio Playback Active', `Playing audio summary in ${selectedLang.toUpperCase()}`);
      }
    } catch (err) {
      Alert.alert('TTS Error', err.message || 'Failed to synthesize speech audio');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseAudio = () => {
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStopAudio = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setAudioUrl(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🔊 Listen to Audio Explanation</Text>
      </View>

      {/* Language Selector Chips */}
      <View style={styles.langRow}>
        {LANG_OPTIONS.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langChip, selectedLang === lang.code && styles.langChipActive]}
            onPress={() => {
              setSelectedLang(lang.code);
              handleStopAudio();
            }}
          >
            <Text style={[styles.langChipText, selectedLang === lang.code && styles.langChipTextActive]}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Audio Playback Controls */}
      <View style={styles.controlsRow}>
        {loading ? (
          <ActivityIndicator color="#003366" size="small" />
        ) : isPlaying ? (
          <TouchableOpacity style={[styles.controlBtn, styles.pauseBtn]} onPress={handlePauseAudio}>
            <Text style={styles.controlBtnText}>⏸ Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.controlBtn, styles.playBtn]} onPress={handlePlayAudio}>
            <Text style={styles.controlBtnText}>{isPaused ? '▶ Resume' : '▶ Play Audio'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlBtn, styles.stopBtn, !isPlaying && !isPaused && styles.btnDisabled]}
          onPress={handleStopAudio}
          disabled={!isPlaying && !isPaused}
        >
          <Text style={styles.controlBtnText}>⏹ Stop</Text>
        </TouchableOpacity>
      </View>

      {isPlaying ? (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>🟢 Playing Spoken Explanation ({selectedLang.toUpperCase()})</Text>
        </View>
      ) : isPaused ? (
        <View style={styles.statusBoxPaused}>
          <Text style={styles.statusTextPaused}>🟡 Audio Playback Paused</Text>
        </View>
      ) : null}
    </View>
  );
};

export default TtsPlayerBar;

const styles = StyleSheet.create({
  container: { backgroundColor: '#E6F0FA', padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#CCE0F5' },
  headerRow: { marginBottom: 8 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#003366' },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  langChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#B0C4DE' },
  langChipActive: { backgroundColor: '#003366', borderColor: '#003366' },
  langChipText: { fontSize: 12, color: '#333' },
  langChipTextActive: { color: '#FFF', fontWeight: 'bold' },
  controlsRow: { flexDirection: 'row', gap: 10 },
  controlBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  playBtn: { backgroundColor: '#137333' },
  pauseBtn: { backgroundColor: '#E37400' },
  stopBtn: { backgroundColor: '#D93025' },
  btnDisabled: { opacity: 0.4 },
  controlBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  statusBox: { marginTop: 10, padding: 6, backgroundColor: '#E6F4EA', borderRadius: 4, alignItems: 'center' },
  statusText: { fontSize: 12, color: '#137333', fontWeight: '600' },
  statusBoxPaused: { marginTop: 10, padding: 6, backgroundColor: '#FEF7E0', borderRadius: 4, alignItems: 'center' },
  statusTextPaused: { fontSize: 12, color: '#B06000', fontWeight: '600' }
});
