import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import apiClient from '../api/client';

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'AI_ASSISTANT',
  text: 'Namaste! I am your AI Government Policy & Scheme Assistant. Ask me anything about welfare benefits, eligibility, required documents, or application procedures!',
  citations: []
};

const AiChatbotScreen = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const handleSendMessage = async () => {
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion.trim();
    const userMsgObj = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: userText,
      citations: []
    };

    setMessages(prev => [...prev, userMsgObj]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', {
        question: userText,
        conversationId
      });

      if (response.success && response.data) {
        const { aiMessage, citations, conversationId: newConvId } = response.data;
        if (newConvId) setConversationId(newConvId);

        const aiMsgObj = {
          id: aiMessage._id || `ai-${Date.now()}`,
          sender: 'AI_ASSISTANT',
          text: aiMessage.messageText,
          citations: citations || []
        };

        setMessages(prev => [...prev, aiMsgObj]);
      }
    } catch (err) {
      const errorMsgObj = {
        id: `err-${Date.now()}`,
        sender: 'AI_ASSISTANT',
        text: '⚠️ Unable to connect to AI assistant. Please verify your internet connection or search on official portal https://www.myscheme.gov.in/',
        citations: []
      };
      setMessages(prev => [...prev, errorMsgObj]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCitationUrl = (url) => {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open link'));
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setConversationId(null);
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'USER';
    return (
      <View style={[styles.msgWrapper, isUser ? styles.msgWrapperUser : styles.msgWrapperAi]}>
        <View style={[styles.msgBubble, isUser ? styles.msgBubbleUser : styles.msgBubbleAi]}>
          <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextAi]}>
            {item.text}
          </Text>

          {item.citations && item.citations.length > 0 ? (
            <View style={styles.citationsContainer}>
              <Text style={styles.citationHeader}>Official Citations:</Text>
              {item.citations.map((cite, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleOpenCitationUrl(cite.url)}>
                  <Text style={styles.citationLink}>🔗 {cite.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Scheme Assistant</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearChat}>
          <Text style={styles.clearButtonText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
        />

        {loading ? (
          <View style={styles.thinkingBox}>
            <ActivityIndicator size="small" color="#003366" />
            <Text style={styles.thinkingText}>Searching official schemes & generating answer...</Text>
          </View>
        ) : null}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask e.g. What is PM Kisan scheme eligibility?"
            placeholderTextColor="#777"
            value={inputQuestion}
            onChangeText={setInputQuestion}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputQuestion.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputQuestion.trim() || loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiChatbotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { backgroundColor: '#003366', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  clearButton: { backgroundColor: '#FFCC00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  clearButtonText: { color: '#003366', fontWeight: 'bold', fontSize: 12 },
  chatArea: { flex: 1 },
  listContent: { padding: 16 },
  msgWrapper: { marginBottom: 14, flexDirection: 'row' },
  msgWrapperUser: { justifyContent: 'flex-end' },
  msgWrapperAi: { justifyContent: 'flex-start' },
  msgBubble: { maxWidth: '85%', padding: 14, borderRadius: 12 },
  msgBubbleUser: { backgroundColor: '#003366', borderBottomRightRadius: 2 },
  msgBubbleAi: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 15, lineHeight: 22 },
  msgTextUser: { color: '#FFFFFF' },
  msgTextAi: { color: '#222222' },
  citationsContainer: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderColor: '#EAEAEA' },
  citationHeader: { fontSize: 12, fontWeight: 'bold', color: '#137333', marginBottom: 4 },
  citationLink: { fontSize: 12, color: '#003366', textDecorationLine: 'underline', marginTop: 2 },
  thinkingBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#E6F0FA' },
  thinkingText: { marginLeft: 8, fontSize: 13, color: '#003366' },
  inputBar: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#E0E0E0', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#222' },
  sendButton: { backgroundColor: '#003366', marginLeft: 8, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8 },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});
