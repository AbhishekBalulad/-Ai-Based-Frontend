import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/client';
import { ENV } from '../config/env';

const RegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [state, setState] = useState('All India');
  const [occupation, setOccupation] = useState('General Citizen');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    // Client-side validations
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        preferredLanguage,
        state,
        occupation
      });

      if (response.success && response.data?.token) {
        Alert.alert('Registration Successful', `Welcome, ${response.data.user.name}!`);
        await login(response.data.token, response.data.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBox}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register for AI Government Policy & Scheme Assistance</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Preferred Language</Text>
          <View style={styles.languageContainer}>
            {ENV.SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langChip,
                  preferredLanguage === lang.code && styles.langChipActive
                ]}
                onPress={() => setPreferredLanguage(lang.code)}
              >
                <Text
                  style={[
                    styles.langChipText,
                    preferredLanguage === lang.code && styles.langChipTextActive
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>State of Residence</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Maharashtra, Tamil Nadu, Delhi"
            placeholderTextColor="#888"
            value={state}
            onChangeText={setState}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Farmer, Student, Artisan, Small Business"
            placeholderTextColor="#888"
            value={occupation}
            onChangeText={setOccupation}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Register as Citizen</Text>
          )}
        </TouchableOpacity>

        {navigation ? (
          <TouchableOpacity
            style={styles.loginRedirect}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.redirectText}>
              Already have an account? <Text style={styles.redirectHighlight}>Log In</Text>
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA'
  },
  scrollContent: {
    padding: 24
  },
  headerBox: {
    marginBottom: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366'
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: '#FCE8E6',
    borderWidth: 1,
    borderColor: '#EA4335',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  errorText: {
    color: '#C5221F',
    fontSize: 14
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222'
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#DDD'
  },
  langChipActive: {
    backgroundColor: '#003366',
    borderColor: '#003366'
  },
  langChipText: {
    fontSize: 13,
    color: '#444'
  },
  langChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginRedirect: {
    marginTop: 20,
    alignItems: 'center'
  },
  redirectText: {
    fontSize: 14,
    color: '#555'
  },
  redirectHighlight: {
    color: '#003366',
    fontWeight: 'bold'
  }
});
