import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SchemeFeedScreen from '../screens/SchemeFeedScreen';
import SchemeDetailScreen from '../screens/SchemeDetailScreen';
import AiChatbotScreen from '../screens/AiChatbotScreen';
import OcrScannerScreen from '../screens/OcrScannerScreen';
import JobFeedScreen from '../screens/JobFeedScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VideoExplanationScreen from '../screens/VideoExplanationScreen';
import FeedbackScreen from '../screens/FeedbackScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SchemeStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#003366' }, headerTintColor: '#FFF' }}>
    <Stack.Screen name="HomeFeed" component={HomeScreen} options={{ title: 'Citizen Dashboard' }} />
    <Stack.Screen name="SchemesFeed" component={SchemeFeedScreen} options={{ title: 'Govt Schemes' }} />
    <Stack.Screen name="SchemeDetail" component={SchemeDetailScreen} options={{ title: 'Scheme Details & AI' }} />
    <Stack.Screen name="VideoExp" component={VideoExplanationScreen} options={{ title: 'Video Explanations' }} />
    <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Submit Feedback' }} />
  </Stack.Navigator>
);

const JobStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#003366' }, headerTintColor: '#FFF' }}>
    <Stack.Screen name="JobsFeed" component={JobFeedScreen} options={{ title: 'Verified Jobs' }} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job & Fraud Analysis' }} />
    <Stack.Screen name="SavedJobs" component={SavedJobsScreen} options={{ title: 'Saved Jobs' }} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#003366',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 }
      }}
    >
      <Tab.Screen name="SchemesTab" component={SchemeStack} options={{ tabBarLabel: 'Schemes' }} />
      <Tab.Screen name="ChatbotTab" component={AiChatbotScreen} options={{ tabBarLabel: 'AI Assistant' }} />
      <Tab.Screen name="OcrTab" component={OcrScannerScreen} options={{ tabBarLabel: 'OCR Scan' }} />
      <Tab.Screen name="JobsTab" component={JobStack} options={{ tabBarLabel: 'Jobs' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
