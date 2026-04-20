import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import axios from 'axios';

import { useTheme } from '@/components/ThemeContext';
import { API_URL } from '@/constants/url';
import axiosInstance from '@/utils/axiosInstance';

const ForgotPassword = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/forgot-password`, { email });
      
      if (response.data.success) {
        Alert.alert('Success', 'We sent a 6-digit code to your email');
        setStep('otp');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
 // Step 2: Verify OTP
const handleVerifyOTP = async () => {
  if (otp.length !== 6) {
    Alert.alert('Error', 'Please enter the 6-digit code');
    return;
  }

  setLoading(true);
  try {
    
    const response = await axiosInstance.post(`/verify-reset-code`, {
      email,
      code: otp,
    });

    if (response.data.success) {
      setResetToken(response.data.resetToken);
      Alert.alert('Success', 'Code verified! Enter your new password');
      setStep('newPassword');
    }
  } catch (error: any) {
    console.error('❌ OTP verification error:', error.response?.data);
    
    const errorData = error.response?.data;
    
    // ✅ Handle too many attempts
    if (errorData?.tooManyAttempts) {
      Alert.alert(
        'Too Many Attempts',
        'You\'ve entered the wrong code too many times. Please request a new code.',
        [
          {
            text: 'Request New Code',
            onPress: () => {
              setStep('email');
              setOtp('');
            },
          },
        ]
      );
      return;
    }
    
    // ✅ Show remaining attempts
    const message = errorData?.message || 'Invalid or expired code';
    const attemptsRemaining = errorData?.attemptsRemaining;
    
    if (attemptsRemaining !== undefined) {
      Alert.alert(
        'Invalid Code',
        `${message}\n\n${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`,
        [
          {
            text: 'Try Again',
            style: 'cancel',
          },
          attemptsRemaining === 0 ? {
            text: 'Request New Code',
            onPress: () => {
              setStep('email');
              setOtp('');
            },
          } : null,
        ].filter(Boolean) as any
      );
    } else {
      Alert.alert('Error', message);
    }
    
    // ✅ Handle expired OTP
    if (errorData?.expired) {
      setTimeout(() => {
        setStep('email');
        setOtp('');
      }, 2000);
    }
  } finally {
    setLoading(false);
  }
};
  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/reset-password`, {
        email,
        resetToken,
        newPassword,
      });

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Your password has been reset! Please login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/'),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Enter Code'}
            {step === 'newPassword' && 'New Password'}
          </Text>
        </View>

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <>
            <Text style={[styles.description, { color: theme.subText }]}>
              Enter your email address and we'll send you a code to reset your password
            </Text>

            <View style={[styles.inputField, { 
              backgroundColor: theme.inputField,
              borderColor: theme.inputBorder 
            }]}>
              <MaterialIcons name="email" size={20} color={theme.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor={theme.inputText}
                style={[styles.inputText, { color: theme.inputText }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={styles.buttonWrapper} 
              onPress={handleRequestOTP}
              disabled={loading}
            >
              <LinearGradient
                colors={theme.gradientColors ?? ['#4c669f', '#3b5998']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Sending...' : 'Send Code'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: OTP Input */}
        {step === 'otp' && (
          <>
            <Text style={[styles.description, { color: theme.subText }]}>
              We sent a 6-digit code to {email}
            </Text>

            <View style={[styles.inputField, { 
              backgroundColor: theme.inputField,
              borderColor: theme.inputBorder 
            }]}>
              <MaterialIcons name="lock-outline" size={20} color={theme.icon} />
              <TextInput
                placeholder="Enter 6-digit code"
                placeholderTextColor={theme.inputText}
                style={[styles.inputText, { color: theme.inputText }]}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={styles.buttonWrapper} 
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              <LinearGradient
                colors={theme.gradientColors ?? ['#4c669f', '#3b5998']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('email')}>
              <Text style={[styles.linkText, { color: theme.gradientColors?.[0] }]}>
                Didn't receive code? Try again
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'newPassword' && (
          <>
            <Text style={[styles.description, { color: theme.subText }]}>
              Choose a strong password for your account
            </Text>

            <View style={[styles.inputField, { 
              backgroundColor: theme.inputField,
              borderColor: theme.inputBorder 
            }]}>
              <MaterialIcons name="lock-outline" size={20} color={theme.icon} />
              <TextInput
                placeholder="New Password"
                placeholderTextColor={theme.inputText}
                style={[styles.inputText, { color: theme.inputText }]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.icon}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputField, { 
              backgroundColor: theme.inputField,
              borderColor: theme.inputBorder 
            }]}>
              <MaterialIcons name="lock-outline" size={20} color={theme.icon} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={theme.inputText}
                style={[styles.inputText, { color: theme.inputText }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={styles.buttonWrapper} 
              onPress={handleResetPassword}
              disabled={loading}
            >
              <LinearGradient
                colors={theme.gradientColors ?? ['#4c669f', '#3b5998']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: 30,
    lineHeight: 20,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});