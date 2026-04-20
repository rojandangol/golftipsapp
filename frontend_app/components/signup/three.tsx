import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Linking,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

import { useTheme } from '@/components/ThemeContext';
import { FormData } from '@/types/types';
import ProgressBar from "@/components/Progressbar";
import { API_URL } from '@/constants/url';
import axiosInstance from '@/utils/axiosInstance';


interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack?: () => void;
}

// Password strength calculator
const calculatePasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: 'None', color: '#ccc' };
  
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    longLength: password.length >= 12,
  };

  // Calculate strength score
  if (checks.length) strength += 1;
  if (checks.hasLetter) strength += 1;
  if (checks.hasNumber) strength += 1;
  if (checks.hasSpecial) strength += 1;
  if (checks.longLength) strength += 1;

  // Return strength level
  if (strength <= 1) return { strength: 1, label: 'Weak', color: '#ff4444', score: strength };
  if (strength <= 2) return { strength: 2, label: 'Fair', color: '#ffaa00', score: strength };
  if (strength <= 3) return { strength: 3, label: 'Good', color: '#ffdd00', score: strength };
  return { strength: 4, label: 'Strong', color: '#44dd44', score: strength };
};

const Three = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isChecking, setIsChecking] = useState(false);
  const { theme } = useTheme();

  const scrollViewRef = useRef<ScrollView>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Memoize password strength to avoid recalculating on every render
  const passwordStrength = useMemo(() => 
    calculatePasswordStrength(formData.password || ''), 
    [formData.password]
  );

  const validateAndSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    // 1. Username validation (client-side)
    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // 2. Password validation (client-side)
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      const hasNumber = /\d/.test(formData.password);
      const hasLetter = /[a-zA-Z]/.test(formData.password);
      
      if (!hasNumber) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!hasLetter) {
        newErrors.password = 'Password must contain at least one letter';
      }
    }

    // 3. Confirm password validation
    if (!confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // If client-side validation fails, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 4. Check username availability (server-side)
    setIsChecking(true);
    try {
      const response = await axiosInstance.post(`/check-username`, {
        username: formData.username
      });

      if (!response.data.available) {
        newErrors.username = 'Username is already taken';
        setErrors(newErrors);
        return;
      }

      // All validation passed - proceed with signup
      setErrors({});
      onNext();

    } catch (error: any) {
      console.error('Username check error:', error);
      
      if (error.response?.status === 409) {
        newErrors.username = 'Username is already taken';
        setErrors(newErrors);
      } else {
        Alert.alert('Error', 'Unable to verify username. Please try again.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <ProgressBar step={3} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.container, { backgroundColor: theme.modalContainer }]}>
            <Text style={[styles.title, { color: theme.welcomeBack }]}>Create your account</Text>

            {/* Username */}
            <View
              style={[
                styles.inputField,
                {
                  backgroundColor: theme.mode === 'light' ? '#FFFFFF' : theme.inputField,
                  borderColor: errors.username ? '#ff4444' : theme.inputBorder,
                },
              ]}
            >
              <FontAwesome name="user-o" size={20} color={theme.icon} />
              <TextInput
                placeholder="Username"
                placeholderTextColor={theme.inputText}
                style={[styles.inputText, { color: theme.inputText }]}
                value={formData.username}
                autoCapitalize="none"  
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={(text) => {
                  const sanitized = text.toLowerCase().replace(/\s/g, '');
                  setFormData((prev) => ({ ...prev, username: sanitized }));
                  if (errors.username) {
                    setErrors(prev => ({ ...prev, username: '' }));
                  }
                }}
              />
            </View>
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* Password */}
            <View
              style={[
                styles.inputField,
                {
                  backgroundColor: theme.mode === 'light' ? '#FFFFFF' : theme.inputField,
                  borderColor: errors.password ? '#ff4444' : theme.inputBorder,
                },
              ]}
            >
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme.inputText}
                secureTextEntry={!showPassword}
                style={[styles.inputText, { color: theme.inputText }]}
                value={formData.password}
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordRef.current?.focus();
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, password: text }));
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.icon}
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {formData.password && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarsContainer}>
                  {[1, 2, 3, 4].map((bar) => (
                    <View
                      key={bar}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor: bar <= passwordStrength.strength 
                            ? passwordStrength.color 
                            : '#e0e0e0',
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
            )}

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={[styles.requirementTitle, { color: 'black'}]}>Password must include:</Text>
              <RequirementItem 
                met={formData.password?.length >= 8} 
                text="At least 8 characters"
                theme={theme}
              />
              <RequirementItem 
                met={/[a-zA-Z]/.test(formData.password || '')} 
                text="At least one letter"
                theme={theme}
              />
              <RequirementItem 
                met={/\d/.test(formData.password || '')} 
                text="At least one number"
                theme={theme}
              />
            </View>

            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Helper text for scrolling */}
            {formData.password && !confirmPassword && (
              <View style={styles.helperBadge}>
                <Text style={styles.helperText}>
                  ↓ Confirm your password below
                </Text>
              </View>
            )}

            {/* Confirm Password */}
            <View
              style={[
                styles.inputField,
                {
                  backgroundColor: theme.mode === 'light' ? '#FFFFFF' : theme.inputField,
                  borderColor: errors.confirmPassword ? '#ff4444' : theme.inputBorder,
                },
              ]}
            >
              <TextInput
                ref={confirmPasswordRef}
                placeholder="Confirm Password"
                placeholderTextColor={theme.inputText}
                secureTextEntry={!showConfirmPassword}
                style={[styles.inputText, { color: theme.inputText }]}
                value={confirmPassword}
                returnKeyType="done"
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Feather
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.icon}
                />
              </TouchableOpacity>
            </View>

            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
            {/* Terms Agreement */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://www.weekendwarriorgolf.golf/terms.html')}
              >
                Terms & Conditions
              </Text>
              {' '}and{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://www.weekendwarriorgolf.golf/privacy.html')}
              >
                Privacy Policy
              </Text>
            </Text>
            {/* Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.buttonHalf, styles.outlineButton]} onPress={onBack}>
                <Text style={[styles.outlineText, { color: theme.signupText }]}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.buttonHalf, styles.buttonWrapper]} 
                onPress={validateAndSubmit}
                disabled={isChecking}
              >
                <LinearGradient
                  colors={theme.gradientColors ?? ['#4c669f', '#3b5998']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.buttonText}>
                    {isChecking ? 'Checking...' : 'Sign Up'}
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

// Component to display individual requirement
const RequirementItem = ({ met, text, theme }: { met: boolean; text: string; theme: any }) => (
  <View style={styles.requirementItem}>
    <FontAwesome 
      name={met ? 'check-circle' : 'circle'} 
      size={16} 
      color={met ? '#44dd44' : '#999'} 
      style={styles.requirementIcon}
    />
    <Text style={[
      styles.requirementText, 
      { color: met ? '#44dd44' : '#999' }
    ]}>
      {text}
    </Text>
  </View>
);

export default Three;

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
  // Password Strength Styles
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  strengthBarsContainer: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  strengthLabel: {
    marginLeft: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  // Password Requirements Styles
  requirementsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  requirementTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 12,
  },
  // Helper badge styles
  helperBadge: {
    backgroundColor: 'rgba(76, 102, 159, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  helperText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  link: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
});``