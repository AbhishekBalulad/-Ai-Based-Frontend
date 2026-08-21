import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import apiClient from '../api/client';
import TtsPlayerBar from '../components/TtsPlayerBar';

const SchemeDetailScreen = ({ route, navigation }) => {
  const { schemeId } = route.params || {};

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('DETAILS');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchSchemeDetails = async () => {
    if (!schemeId) {
      setErrorMessage('Invalid scheme ID parameter');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await apiClient.get(`/schemes/${schemeId}`);
      if (response.success && response.data) {
        setScheme(response.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load scheme details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemeDetails();
  }, [schemeId]);

  const handleOpenOfficialUrl = () => {
    if (scheme?.officialSourceUrl) {
      Linking.openURL(scheme.officialSourceUrl).catch(() => {
        Alert.alert('Error', 'Unable to open official portal link');
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={{ marginTop: 12, color: '#555' }}>Loading Official Scheme Information...</Text>
      </SafeAreaView>
    );
  }

  if (errorMessage || !scheme) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {errorMessage || 'Scheme not found'}</Text>
      </SafeAreaView>
    );
  }

  const audioText = `${scheme.title}. ${scheme.simplifiedSummary || scheme.rawDescription}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.categoryBadge}>{scheme.category}</Text>
          <Text style={styles.stateTag}>📍 {scheme.state || 'All India'}</Text>
        </View>

        <Text style={styles.title}>{scheme.title}</Text>
        <Text style={styles.ministryText}>
          🏛️ {scheme.schemeSourceRef?.ministryOrDepartment || 'Government of India'}
        </Text>

        {/* Text-To-Speech Player Bar */}
        <TtsPlayerBar textToRead={audioText} defaultLanguage="en" />

        <View style={styles.tabBar}>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'DETAILS' && styles.tabButtonActive]} onPress={() => setActiveTab('DETAILS')}>
            <Text style={[styles.tabButtonText, activeTab === 'DETAILS' && styles.tabButtonTextActive]}>Structured Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'RAW' && styles.tabButtonActive]} onPress={() => setActiveTab('RAW')}>
            <Text style={[styles.tabButtonText, activeTab === 'RAW' && styles.tabButtonTextActive]}>Official Gazette Text</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.officialButton} onPress={handleOpenOfficialUrl}>
          <Text style={styles.officialButtonText}>🌐 Launch Official Govt Application Portal</Text>
          <Text style={styles.officialSubText}>{scheme.officialSourceUrl}</Text>
        </TouchableOpacity>

        {activeTab === 'DETAILS' ? (
          <>
            {scheme.benefits && scheme.benefits.length > 0 ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionHeader}>🎁 Financial & Social Benefits</Text>
                {scheme.benefits.map((benefit, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.bullet}>✓</Text>
                    <Text style={styles.listText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {scheme.eligibilityCriteria && scheme.eligibilityCriteria.length > 0 ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionHeader}>✅ Citizen Eligibility Requirements</Text>
                {scheme.eligibilityCriteria.map((elig, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.bullet}>✓</Text>
                    <Text style={styles.listText}>{elig}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>📜 Original Government Gazette Content</Text>
            <Text style={styles.rawText}>{scheme.rawDescription}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SchemeDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { backgroundColor: '#003366', color: '#FFF', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  stateTag: { fontSize: 12, color: '#555', fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003366', marginBottom: 6 },
  ministryText: { fontSize: 13, color: '#555', marginBottom: 14 },
  tabBar: { flexDirection: 'row', backgroundColor: '#EAEAEA', borderRadius: 8, padding: 4, marginBottom: 16 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabButtonActive: { backgroundColor: '#003366' },
  tabButtonText: { fontSize: 13, color: '#555', fontWeight: '600' },
  tabButtonTextActive: { color: '#FFF', fontWeight: 'bold' },
  officialButton: { backgroundColor: '#137333', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', marginBottom: 18 },
  officialButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  officialSubText: { color: '#D2E3FC', fontSize: 11, marginTop: 2 },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E5E5', elevation: 1 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#003366', marginBottom: 12 },
  listItem: { flexDirection: 'row', marginTop: 8, alignItems: 'flex-start' },
  bullet: { fontSize: 14, color: '#137333', marginRight: 8, fontWeight: 'bold' },
  listText: { fontSize: 14, color: '#333', flex: 1, lineHeight: 20 },
  rawText: { fontSize: 13, color: '#444', lineHeight: 20, fontFamily: 'monospace' },
  errorText: { color: '#C5221F', fontSize: 15 }
});
