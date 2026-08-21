import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import apiClient from '../api/client';

const JOB_TYPES = ['All', 'Government', 'Full-Time', 'Part-Time', 'Contract'];

const JobFeedScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedType !== 'All') params.jobType = selectedType;

      const response = await apiClient.get('/jobs', { params });
      if (response.success && response.data) {
        setJobs(response.data.jobs || []);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load job listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedType]);

  const handleSaveJob = async (jobId) => {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/save`);
      if (response.success) {
        Alert.alert('Bookmark Saved', 'Job added to your saved jobs!');
      }
    } catch (err) {
      Alert.alert('Bookmark Status', err.message || 'Failed to save job');
    }
  };

  const getRiskBadgeStyle = (level) => {
    if (level === 'High Risk') return styles.riskHigh;
    if (level === 'Medium Risk') return styles.riskMed;
    return styles.riskLow;
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetail', { jobId: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.riskBadge, getRiskBadgeStyle(item.riskLevel)]}>
          🛡️ {item.riskLevel || 'Low Risk'}
        </Text>
        <TouchableOpacity style={styles.bookmarkBtn} onPress={() => handleSaveJob(item._id)}>
          <Text style={styles.bookmarkBtnText}>⭐ Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.companyText}>🏢 {item.companyName}</Text>
      <Text style={styles.metaText}>📍 {item.location} • 💼 {item.jobType}</Text>
      <Text style={styles.salaryText}>💰 {item.salaryRange}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.sourceText}>Source: {item.jobSourceRef?.providerName || 'NCS Portal'}</Text>
        <Text style={styles.viewDetailsText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs by title, company, location..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={fetchJobs}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchJobs}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={JOB_TYPES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, selectedType === item && styles.chipActive]}
              onPress={() => setSelectedType(item)}
            >
              <Text style={[styles.chipText, selectedType === item && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.savedJobsBanner}
        onPress={() => navigation.navigate('SavedJobs')}
      >
        <Text style={styles.savedJobsBannerText}>⭐ View My Saved Jobs</Text>
      </TouchableOpacity>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={{ marginTop: 10, color: '#666' }}>Fetching verified job listings...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJobs(); }} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default JobFeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  searchBox: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  searchInput: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#222' },
  searchButton: { backgroundColor: '#003366', marginLeft: 8, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  searchButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  chipWrapper: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#EAEAEA', marginRight: 8, borderWidth: 1, borderColor: '#DDD' },
  chipActive: { backgroundColor: '#003366', borderColor: '#003366' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  savedJobsBanner: { backgroundColor: '#FFCC00', padding: 10, alignItems: 'center' },
  savedJobsBannerText: { color: '#003366', fontWeight: 'bold', fontSize: 13 },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E5E5E5', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  riskBadge: { fontWeight: 'bold', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  riskLow: { backgroundColor: '#E6F4EA', color: '#137333' },
  riskMed: { backgroundColor: '#FEF7E0', color: '#B06000' },
  riskHigh: { backgroundColor: '#FCE8E6', color: '#C5221F' },
  bookmarkBtn: { backgroundColor: '#F0F2F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  bookmarkBtnText: { fontSize: 12, fontWeight: 'bold', color: '#003366' },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  companyText: { fontSize: 14, fontWeight: '600', color: '#003366', marginBottom: 4 },
  metaText: { fontSize: 13, color: '#555', marginBottom: 4 },
  salaryText: { fontSize: 13, color: '#137333', fontWeight: 'bold', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F0F0F0', paddingTop: 8 },
  sourceText: { fontSize: 11, color: '#777' },
  viewDetailsText: { fontSize: 13, fontWeight: 'bold', color: '#003366' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorContainer: { padding: 20, alignItems: 'center' },
  errorText: { color: '#C5221F', fontSize: 14 }
});
