import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'; 
import BookmarkSaveIcon from "@/components/BookmarkSaveIcon";
import axios from 'axios';
import { images } from '@/constants/images';
import axiosInstance from '@/utils/axiosInstance';
import * as Speech from 'expo-speech';
import { useTheme } from '@/components/ThemeContext';
import * as Haptics from 'expo-haptics';

//getting userid from context
import { useUser } from '@/context/useridcontext';

//Youtube player from: https://www.npmjs.com/package/react-native-youtube-iframe 
import YoutubePlayer from "react-native-youtube-iframe"

// import { API_URL } from '@/constants/url';

const TipBoxes = (props: any) => {

  const { theme } = useTheme();

  // --- Text-to-Speech State ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // ----------------------------
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  //set is as false at first
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const { user_id } = useUser();


  useEffect(() => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    friction: 8,
    tension: 40,
    useNativeDriver: true
  }).start();
}, []);
  // --- Text-to-Speech Functions ---


  const isNewTip = () => {
    if (!props.created_at) return false; // If no created_at field, not new

    const createdDate = new Date(props.created_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7; // Returns true if uploaded within 7 days
  };


  const getTipContent = () => {
    // Combine title and body for the speech content
    return `${props.title}. ${props.body}`;
  };

  const speakTip = () => {
    const content = getTipContent();
    Speech.stop(); // Stop any currently speaking tip

    Speech.speak(content, {
      language: 'en-US',
      rate: 0.9,      // Slightly slower than default 1.0
      pitch: 0.85,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onDone: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: (e) => {
        console.error('Speech error:', e);
        setIsSpeaking(false);
        setIsPaused(false);
      },
    });
  };

  const pauseSpeech = () => {
    if (isSpeaking && !isPaused) {
      Speech.pause(); // Note: This feature is less reliable on Android
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (isPaused) {
      Speech.resume(); // Note: This feature is less reliable on Android
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // --- End Text-to-Speech Functions ---

  const handleSavetips = async (onSaveSuccess?: () => void) => {

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    (props)


    if (!props.tips_id) {
      Alert.alert('Error', 'Tip ID is missing');
      return;
    }

    try {
      const res = await axiosInstance.post(`/saveTips`, {
        tips_id: props.tips_id
      });
      if (res.data.alreadySaved) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Already Saved', 'You have already saved this tip!');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Tip saved successfully!');
        // Call the callback to refresh saved tips
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }
    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error.response?.status === 400) {
        Alert.alert('Already Saved', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to save tip');
      }
    }
  };

  // Function to extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string | null | undefined) => { // Added type
    if (!url) return null;

    // Clean whitespace
    url = url.trim();

    const regex =
      /(?:v=|\/embed\/|\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regex);
    return match ? match[1] : null;
  };


  const videoId = getYoutubeVideoId(props.ytlink);

 return (
  <Animated.View style={[styles.view, { transform: [{ scale: scaleAnim }] }]}>

      {isNewTip() && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}

      {videoId ? (
        <View>
          <YoutubePlayer
            height={170}
            play={false}
            videoId={videoId}
            webViewProps={{
              allowsFullscreenVideo: true,  // ✅ Enables fullscreen
            }}
            // Restrict YouTube branding/navigation while keeping fullscreen:
            modestbranding={true}   // Removes YouTube logo from control bar
            rel={false}             // No related videos at the end
            controls={true}
          />
        </View>
      ) : null}
      {props.viewRemove && (
        <TouchableOpacity onPress={() => {
          props.onRemove(props.save_id)
          if (props.onRemoveSuccess) {
            props.onRemoveSuccess();
          }

        }}>
          <Image
            source={images.removeButton}
            style={[styles.icons, { width: 24, height: 24 }]} // Required: set width and height

          />
        </TouchableOpacity>
      )}

      {/* --- Text-to-Speech Controls Section --- */}
      <View style={styles.controlRow}>


        {/* <TouchableOpacity
          onPress={handleSavetips}
          activeOpacity={0.7}
          // The style is changed to use controlButtonContainer for proper alignment
          style={styles.controlButtonContainer} 
        > */}
        <TouchableOpacity
          onPress={() => handleSavetips(props.onSaveSuccess)}
          activeOpacity={0.7}
          style={styles.controlButtonContainer}
        >
          <BookmarkSaveIcon
            size={54}
            backgroundColor="#F0E5C3"
            iconColor="#00695B"
            strokeColor="#00695B"
          />
        </TouchableOpacity>

        {/* Text to Speech Button (Speaker Icon) */}
        <TouchableOpacity
          onPress={isSpeaking && !isPaused ? stopSpeech : speakTip}
          activeOpacity={0.7}
          style={[styles.controlButtonContainer, styles.speechButton]}
        >
          {/* Choose the appropriate icon based on status */}
          {/* You'll need an icon here. For simplicity, I'm using a Text for now. 
              **Highly recommend using a custom SVG or an icon library like @expo/vector-icons** */}
          <Text style={styles.speechIconText}>
            {/* If speaking and not paused, show a Stop/Pause icon/text. Otherwise, show Play/Speaker icon/text */}
            {isSpeaking && !isPaused ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* --- End Text-to-Speech Controls Section --- */}

      {/* --- Pause/Resume/Stop Buttons (Conditional) --- */}
      {/* Show these only while a tip is actively being read */}
      {isSpeaking && (
        <View style={styles.speechControlsInline}>
          {isPaused ? (
            <TouchableOpacity onPress={resumeSpeech} style={styles.speechButtonSmall}>
              <Text style={styles.speechButtonText}>Resume</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pauseSpeech} style={styles.speechButtonSmall}>
              <Text style={styles.speechButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={stopSpeech} style={[styles.speechButtonSmall, { backgroundColor: '#CC4444' }]}>
            <Text style={styles.speechButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}


      <Text style={styles.title}>{props.title}</Text>

      <Text style={styles.body}>
        {/* if expanded, only show 120 character, then show all of them */}
        {expanded ? props.body : props.body.slice(0, 120) + (props.body.length > 120 ? '...' : '')}
      </Text>

      {/* when you press on it, it de-expands, and then shows Show Less. */}
      {props.body.length > 120 && (
        <TouchableOpacity onPress={toggleExpand}>
          <Text style={styles.read}>

            {/* condition ? doIfTrue : doIfFalse */}
            {expanded ? "Show Less" : props.read}
          </Text>
        </TouchableOpacity>
      )}

      {/* Remove button */}
    </Animated.View>
  )
};

export default TipBoxes;

const styles = StyleSheet.create({
  view: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '5%',
    marginBottom: 16,
    padding: 24,
    borderRadius: 20,
    boxShadow: '8px 8px 0px 1px #918566',
    backgroundColor: '#e6dcc2',
    position: 'relative',
  },

  // --- NEW Badge Styles ---
  newBadge: {
    position: 'absolute',
    top: -10,
    right: 0,
    backgroundColor: '#FF6B35', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10, // Ensure it appears above other elements
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  icons: {
    position: 'relative',
    top: '55%',
    left: '8%',
    width: 24,
    height: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
     lineHeight: 32,
  letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
     letterSpacing: 0.2,
  fontWeight: '400',
  },
  // --- New Text-to-Speech Styles ---
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns children (bookmark and speech) to the right
    marginBottom: 10,
    marginTop: -20, // Pull the buttons up slightly
  },
  controlButtonContainer: {
    marginLeft: 10,
  },
  speechButton: {
    backgroundColor: '#00695B',
    borderRadius: 50,
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9.75,
    marginRight: 5,
  },
  speechIconText: {
    fontSize: 16,
    color: '#F0E5C3',
  },
  speechControlsInline: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginTop: -5,
  },
  speechButtonSmall: {
    backgroundColor: '#00695B',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 10,
  },
  speechButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // --- Existing Styles ---
  // The original bookmarkButton style is now redundant/replaced by controlButtonContainer
  // bookmarkButton: { 
  //   position: 'relative',
  //   left: '80%',
  // },
  read: {
    fontSize: 15,
    color: '#0066CC', // Make the "Read More" look clickable
    marginTop: 8,
    fontWeight: 'bold'
  },
  readToggle: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0066CC', // Or theme.buttonText if needed
  },


});