import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import TipBoxes from '@/components/TipBoxes';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Wave from "@/components/Wave";
import SearchBar from "@/components/SearchBar";
import { useTheme } from '@/components/ThemeContext';
import Header from '@/components/Header';
import axiosInstance from '@/utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Tip = {
  tips_id: number;
  title: string;
  details: string;
  ytlink: string;
  save_id?: number;
  created_at?: string;
};

const TipsDetails = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme;
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { id } = useLocalSearchParams();
  const [tips, setTips] = useState<Tip[]>([]);
  const [searchData, setSearchData] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const searchKeys = ['title'];

 const prepSearch = async () => {
  if (query.length === 0) return; // Don't load until user types
  
  try {
    const response = await axiosInstance.get(`/allTips`);
    setSearchData(response.data);
  } catch (error) {
    (error);
  }
};

// Call it when user types, not on mount
useEffect(() => {
  if (query.length > 0) {
    prepSearch();
  }
}, [query]);
  const loadMoreTips = useCallback(async (currentPage: number) => {
    if (loading) return;

    setLoading(true);
    try {
      const encodedId = encodeURIComponent(id as string);
      (`[loadMoreTips] 📥 Loading page ${currentPage} for category: ${id}`);
      
      const response = await axiosInstance.get(
        `/gettipsonclick/${encodedId}?limit=20&offset=${currentPage * 20}`
      );

      (`[loadMoreTips] ✅ Received ${response.data.length} tips`);

      if (response.data.length < 20) {
        setHasMore(false);
        ('[loadMoreTips] 🏁 No more tips to load');
      }

      if (response.data.length > 0) {
        setTips(prev => [...prev, ...response.data]);
        setPage(currentPage + 1);
      } else if (currentPage === 0) {
        // No tips found at all
        setHasMore(false);
      }
    } catch (error) {
      console.error('[loadMoreTips] ❌ Error loading tips:', error);
      if (axios.isAxiosError(error)) {
        ( error.response?.status);
        ( error.response?.data);
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [id, loading]);

  // Initial load
  useEffect(() => {
    (id);
    
    // Reset ALL state when category changes
    setTips([]);
    setPage(0);
    setHasMore(true);
    setLoading(false);
    setInitialLoad(true);
    
    // Load first page
    loadMoreTips(0);
    
    // Load search data in background
    prepSearch();
  }, [id]); // Only depend on id

  const handleEndReached = () => {
    if (!loading && hasMore && !initialLoad) {
      (`[handleEndReached] 📥 Loading page ${page}`);
      loadMoreTips(page);
    }
  };

 

  // Render footer (loading indicator)
  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading more tips...
        </Text>
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (initialLoad) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.text} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading tips...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          No tips found for "{id}"
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.text }]}>
          Coming soon!
        </Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: theme.header, flex: 1 }}>
      {/* Fixed Header - Outside FlatList */}
      <Header />
      <View style={styles.wrapper}>
        <SearchBar 
          placeholder="Search Tips..." 
          value={query} 
          data={searchData} 
          searchKeys={searchKeys} 
          onChangeText={setQuery} 
        />
      </View>
      <Wave color="#fff" style={{ height: 100 }} />
      
      {/* Content Area with Background */}
      <View style={{ backgroundColor: theme.background, flex: 1 }}>
        <Text style={[styles.headText, { color: theme.text }]}>
          {id}
        </Text>
        
        <FlatList
          data={tips}
          keyExtractor={(item, index) => `${item.tips_id}-${index}`}
          renderItem={({ item }) => (
            <TipBoxes
              tips_id={item.tips_id}
              title={item.title}
              body={item.details}
              read="Read More"
              ytlink={item.ytlink}
              created_at={item.created_at}
            />
          )}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={
            tips.length === 0 
              ? styles.emptyListContainer 
              : styles.listContainer
          }
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
      </View>
    </View>
  );
};

export default TipsDetails;

const styles = StyleSheet.create({
  headText: {
    fontSize: 33,
    fontWeight: 'bold',
    zIndex: 2,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});