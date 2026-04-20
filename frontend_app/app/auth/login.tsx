import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//components
import { useTheme } from '@/components/ThemeContext';
import { useUser } from '@/context/useridcontext';

//constants
import { colors } from '@/constants/colors';
import { API_URL } from '@/constants/url';
import axiosInstance from '@/utils/axiosInstance';

const Login = ({ onSuccess }: { onSuccess: () => void }) => {
  // ("alexdebug login entered");
  const router = useRouter();
  const { user_id, setUserId } = useUser();
  const { theme } = useTheme();
  const [rememberMe, setRememberMe] = useState(false); // ✅ Add remember me state

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  //For Login UI/ attempts lockout
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  ///////

  // const handleLogin = async () => {
  //   // Validate inputs
  //   if (!username || !password) {
  //     Alert.alert('Error', 'Please enter both username and password');
  //     return;
  //   }

  //   try {
  //     ("handle login called");
  //     ("Remember me:", rememberMe); // ✅ Log remember me state

  //     // Call login API with rememberMe flag

  //     const response = await axiosInstance.post(`/checkuserlogin`, {
  //       username,
  //       password,
  //       rememberMe, // ✅ Send remember me to backend
  //     });

  //     ("Login response:", response.data);

  //     // Check if we got userId and token
  //     if (response.data && response.data.userId && response.data.token) {
  //       const userId = String(response.data.userId);
  //       const token = response.data.token;
  //       const expiresAt = response.data.expiresAt;

  //       // Store userId, token, expiry, and rememberMe in AsyncStorage
  //       await AsyncStorage.multiSet([
  //         ['userId', userId],
  //         ['authToken', token],
  //         ['tokenExpiry', expiresAt],
  //         ['rememberMe', rememberMe ? 'true' : 'false'], // ✅ Store remember me preference
  //       ]);

  //       // Update context
  //       setUserId(userId);

  //       ("Stored userId, token, and rememberMe in AsyncStorage");

  //       Alert.alert('Login Successful', 'Welcome back!');
  //       onSuccess();
  //       router.replace('/(tabs)');
  //     } else {
  //       throw new Error('No userId or token in response');
  //     }
  //   } catch (error: any) {
  //     console.error('Login failed:', error);

  //     // Handle specific error messages from server
  //     const message = error.response?.data?.message || 'Invalid username or password';

  //     Alert.alert('Login Failed', message);
  //   }
  // };

  ///testing this out
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Check if locked out
    if (loginAttempts >= MAX_ATTEMPTS) {
      Alert.alert(
        'Account Locked',
        `Too many failed login attempts. Please try again in 15 minutes.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/checkuserlogin`, {
        username,
        password,
      });

      if (response.data?.userId && response.data?.token) {
        const userId = String(response.data.userId);
        const token = response.data.token;
        const expiresAt = response.data.expiresAt;

        await AsyncStorage.multiSet([
          ['userId', userId],
          ['authToken', token],
          ['tokenExpiry', expiresAt],
        ]);

        // Reset attempts on successful login
        setLoginAttempts(0);
        setUserId(userId);
        // Check and increment login counter
        const raw = await AsyncStorage.getItem('visit_count');
        const count = raw !== null ? parseInt(raw) : 0;
        await AsyncStorage.setItem('visit_count', String(count + 1));
        const isFirstLogin = count === 0;

        Alert.alert('Login Successful', 'Welcome back!', [
          {
            text: 'OK',
            onPress: () => {
              // onSuccess();
              // router.replace('/(tabs)');

              router.replace({
                pathname: '/(tabs)',
                params: isFirstLogin ? { showTourParam: 'true' } : {},
              });
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.status, error.message);

      let errorTitle = 'Login Failed';
      let errorMessage = 'An error occurred. Please try again.';
      const newAttempts = loginAttempts + 1;

      // Handle different error types
      if (!error.response) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.response.status === 401) {
        // Wrong credentials
        errorMessage = `Invalid username or password. (Attempt ${newAttempts}/${MAX_ATTEMPTS})`;
        if (newAttempts >= MAX_ATTEMPTS) {
          errorTitle = 'Account Locked';
          errorMessage = 'Too many failed attempts. Try again in 15 minutes.';
        }
      } else if (error.response.status === 404) {
        // User not found
        errorMessage = 'Username not found.';
      } else if (error.response.status === 429) {
        // Rate limited
        errorTitle = 'Too Many Attempts';
        errorMessage = 'Please wait before trying again.';
      } else if (error.response.status >= 500) {
        // Server error
        errorMessage = 'Server error. Please try again later.';
      } else {
        // Use server message if available
        errorMessage = error.response.data?.message || errorMessage;
      }

      setLoginAttempts(newAttempts);
      Alert.alert(errorTitle, errorMessage);
      return;


    } finally {
      //test set loading
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modalContainer }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        {/* Welcome back Text */}
        <Text style={[styles.title, { color: theme.welcomeBack }]}>Welcome back!</Text>

        {/* Username input field */}
        <View
          style={[
            styles.inputField,
            {
              backgroundColor: theme.mode === 'light' ? '#FFFFFF' : theme.inputField,
              borderColor: theme.inputBorder,
            },
          ]}
        >
          <FontAwesome name="user-o" size={20} color={theme.icon} />
          <TextInput
            placeholder="Username"
            placeholderTextColor={theme.inputText}
            style={[styles.inputText, { color: theme.inputText }]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Password input field */}
        <View
          style={[
            styles.inputField,
            {
              backgroundColor: theme.mode === 'light' ? '#FFFFFF' : theme.inputField,
              borderColor: theme.inputBorder,
            },
          ]}
        >
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.inputText}
            secureTextEntry={!showPassword}
            style={[styles.inputText, { color: theme.inputText }]}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={theme.icon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: rememberMe ? theme.gradientColors?.[0] : 'transparent',
                borderColor: theme.inputBorder,
              },
            ]}
          >
            {rememberMe && (
              <MaterialIcons name="check" size={18} color="#FFFFFF" />
            )}
          </View>
          <Text style={[styles.rememberMeText, { color: theme.inputText }]}>
            Remember me for 30 days
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => router.push('/auth/forgotpassword')}
          style={{ alignSelf: 'flex-end', marginBottom: 20 }}
        >
          <Text style={[styles.forgotPasswordText, { color: theme.gradientColors?.[0] }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>




        {/* 
        <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
          <LinearGradient
            colors={theme.gradientColors ?? ['#4c669f', '#3b5998']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButton}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </LinearGradient>
        </TouchableOpacity> */}


        {/* testing new login button with loading and lockout */}

        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleLogin}
          disabled={isLoading || loginAttempts >= MAX_ATTEMPTS}
        >
          <LinearGradient
            colors={theme.gradientColors ?? ['#4c669f', '#3b5998']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputText: {
    marginLeft: 12,
    flex: 1,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rememberMeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  loginButton: {
    paddingVertical: 12,
    borderRadius: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});