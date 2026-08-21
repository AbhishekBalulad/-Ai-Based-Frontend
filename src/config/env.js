import { Platform } from 'react-native';

/**
 * Environment & Network Configuration for Mobile Application
 * Note: Android Emulator maps localhost to 10.0.2.2.
 * iOS Simulator maps localhost to 127.0.0.1 or localhost.
 * Physical devices should replace IP with local network IP (e.g., http://192.168.1.100:5000)
 */
export const ENV = {
  API_BASE_URL: Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1',
  TIMEOUT: 15000,
  APP_NAME: 'AI Policy & Job Assistance',
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'mr', name: 'Marathi (मराठी)' }
  ]
};
