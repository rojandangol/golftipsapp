import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import * as Font from 'expo-font';
import OnboardingFlow from './screens/OnboardingFlow';

// components
import AuthModal from '@/components/AuthModal';
import LoginButton from '@/components/LoginButton';
import { useTheme } from '@/components/ThemeContext';
import { useRouter } from 'expo-router';

// auth
import Login from './auth/login';
// import Signup from './auth/signup';
// import { API_URL } from '@/constants/url'; 
// constants
import { logos } from '@/constants/logos';

// ("alexdebug index called");

// toggle button script
const GolfSwingToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme.mode === 'dark');
  const animValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;



  useEffect(() => {
    // Sync animation with theme changes (if theme changes elsewhere)
    setIsDark(theme.mode === 'dark');
    Animated.timing(animValue, {
      toValue: theme.mode === 'dark' ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
  }, [theme]);

  const onToggle = () => {
    toggleTheme();
  };

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26], // move thumb left/right inside track
  });


  // load fonts
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
        'Open-Sans': require('../assets/fonts/OpenSans-Regular.ttf'),
        'Open-SansLight': require('../assets/fonts/OpenSans-Light.ttf'),
        'Open-SansItalics': require('../assets/fonts/OpenSans-LightItalic.ttf'),

        // add other variants if needed
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a splash screen
  }

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[
        styles.track,
        { backgroundColor: theme.landToggle },
      ]}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]}>
        <Image
          source={isDark ? logos.darkMode : logos.dayMode}
          style={styles.icon}
          resizeMode="contain"
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const IndexScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Golf Swing Theme Toggle */}
      <View style={styles.toggleWrapper}>
        {/* toggle button  */}
        <GolfSwingToggle />
      </View>


      <Image
        source={theme.mode === 'light' ? logos.gLogo : logos.yellowLogo}
        style={styles.image}
        resizeMode="contain"
      />


      <View style={styles.tipContainer}>
        <Text style={[styles.tipTextLarge, { color: theme.text }]}>
          Please enjoy these tips and remember, golf is just a game.
        </Text>
        <Text style={[styles.tipText, { color: theme.text }]}>
          Let's have some fun with it!
        </Text>

      </View>



      <LoginButton
        title="Log In"
        onPress={() => {
          setAuthMode('login');
          setModalVisible(true);
        }}
      />
      <LoginButton
        title="Sign Up"
        onPress={() => {
          setAuthMode('signup');
          setModalVisible(true);
        }}
      />

   {modalVisible && (
  <AuthModal onClose={() => setModalVisible(false)}>
    {authMode === 'login' ? (
      <Login onSuccess={() => setModalVisible(false)} />
    ) : (
      <OnboardingFlow onComplete={() => {
        setModalVisible(false); // Close signup modal
        setAuthMode('login'); // Switch to login mode
        setTimeout(() => {
          setModalVisible(true); // Reopen modal with login screen
        }, 300); // Small delay for smooth transition
      }} />
    )}
  </AuthModal>
)}

    </View >
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  image: {
    width: 125,
    height: 100,
    marginBottom: 30,
    alignSelf: 'center',
  },
  toggleWrapper: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
  },
  tipContainer: {
    marginBottom: 20,
    paddingHorizontal: 25,
    alignItems: 'center',
    gap: 20,

  },
  tipText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 4,
    letterSpacing: 1,
    fontFamily: 'Open-SansItalics',
  },
  tipTextLarge: {
    fontSize: 19,
    textAlign: 'center',
    marginVertical: 4,
    fontFamily: 'Open-SansLight',
    letterSpacing: 2,
  },

});
