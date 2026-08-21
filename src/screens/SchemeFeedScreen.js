import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal
} from 'react-native';
import apiClient from '../api/client';

const CATEGORIES = ['All', 'Agriculture', 'Healthcare', 'Housing', 'Financial Support', 'Employment', 'Education'];

const SchemeFeedScreen = ({ navigation }) => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const params = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (selectedState !== 'All India') {
        params.state = selectedState;
      }

      const response = await apiClient.get('/schemes', { params });
      if (response.success && response.data) {
        setSchemes(response.data.schemes || []);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch government schemes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedState]);

  const handleSearchSubmit = () => {
    fetchSchemes();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All India');
    setFilterModalVisible(false);
  };

  const renderSchemeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SchemeDetail', { schemeId: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.categoryBadge}>{item.category || 'General'}</Text>
        <Text style={styles.stateTag}>📍 {item.state || 'All India'}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={3}>
        {item.simplifiedSummary || item.rawDescription}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.officialUrlText} numberOfLines={1}>
          🔗 {item.officialSourceUrl}
        </Text>
        <Text style={styles.viewMoreText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header Bar */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, eligibility, or benefit..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterIconButton} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterIconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Category Horizontal Filter Chips */}
      <View style={styles.chipWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCategory === item && styles.chipActive
              ]}
              onPress={() => {
                setSelectedCategory(item);
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item && styles.chipTextActive
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Active Filter Bar Info */}
      {selectedCategory !== 'All' || selectedState !== 'All India' || searchQuery.trim() !== '' ? (
        <View style={styles.activeFilterBar}>
          <Text style={styles.activeFilterText}>
            Filters: {selectedCategory} | {selectedState} {searchQuery ? `| "${searchQuery}"` : ''}
          </Text>
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.resetFilterText}>Reset All</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Content Feed */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={{ marginTop: 10, color: '#666' }}>Filtering official government schemes...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSchemes}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={schemes}
          keyExtractor={(item) => item._id}
          renderItem={renderSchemeCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchSchemes();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Schemes Found</Text>
              <Text style={styles.emptySub}>No government schemes match the selected filters.</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Advanced Scheme Filters</Text>

            <Text style={styles.modalLabel}>Category</Text>
            <View style={styles.modalOptionsRow}>
              {CATEGORIES.slice(0, 4).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.modalOption, selectedCategory === cat && styles.modalOptionActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.modalOptionText, selectedCategory === cat && styles.modalOptionTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={() => { setFilterModalVisible(false); fetchSchemes(); }}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SchemeFeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  searchBox: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E0E0E0', alignItems: 'center' },
  searchInput: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#222' },
  searchButton: { backgroundColor: '#003366', marginLeft: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  searchButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  filterIconButton: { marginLeft: 8, padding: 8, backgroundColor: '#EAEAEA', borderRadius: 8 },
  filterIconText: { fontSize: 16 },
  chipWrapper: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#EAEAEA', marginRight: 8, borderWidth: 1, borderColor: '#DDD' },
  chipActive: { backgroundColor: '#003366', borderColor: '#003366' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  activeFilterBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#E6F0FA', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#CCE0F5' },
  activeFilterText: { fontSize: 12, color: '#003366', fontWeight: '600' },
  resetFilterText: { fontSize: 12, color: '#D93025', fontWeight: 'bold' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E5E5E5', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: '#E6F0FA', color: '#003366', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  stateTag: { fontSize: 12, color: '#555', fontWeight: '600' },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#111', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F0F0F0', paddingTop: 10 },
  officialUrlText: { fontSize: 12, color: '#003366', flex: 1, marginRight: 10 },
  viewMoreText: { fontSize: 13, fontWeight: 'bold', color: '#003366' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorContainer: { padding: 20, alignItems: 'center' },
  errorText: { color: '#C5221F', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  retryButton: { backgroundColor: '#003366', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  retryText: { color: '#FFF', fontWeight: 'bold' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#444' },
  emptySub: { fontSize: 13, color: '#777', textAlign: 'center', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 16 },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  modalOptionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  modalOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#EAEAEA', borderWidth: 1, borderColor: '#DDD' },
  modalOptionActive: { backgroundColor: '#003366', borderColor: '#003366' },
  modalOptionText: { fontSize: 13, color: '#444' },
  modalOptionTextActive: { color: '#FFF', fontWeight: 'bold' },
  applyButton: { backgroundColor: '#003366', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  applyButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  cancelButton: { paddingVertical: 10, alignItems: 'center' },
  cancelButtonText: { color: '#777', fontSize: 14 }
});
