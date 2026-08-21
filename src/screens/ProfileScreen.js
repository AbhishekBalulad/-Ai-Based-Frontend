import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react';
import {
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

const ProfileScreen = () => {
  const { logout, setUserInfo } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [state, setState] = useState('All India');
  const [occupation, setOccupation] = useState('General Citizen');
  const [category, setCategory] = useState('General');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users/profile');
      if (response.success && response.data) {
        const user = response.data;
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setPreferredLanguage(user.preferredLanguage || 'en');
        setState(user.state || 'All India');
        setOccupation(user.occupation || 'General Citizen');
        setCategory(user.category || 'General');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty');
      return;
    }

    setUpdating(true);
    setErrorMessage('');

    try {
      const response = await apiClient.put('/users/profile', {
        name: name.trim(),
        phone: phone.trim(),
        preferredLanguage,
        state: state.trim(),
        occupation: occupation.trim(),
        category
      });

      if (response.success && response.data) {
        Alert.alert('Profile Updated', 'Your profile and preferences have been updated successfully!');
        setUserInfo(response.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={{ marginTop: 12, color: '#555' }}>Loading Citizen Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBox}>
          <Text style={styles.title}>Citizen Profile & Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences for scheme customization</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address (Read-only)</Text>
          <TextInput style={[styles.input, styles.inputDisabled]} value={email} editable={false} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="e.g. +91 9876543210" />
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
          <Text style={styles.label}>State / Union Territory</Text>
          <TextInput style={styles.input} value={state} onChangeText={setState} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Occupation / Category</Text>
          <TextInput style={styles.input} value={occupation} onChangeText={setOccupation} />
        </View>

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.buttonDisabled]}
          onPress={handleUpdateProfile}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Secure Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 4,
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
  inputDisabled: {
    backgroundColor: '#EAEAEA',
    color: '#777'
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
  updateButton: {
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
  logoutButton: {
    backgroundColor: '#D93025',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
