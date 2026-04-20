import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axiosInstance from '../../utils/axiosInstance'; // Use relative path
import { FormData } from '@/types/types';
import { useUser } from '@/context/useridcontext';

import One from "./one"
import Two from "./two"
import Three from "./three"

const { width } = Dimensions.get('window');

const MultiStepSignup = ({ onSuccess }: { onSuccess: () => void }) => {
  // ("alexdebug multistep signup entered")
  const translateX = useSharedValue(0);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { setUserId } = useUser();

  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    username: '',
    password: '',
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(prev => prev + 1);
      translateX.value = withSpring(-(step + 1) * width);
    } else {
      handleSignup(); // last step
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
      translateX.value = withSpring(-(step - 1) * width);
    }
  };

  const handleSignup = async () => {
  
  
  // Validate all fields
  if (!formData.firstname || !formData.lastname || !formData.email || 
      !formData.username || !formData.password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

 try {
    // Sanitize and prepare signup data
    const signupData = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.toLowerCase().trim(),
      phone_number: formData.phone_number?.trim() || null, 
      username: formData.username.toLowerCase().trim(),
      password: formData.password,
    };


    
    const signupResponse = await axiosInstance.post(`/signup`, signupData);
    
    

    if (signupResponse.data?.userId) {
      // Now automatically log them in to get a token - use regular axios
      
      const loginResponse = await axiosInstance.post(`/checkuserlogin`, {
        username: formData.username,
        password: formData.password,
      });

     
      if (loginResponse.data?.userId && loginResponse.data?.token) {
        const userId = String(loginResponse.data.userId);
        const token = loginResponse.data.token;
        const expiresAt = loginResponse.data.expiresAt;
        
        // Store userId, token, and expiry in AsyncStorage
        await AsyncStorage.multiSet([
          ['userId', userId],
          ['authToken', token],
          ['tokenExpiry', expiresAt],
          ['visit_count', '0'],
        ]);
      
        // Update context
        setUserId(userId);

        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.replace({ pathname: '/(tabs)', params: { showTourParam: 'true' } });
            },
          },
        ]);
      } else {
        throw new Error('Login after signup failed');
      }
    } else {
      throw new Error('No userId in signup response');
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error response:', error.response?.data);
    
    const message = error.response?.data?.message || 'An error occurred during signup.';
    Alert.alert('Signup Failed', message);
  }
};

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <PanGestureHandler onGestureEvent={() => { }}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.screen}><One formData={formData} setFormData={setFormData} onNext={handleNext} /></View>
          <View style={styles.screen}><Two formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} /></View>
          <View style={styles.screen}><Three formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} /></View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default MultiStepSignup;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    width: width * 3,
  },
  screen: {
    width,
    padding: 20,
  },
});