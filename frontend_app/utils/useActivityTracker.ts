import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import axiosInstance from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useActivityTracker = () => {
  const lastActivityRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Track user activity
  const updateActivity = () => {
    lastActivityRef.current = Date.now();
    ('👆 User activity detected');
  };

  // Extend token if user was active
  const extendTokenIfActive = async () => {
    // ✅ Check if user is authenticated before extending token
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      ('⏭️ No token found - skipping token extension');
      return;
    }

    const timeSinceActivity = Date.now() - lastActivityRef.current;
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    (`⏰ Checking activity... Last active ${Math.floor(timeSinceActivity / 1000)}s ago`);

    // If user was active in last 5 minutes
    if (timeSinceActivity < fiveMinutes) {
      try {
        const response = await axiosInstance.post('/extendToken');
        ('✅ Token extended:', response.data.message);

        // Update stored expiry in AsyncStorage
        if (response.data.expiresAt) {
          await AsyncStorage.setItem('tokenExpiry', response.data.expiresAt);
          ('💾 Updated token expiry in AsyncStorage');
        }
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          ('❌ Token expired or invalid - user will be logged out');
        } else {
          ('⚠️ Failed to extend token:', error.message);
        }
      }
    } else {
      ('⏸️ User inactive - token not extended');
    }
  };

  useEffect(() => {
    // ✅ Check if user is authenticated before starting tracker
    const initTracker = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        ('🚫 Activity tracker not started - no auth token');
        return;
      }

      ('🎯 Activity tracker initialized');

      // Initial activity mark
      updateActivity();

      // Set up interval to check and extend token every 5 minutes
      intervalRef.current = setInterval(() => {
        ('🔄 Running periodic token extension check...');
        extendTokenIfActive();
      }, 5 * 60 * 1000); // 5 minutes for production

      // Track app state changes (foreground/background)
      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
          ('📱 App came to foreground');
          updateActivity();
          extendTokenIfActive(); // Extend immediately when app becomes active
        }
        appStateRef.current = nextAppState;
      });

      // Cleanup on unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          ('🛑 Activity tracker stopped');
        }
        subscription.remove();
      };
    };

    const cleanup = initTracker();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  return { updateActivity };
};``