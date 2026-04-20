import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FormData } from '@/types/types';
import { useTheme } from '@/components/ThemeContext';
import ProgressBar from "@/components/Progressbar";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native';
import axiosInstance from '@/utils/axiosInstance';


interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack?: () => void;
}

const Two = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const { theme } = useTheme();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isChecking, setIsChecking] = useState(false);

  const validateAndNext = async () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation 
    if (formData.phone_number?.trim()) {
      const cleanPhone = formData.phone_number.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        newErrors.phone_number = 'Phone number must be at least 10 digits';
      }
    }

    // If client-side validation fails, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check email availability (server-side)
    setIsChecking(true);
    try {
      const response = await axiosInstance.post(`/check-email`, {
        email: formData.email.toLowerCase().trim()
      });

      if (!response.data.available) {
        newErrors.email = 'This email is already registered';
        setErrors(newErrors);
        return;
      }

      // All validation passed - proceed to next step
      setErrors({});
      onNext();

    } catch (error: any) {
      console.error('Email check error:', error);
      
      if (error.response?.status === 409) {
        newErrors.email = 'This email is already registered';
        setErrors(newErrors);
      } else {
        Alert.alert('Error', 'Unable to verify email. Please try again.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <ProgressBar step={2} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.container, { backgroundColor: theme.modalContainer }]}>
            <Text style={[styles.title, { color: theme.welcomeBack }]}>How can we reach you?</Text>

            {/* Email Input */}
            <View
              style={[
                styles.inputField,
                {
                  backgroundColor: theme.inputField,
                  borderColor: errors.email ? '#ff4444' : theme.inputBorder
                }
              ]}
            >
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor={theme.signupText}
                style={[styles.inputText, { color: theme.inputText }]}
                value={formData.email ?? ''}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, email: text.toLowerCase().trim() }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
              />
              <FontAwesome name="envelope-o" size={20} color={theme.icon} />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Phone Input */}
            <View
              style={[
                styles.inputField,
                {
                  backgroundColor: theme.inputField,
                  borderColor: errors.phone_number ? '#ff4444' : theme.inputBorder
                }
              ]}
            >
              <TextInput
                placeholder="Phone Number (Optional)"
                keyboardType="phone-pad"
                placeholderTextColor={theme.signupText}
                style={[styles.inputText, { color: theme.inputText }]}
                value={formData.phone_number ?? ''}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, phone_number: text }));
                  if (errors.phone_number) {
                    setErrors(prev => ({ ...prev, phone_number: '' }));
                  }
                }}
              />
              <FontAwesome name="phone" size={20} color={theme.icon} />
            </View>
            {errors.phone_number && (
              <Text style={styles.errorText}>{errors.phone_number}</Text>
            )}

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.buttonHalf, styles.outlineButton, { borderColor: theme.buttonBackground }]}
                onPress={onBack}
              >
                <Text style={[styles.outlineText, { color: theme.signupText }]}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.buttonHalf, styles.buttonWrapper]} 
                onPress={validateAndNext}
                disabled={isChecking}
              >
                <LinearGradient
                  colors={theme.gradientColors ?? ['#4c669f', '#3b5998']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.buttonText}>
                    {isChecking ? 'Checking...' : 'Next'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Two;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Open-Sans',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  inputText: {
    marginLeft: 12,
    flex: 1,
  },
  buttonWrapper: {
    borderRadius: 9999,
    overflow: 'hidden',
    flex: 1,
  },
  loginButton: {
    paddingVertical: 12,
    borderRadius: 9999,
    marginLeft: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
  },
  outlineText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 16,
  },
});