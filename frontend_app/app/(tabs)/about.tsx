import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Card, Button, TextInput } from 'react-native-paper';
import Accordion from '@/components/Accordion';
import { images } from '@/constants/images';
import Header from '@/components/Header';
import axios from 'axios';
import { useTheme } from '@/components/ThemeContext';
import { API_URL } from '@/constants/url';
import axiosInstance from '@/utils/axiosInstance';

const About = () => {
  const { theme } = useTheme();
  const [donationAmount, setDonationAmount] = useState('');
  const [expanded, setExpanded] = useState(false);
  

  const longAboutText = ` This is a collection of golf tips I have written for five newspapers over a fourteen-year period. Some of these tips were used during my four years of weekly golf tips on FOX 35 television. I do not believe there is one original tip of mine included in any of the 120+ tips designed for the Weekend Warriors. 
  These tips were written from my perspective given the limitation of word counts by the different newspapers and the time limitations of the television tips.
 A valuable lesson I learned from Jim Flick is it is better to know just 100 tips for golf and be able to explain them all 10 different ways than to know 1,000 tips for golf and only being able to explain the one way. I hope this book gives you some more perspectives to understanding golf.
  My goal with this book is to help the Weekend Warrior. I do not want to fill your head with one hundred swing thoughts, rather help you play smarter golf. I caddied for my college roommate, John Morrison, in his men’s club 5th flight with a 15+ handicap. 
  I did not ask him to change his swing, just let me give him better choices of shots (within his ability) during his round. My 15+ handicapper shot 78! This is my goal to help you play better, Patrick with less fear, and with more fun.
  This publication, with apps for videos and audios, was the production by my team of software engineers at Whitworth University: Temuulen Amarjargul, Katrina Costales, Rojan Dangol, Ava Dennis, Matthew Kaczmarek, and Ron Schwencer.
  I wish to thank my friends and mentors who have given me great teaching insights and examples. My first mentor and hero is my cousin Larry Anderson. 
  Many thanks to Laird Small of Pebble Beach Golf Academy, Jim Flick and the Nicklaus Staff, Patrick Larkin, Fred Shoemaker, Scott Krause, Paul Wilcox, and Tim Morton. 
  Thanks to the Pinnacle, Hollister Freelance, Salinas Californian, Gilroy Dispatch, and the Morgan Hill Times newspapers for the opportunity to write weekly tips and columns. 
  Thank you RJ Harper for everything. Thanks to Sport Psychologists David L. Smith for your mental game insights. 
  Thanks to my friends and family, Whitworth University friends, and fellow PGA Members for giving me the cofidence to apply myself to challenging opportunities. 
  Finally, thanks to Mike Jacoby of KRML and KSCO for great jazz and golf talk.
  Finally, I wish to dedicate this book to my wife Debi and son Luke for all their support.

Please enjoy these tips and remember, golf is just a game. Lets have some fun with it!
  `;

  const toggleExpand = () => setExpanded(!expanded);


  return (
    <View style={[styles.container, { backgroundColor: theme.container }]}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <Card style={styles.card}>
          <Card.Cover source={images.golfCourse} style={styles.coverImage} />
        </Card>

        <Accordion title="About Us">
          <View style={[styles.aboutContainer, { backgroundColor: theme.input }]}>
            <Image source={images.team} style={styles.aboutImageTop} resizeMode="cover" />
            <View style={styles.aboutTextBox}>
              <Text style={[styles.aboutTitle, { color: theme.inputText }]}>Weekend Warriors</Text>
              <Text style={[styles.aboutBody, { color: theme.inputText }]}>
                A community of casual golfers playing for joy, camaraderie, and personal growth.
              </Text>
            </View>
          </View>

          <View style={[styles.aboutContainer, { backgroundColor: theme.input }]}>
            <Image source={images.redTeam} style={styles.aboutImageTop} resizeMode="cover" />
            <View style={styles.aboutTextBox}>
              <Text style={[styles.aboutTitle, { color: theme.inputText }]}>Golf Tips Book Intro</Text>
              <Text style={[styles.aboutBody, { color: theme.inputText }]}>
                {expanded ? longAboutText : `${longAboutText.slice(0, 300)}...`}
              </Text>
              {longAboutText.length > 300 && (
                <Text onPress={toggleExpand} style={styles.readToggle}>
                  {expanded ? 'Show Less' : 'Read More'}
                </Text>
              )}
            </View>
          </View>
        </Accordion>



        <Accordion title="Contact Us">
        <Text style={{ color: 'black' , textAlign: 'center', backgroundColor: theme.input, padding: 10, borderRadius: 8}}>
           If you have any questions, feedback, or suggestions, please reach out to us at: support@weekendwarriorgolf.golf
          </Text>

        </Accordion>


        <View style={{ height: 500 }} />
      </ScrollView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 100,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverImage: {
    height: 160,
    resizeMode: 'cover',
  },
  input: {
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  aboutContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  aboutImageTop: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  aboutTextBox: {
    padding: 12,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  aboutBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  readToggle: {
    fontWeight: 'bold',
    marginTop: 6,
    color: '#0066CC',
  },
});