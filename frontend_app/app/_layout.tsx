import { StatusBar, SafeAreaView } from "react-native";
import { Stack, useSegments, useRouter } from "expo-router";
import { ThemeProvider } from "@/components/ThemeContext";
import "./globals.css";
import { UserProvider } from "@/context/useridcontext";
import { GlobalIntegerProvider } from "@/components/FontSize";
import { useUser } from "@/context/useridcontext";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useActivityTracker } from "@/utils/useActivityTracker"; // ✅ Import activity tracker

function RootLayoutNav() {
  const { user_id, setUserId } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasShownAlert = useRef(false);

  // ✅ Initialize activity tracker (only when user is logged in)
  const { updateActivity } = useActivityTracker();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('authToken');
        const tokenExpiry = await AsyncStorage.getItem('tokenExpiry');

        if (storedUserId && storedToken && tokenExpiry) {
          const expiryDate = new Date(tokenExpiry);
          const now = new Date();

          if (expiryDate > now) {
            ('✅ Token valid');
            setUserId(storedUserId);
            hasShownAlert.current = false;

            if (segments[0] === 'auth' || !segments[0]) {
              router.replace('/(tabs)');
            }
          } else {
            ('🕒 Token expired - logging out');

            await AsyncStorage.multiRemove(['userId', 'authToken', 'tokenExpiry', 'rememberMe']);
            setUserId(null);
            hasShownAlert.current = false;

            // Silent redirect - just like Instagram
            router.replace('/auth/login');
          }
        } else {
          ('❌ No token found');
          setUserId(null);

          if (segments[0] !== 'auth' && segments[0] !== undefined) {
            router.replace('/auth/login');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUserId(null);
        router.replace('/auth/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      ('⏰ Periodic token check...');
      checkAuth();
    }, 300000); // ✅ Changed to 30 seconds for faster detection

    return () => clearInterval(interval);
  }, [segments]);

  // ✅ Track activity on navigation changes
  useEffect(() => {
    if (user_id) {
      updateActivity();
    }
  }, [segments, user_id]);

  if (isChecking) {
    ('🔄 Checking auth...');
    return null;
  }

  if (!user_id) {
    ('🚪 No user_id - should show login');
  }

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          gestureEnabled: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="tips/[id]"
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="(sidebar)"
        options={{
          gestureEnabled: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          gestureEnabled: false,
          animation: 'none',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GlobalIntegerProvider>
      <UserProvider>
        <ThemeProvider>
          <StatusBar hidden={true} />
          <RootLayoutNav />
        </ThemeProvider>
      </UserProvider>
    </GlobalIntegerProvider>
  );
}