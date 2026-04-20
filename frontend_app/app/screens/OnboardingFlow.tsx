// components/OnboardingFlow.tsx
import React, { useState } from 'react';
import One from '@/components/signup/one';
import Two from '@/components/signup/two';
import Three from '@/components/signup/three';
// import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { FormData } from '@/types/types';
import { useUser } from '@/context/useridcontext';
import { API_URL } from '@/constants/url';
import axiosInstance from '@/utils/axiosInstance';

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    username: '',
    password: '',
  });

  const { setUserId } = useUser();

const handleSubmit = async () => {
  try {
    const response = await axiosInstance.post(`/signup`, formData);

    if (response.data?.userId) {
      setUserId(String(response.data.userId));
      await AsyncStorage.setItem('visit_count', '0');
      Alert.alert('Signup Successful');
      onComplete();
      return; // prevent falling into "failed" alert
    }

    // If backend didn't return userId
    Alert.alert('Signup failed. Please try again.');

  } catch (error: any) {
    const message = error.response?.data?.message || 'Signup failed. Please try again.';
    Alert.alert('Error', message);
  }
};

  switch (step) {
    case 1:
      return <One formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />;
    case 2:
      return <Two formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
    case 3:
      return <Three formData={formData} setFormData={setFormData} onNext={handleSubmit} onBack={() => setStep(2)} />;
    default:
      return null;
  }
};

export default OnboardingFlow;
