import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import apiClient from '../api/client';

const SavedJobsScreen = ({ navigation }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchSavedJobs = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await apiClient.get('/jobs/saved');
      if (response.success && response.data) {
        setSavedJobs(response.data.savedJobs || []);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const response = await apiClient.delete(`/jobs/${jobId}/save`);
      if (response.success) {
        Alert.alert('Bookmark Removed', 'Job removed from your saved list');
        setSavedJobs(prev => prev.filter(item => item.jobId?._id !== jobId));
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to remove saved job');
    }
  };

  const renderSavedJobCard = ({ item }) => {
    const job = item.jobId;
    if (!job) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.jobTypeBadge}>{job.jobType}</Text>
          <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveSavedJob(job._id)}>
            <Text style={styles.removeBtnText}>🗑️ Remove</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.companyText}>🏢 {job.companyName}</Text>
        <Text style={styles.metaText}>📍 {job.location}</Text>
        <Text style={styles.salaryText}>💰 {job.salaryRange}</Text>

        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => navigation.navigate('JobDetail', { jobId: job._id })}
        >
          <Text style={styles.viewBtnText}>View Job Details →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⭐ My Saved Jobs</Text>
        <Text style={styles.subtitle}>Manage your bookmarked job applications</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading saved job bookmarks...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item._id}
          renderItem={renderSavedJobCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Saved Jobs</Text>
              <Text style={styles.emptySub}>You haven't bookmarked any jobs yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SavedJobsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 18, backgroundColor: '#003366', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#FFCC00', marginTop: 4, textAlign: 'center' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E5E5E5', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  jobTypeBadge: { backgroundColor: '#003366', color: '#FFF', fontWeight: 'bold', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  removeBtn: { backgroundColor: '#FCE8E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  removeBtnText: { fontSize: 12, fontWeight: 'bold', color: '#C5221F' },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  companyText: { fontSize: 14, fontWeight: '600', color: '#003366', marginBottom: 4 },
  metaText: { fontSize: 13, color: '#555', marginBottom: 4 },
  salaryText: { fontSize: 13, color: '#137333', fontWeight: 'bold', marginBottom: 10 },
  viewBtn: { backgroundColor: '#F0F2F5', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  viewBtnText: { color: '#003366', fontWeight: 'bold', fontSize: 13 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorContainer: { padding: 20, alignItems: 'center' },
  errorText: { color: '#C5221F', fontSize: 14 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#444' },
  emptySub: { fontSize: 13, color: '#777', marginTop: 4 }
});
