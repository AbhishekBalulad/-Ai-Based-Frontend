import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import apiClient from '../api/client';

const SAMPLE_DOCS = [
  { name: 'Kisan Landholding Deed', file: 'kisan_land_certificate.jpg' },
  { name: 'Income Certificate (EWS)', file: 'income_certificate.jpg' },
  { name: 'Aadhaar Identity Card', file: 'aadhaar_id.jpg' }
];

const OcrScannerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [editableText, setEditableText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScanSampleDoc = async (sampleFile) => {
    setLoading(true);
    setErrorMessage('');
    setScanResult(null);

    try {
      const response = await apiClient.post('/ocr/scan', {
        fileName: sampleFile
      });

      if (response.success && response.data) {
        setScanResult(response.data);
        setEditableText(response.data.extractedText);
      }
    } catch (err) {
      setErrorMessage(err.message || 'OCR extraction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetScan = () => {
    setScanResult(null);
    setEditableText('');
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>📷 OCR Document Scanner</Text>
          <Text style={styles.subtitle}>Scan identity, land, or income documents to auto-verify scheme eligibility</Text>
        </View>

        {!scanResult && !loading ? (
          <View style={styles.scanActionCard}>
            <Text style={styles.sectionHeader}>Select Document Source</Text>
            
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => handleScanSampleDoc('kisan_land_certificate.jpg')}>
              <Text style={styles.actionBtnText}>📸 Capture with Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnSecondary} onPress={() => handleScanSampleDoc('income_certificate.jpg')}>
              <Text style={styles.actionBtnSecondaryText}>🖼️ Pick Image from Gallery</Text>
            </TouchableOpacity>

            <Text style={styles.sampleHeader}>Quick Test Document Samples:</Text>
            {SAMPLE_DOCS.map((doc, idx) => (
              <TouchableOpacity key={idx} style={styles.sampleChip} onPress={() => handleScanSampleDoc(doc.file)}>
                <Text style={styles.sampleChipText}>📄 Scan {doc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#003366" />
            <Text style={{ marginTop: 12, color: '#003366', fontWeight: 'bold' }}>Scanning document & extracting text using OCR...</Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleResetScan}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {scanResult ? (
          <View style={styles.resultContainer}>
            {/* Document Type Badge */}
            <View style={styles.docTypeBox}>
              <Text style={styles.docTypeLabel}>Detected Document Type:</Text>
              <Text style={styles.docTypeVal}>✅ {scanResult.documentTypeDetected}</Text>
            </View>

            {/* Extracted Text Review & Edit */}
            <Text style={styles.label}>Review & Edit Extracted Text:</Text>
            <TextInput
              style={styles.textReviewArea}
              multiline
              numberOfLines={8}
              value={editableText}
              onChangeText={setEditableText}
            />

            {/* Matched Scheme Recommendations */}
            {scanResult.matchedSchemes && scanResult.matchedSchemes.length > 0 ? (
              <View style={styles.matchedSection}>
                <Text style={styles.sectionHeader}>🎯 Scheme Eligibility Matches Found ({scanResult.matchedSchemes.length})</Text>
                {scanResult.matchedSchemes.map((match, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.matchCard}
                    onPress={() => navigation.navigate('SchemesTab', { screen: 'SchemeDetail', params: { schemeId: match.schemeId } })}
                  >
                    <View style={styles.matchHeader}>
                      <Text style={styles.matchTitle}>{match.title}</Text>
                      <Text style={styles.matchBadge}>{match.matchConfidence}% Match</Text>
                    </View>
                    <Text style={styles.matchReason}>{match.eligibilityReason}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            <TouchableOpacity style={styles.resetScanBtn} onPress={handleResetScan}>
              <Text style={styles.resetScanText}>Scan Another Document</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OcrScannerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: 20 },
  headerBox: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003366' },
  subtitle: { fontSize: 13, color: '#555', marginTop: 4, textAlign: 'center' },
  scanActionCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#003366', marginBottom: 14 },
  actionBtnPrimary: { backgroundColor: '#003366', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  actionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  actionBtnSecondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#003366', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  actionBtnSecondaryText: { color: '#003366', fontWeight: 'bold', fontSize: 15 },
  sampleHeader: { fontSize: 13, fontWeight: 'bold', color: '#666', marginBottom: 10 },
  sampleChip: { backgroundColor: '#E6F0FA', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#CCE0F5' },
  sampleChipText: { fontSize: 14, color: '#003366', fontWeight: '600' },
  loadingBox: { padding: 30, alignItems: 'center' },
  errorContainer: { backgroundColor: '#FCE8E6', padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  errorText: { color: '#C5221F', fontSize: 14, textAlign: 'center', marginBottom: 10 },
  retryBtn: { backgroundColor: '#003366', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  retryBtnText: { color: '#FFF', fontWeight: 'bold' },
  resultContainer: { marginTop: 10 },
  docTypeBox: { backgroundColor: '#E6F4EA', padding: 14, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#34A853' },
  docTypeLabel: { fontSize: 12, color: '#137333' },
  docTypeVal: { fontSize: 16, fontWeight: 'bold', color: '#137333', marginTop: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  textReviewArea: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, fontSize: 14, color: '#222', textAlignVertical: 'top', minHeight: 140, marginBottom: 20 },
  matchedSection: { marginBottom: 20 },
  matchCard: { backgroundColor: '#FFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#CCE0F5', elevation: 1 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  matchTitle: { fontSize: 15, fontWeight: 'bold', color: '#003366', flex: 1, marginRight: 8 },
  matchBadge: { backgroundColor: '#137333', color: '#FFF', fontWeight: 'bold', fontSize: 11, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  matchReason: { fontSize: 13, color: '#555' },
  resetScanBtn: { backgroundColor: '#555', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  resetScanText: { color: '#FFF', fontWeight: 'bold' }
});
