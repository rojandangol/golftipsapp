import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import TipCategories from "@/components/TipCategories";
import { clubs } from "@/constants/clubs";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Wave from "@/components/Wave";
import SearchBar from "@/components/SearchBar";
import logoImage from "@/assets/logos/weekend-warrior-logo-green.png"
import { useTheme } from '@/components/ThemeContext';
import { ThemeProvider } from '@/components/ThemeContext';
import axios from "axios";
import { API_URL } from '@/constants/url';
import axiosInstance from "@/utils/axiosInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';

const explore = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchData, setSearchData] = useState([]); // state to hold search data
  const componentsData = [
    { title: "Address Position", club: clubs.addresspositionclub },
    { title: "Bunker Play", club: clubs.bunkersclub },
    { title: "Chipping", club: clubs.chippingclub },
    { title: "Cold Weather", club: clubs.coldweatherclub },
    { title: "Driver", club: clubs.driversclub },
    { title: "Equipment", club: clubs.equipmentclub },
    { title: "Fairway Woods and Hybrids", club: clubs.fairwoodclub },
    { title: "Full Swing", club: clubs.fullswingclub },
    { title: "Game Management", club: clubs.gamemanagementclub },
    { title: "Putting", club: clubs.puttingclub },
    { title: "Trouble Shots", club: clubs.troubleshotclub },
    { title: "Irons", club: clubs.ironsclub },
  ];
  const searchKeys = ['title', 'type'];

const prepSearch = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      ('No auth token found, user needs to login');
      return;
    }

  
    
    const response = await axiosInstance.get(`/allTips`);
    
  
    
    if (response.data.length === 0) {
      ("No tips found");
    } else {
      (`📝 Found ${response.data.length} tips`);
      setSearchData(response.data);
    }
  } catch (error) {
   

    if (axios.isAxiosError(error)) {
     
      // Check specific error responses
      if (error.response?.status === 400) {
        ('⚠️ 400 Bad Request - Check server logs for details');
        alert(`Bad Request: ${JSON.stringify(error.response.data)}`);
      } else if (error.response?.status !== 401 && error.response?.status !== 403) {
        alert("Something went wrong fetching tips");
      }
    } else {
      ( error);
      alert("Something went wrong fetching tips");
    }
  }
};
    useEffect(() => {
      prepSearch();
    }, []);


    return (
      <View style={{ backgroundColor: theme.header }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}>
          <Header />
          <View style={{ flex: 1, backgroundColor: theme.header }} className="position: relative overflow-auto">
            <View style={styles.wrapper} className="p-[20px]">
              <SearchBar placeholder="Search Tips..." value={query} data={searchData} searchKeys={searchKeys} onChangeText={setQuery} />
            </View>
            <Wave color="#fff" style={{ height: 100 }} />

            <View style={{ backgroundColor: theme.background }}>
              <Text style={{ fontSize: 40, alignSelf: "center", fontWeight: "bold", marginTop: 40, color: theme.text }}>
                Explore Tips
              </Text>
              <ThemeProvider>
                {/* maps all titles together and cycles through to post to app */}
                {componentsData.map((data, index) => (
                  <TipCategories key={index} {...data} />
                ))}
              </ThemeProvider>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };
  export default explore;

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20
    },
  });


