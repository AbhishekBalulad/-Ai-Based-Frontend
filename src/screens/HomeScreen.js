import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome, {userInfo?.name || 'Citizen'}!</Text>
          <Text style={styles.subGreeting}>Preferred Language: {userInfo?.preferredLanguage?.toUpperCase() || 'EN'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Quick Access Modules</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SchemesTab')}>
            <Text style={styles.cardIcon}>📜</Text>
            <Text style={styles.cardTitle}>Govt Schemes</Text>
            <Text style={styles.cardSub}>Direct APIs & Simplification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChatbotTab')}>
            <Text style={styles.cardIcon}>🤖</Text>
            <Text style={styles.cardTitle}>AI Chatbot</Text>
            <Text style={styles.cardSub}>Ask Policy Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OcrTab')}>
            <Text style={styles.cardIcon}>📷</Text>
            <Text style={styles.cardTitle}>OCR Scanner</Text>
            <Text style={styles.cardSub}>Scan Documents</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('JobsTab')}>
            <Text style={styles.cardIcon}>💼</Text>
            <Text style={styles.cardTitle}>Job Portal</Text>
            <Text style={styles.cardSub}>Jobs & Fraud Analysis</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>AI Features</Text>

        <TouchableOpacity style={styles.bannerCard} onPress={() => navigation.navigate('VideoExp')}>
          <Text style={styles.bannerIcon}>🎬</Text>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Video Explanations</Text>
            <Text style={styles.bannerSub}>Watch simple visual scheme guides</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bannerCard} onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.bannerIcon}>⭐</Text>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Submit Feedback</Text>
            <Text style={styles.bannerSub}>Rate policies, AI & translations</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 20 },
  header: { backgroundColor: '#003366', padding: 20, borderRadius: 12, marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  subGreeting: { fontSize: 13, color: '#FFCC00', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  card: { backgroundColor: '#FFF', width: '48%', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0', elevation: 2 },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
  cardSub: { fontSize: 12, color: '#666', marginTop: 4 },
  bannerCard: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  bannerIcon: { fontSize: 32, marginRight: 16 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
  bannerSub: { fontSize: 13, color: '#666', marginTop: 2 }
});
