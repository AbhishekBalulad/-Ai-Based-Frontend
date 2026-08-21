import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { ENV } from '../config/env';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      <Text style={styles.logoText}>🏛️ AI Gov Assistant</Text>
      <Text style={styles.appTitle}>{ENV.APP_NAME}</Text>
      <Text style={styles.subtitle}>Empowering Citizens with Simplified Schemes & Verified Jobs</Text>
      <ActivityIndicator size="large" color="#FFCC00" style={styles.loader} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  logoText: {
    fontSize: 48,
    marginBottom: 16
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#FFCC00',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  loader: {
    marginTop: 32
  }
});
