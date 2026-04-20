import React, { useEffect, useState, useCallback } from "react";
import FirstLoginTour from '@/components/FirstLoginTour';
import { useFirstLoginTour } from '@/hooks/useFirstLoginTour';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import Wave from "@/components/Wave";
import SearchBar from "@/components/SearchBar";
import { useTheme } from "@/components/ThemeContext";
import TipBoxes from "@/components/TipBoxes";
import { useUser } from "@/context/useridcontext";
import { useFocusEffect } from '@react-navigation/native';
import Header from "@/components/Header";
import { API_URL } from '@/constants/url';
import axiosInstance from '@/utils/axiosInstance';
import SkeletonLoader from '@/components/SkeletonLoader';

type Tip = {
  tips_id: number;
  title: string;
  details: string;
  ytlink: string;
  save_id?: number;
  created_at?: string;
};

// ✅ Dynamic Calendar Icon Component
const DynamicCalendarIcon = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <View style={styles.calendarIcon}>
      <View style={styles.calendarTop}>
        <Text style={styles.calendarMonth}>{month}</Text>
      </View>
      <View style={styles.calendarBottom}>
        <Text style={styles.calendarDay}>{day}</Text>
      </View>
    </View>
  );
};

export default function Index() {
  const router = useRouter();
  const { showTourParam } = useLocalSearchParams();
  const { user_id } = useUser();
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [savedTips, setSavedTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dailyTip, setDailyTip] = useState<Tip | null>(null);
  const [forceTour, setForceTour] = useState(false);
  const { showTour, completeTour, skipTour, isChecking } = useFirstLoginTour();

  useEffect(() => {
    if (showTourParam === 'true') {
      setForceTour(true);
    }
  }, [showTourParam, isCheckingAuth]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const loadDailyTip = async (allTips: Tip[]) => {
    try {
      const today = getTodayDate();
      const storedDate = await AsyncStorage.getItem('dailyTipDate');
      const storedTip = await AsyncStorage.getItem('dailyTip');

      if (storedDate === today && storedTip) {
        const tip = JSON.parse(storedTip);
       
        setDailyTip(tip);
      } else {
        if (allTips.length === 0) {
          ('⚠️ No tips available for daily tip');
          return;
        }

        const randomIndex = Math.floor(Math.random() * allTips.length);
        const newTip = allTips[randomIndex];

       

        await AsyncStorage.multiSet([
          ['dailyTipDate', today],
          ['dailyTip', JSON.stringify(newTip)]
        ]);

        setDailyTip(newTip);
      }
    } catch (error) {
      console.error('Error loading daily tip:', error);
    }
  };

  const prepSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/allTips');

      if (response.data.length === 0) {
        Alert.alert('No Tips', 'No tips found');
      } else {
        setSearchData(response.data);
        await loadDailyTip(response.data);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      Alert.alert('Error', 'Unable to load tips');
    } finally {
      setIsLoading(false);
    }
  };

  const searchKeys = ['title', 'type'];

  useEffect(() => {
    if (!user_id) {
      router.replace('/');
    } else {
      setIsCheckingAuth(false);
    }
  }, [user_id]);

  useEffect(() => {
    prepSearch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedTips = async () => {
        setIsSavedLoading(true);
        try {
          const response = await axiosInstance.get(`/retrieveSavedTips/${user_id}`);
          setSavedTips(response.data);
          // if (response.data.length === 0) {
          //   Alert.alert('No Saved Tips', 'You do not have any saved tips. Go save some tips!', [{ text: 'OK' }]);
          // }
        } catch (error) {
          console.error('Error fetching saved tips:', error);
          Alert.alert('Error', 'Unable to load saved tips');
        } finally {
          setIsSavedLoading(false);
        }
      };
      fetchSavedTips();
    }, [user_id])
  );

  if (isCheckingAuth || !user_id) {
    return null;
  }


  const handleRemove = (save_id: number, onRemoveSuccess?: () => void) => {
    Alert.alert(
      'Confirm Remove',
      'Are you sure you want to remove this saved tip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await axiosInstance.delete(`/removeSavedTips/${save_id}`);
              // Call the callback to refresh immediately
              if (onRemoveSuccess) {
                onRemoveSuccess();
              }
            } catch (err) {
              console.error('Delete error:', err);
              if (axios.isAxiosError(err) && err.response?.status === 404) {
                Alert.alert('Error', 'Saved tip not found or not authorized');
              } else {
                Alert.alert('Error', 'Could not remove saved tip');
              }
            }
          },
        },
      ]
    );
  };

  const renderDailyTip = () => {
    if (!dailyTip) {
      return <Text style={{ textAlign: 'center', padding: 20 }}>Loading Tip of the Day...</Text>;
    }

    const refreshSavedTips = async () => {
      try {
        const response = await axiosInstance.get(`/retrieveSavedTips/${user_id}`);
        setSavedTips(response.data);
      } catch (error) {
        console.error('Error refreshing saved tips:', error);
      }
    };

    return (
      <TipBoxes
        key={dailyTip.tips_id}
        tips_id={dailyTip.tips_id}
        title={dailyTip.title}
        body={dailyTip.details}
        read="Read More"
        ytlink={dailyTip.ytlink}
        created_at={dailyTip.created_at}
        viewRemove={false}
        onSaveSuccess={refreshSavedTips}
      />
    );
  };

  return (
    <>
      <FirstLoginTour
        visible={showTour || forceTour}
        onComplete={async () => { await completeTour(); setForceTour(false); }}
        onSkip={async () => { await skipTour(); setForceTour(false); }}
      />
      <View style={{ backgroundColor: theme.header, flex: 1 }}>
        <Header />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.wrapper} className="p-[20px]">
            <SearchBar
              placeholder="Search Tips..."
              value={query}
              data={searchData}
              searchKeys={searchKeys}
              onChangeText={setQuery}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, justifyContent: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: '700', letterSpacing:-0.5,marginBottom:6, color: theme.text }}>
              Tip of the Day
            </Text>
            <DynamicCalendarIcon />
          </View>

          {isLoading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>) : (renderDailyTip())}

          <Wave color="#fff" style={{ height: 90 }} />

          <View style={[styles.container, { backgroundColor: theme.background }]}>
          </View>

          <View style={{ backgroundColor: theme.background, paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center' }}>
              <Text style={{ fontSize: 40, fontWeight: '700', letterSpacing:-0.5,marginBottom:6, color: theme.text }}>Saved Tips</Text>
            </View>
            {isSavedLoading ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : savedTips.length === 0 ? (
              <Text style={{ textAlign: 'center', padding: 20, color: theme.text }}>You have no saved tips. Go save some tips!
              </Text>
            )

              : (
                <View>
                  {savedTips.map((tip, index) => (
                    <TipBoxes
                      key={index}
                      tips_id={tip.tips_id}
                      title={tip.title}
                      body={tip.details}
                      read="Read More"
                      ytlink={tip.ytlink}
                      created_at={tip.created_at}
                      save_id={tip.save_id}
                      viewRemove={true}
                      onRemove={(save_id) => handleRemove(save_id, async () => {
                        try {
                          const res = await axiosInstance.get(`/retrieveSavedTips/${user_id}`);
                          setSavedTips(res.data);
                        } catch (error) {
                          console.error('Error refreshing saved tips:', error);
                        }
                      })}
                      onRemoveSuccess={async () => {
                        try {
                          const res = await axiosInstance.get(`/retrieveSavedTips/${user_id}`);
                          setSavedTips(res.data);
                        } catch (error) {
                          console.error('Error refreshing saved tips:', error);
                        }
                      }}
                    />
                  ))}
                </View>
              )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 20,
    padding: 10,
  },
  // ✅ Calendar Icon Styles
  calendarIcon: {
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    // borderColor: '#4c669f',
    borderColor: '#000',
    backgroundColor: 'white',
  },
  calendarTop: {
    // backgroundColor: '#4c669f',
    backgroundColor: '#000',
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonth: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  calendarBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  calendarDay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});

