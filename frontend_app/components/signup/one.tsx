import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/components/ThemeContext';
import { FormData } from '@/types/types';
import { colors } from '@/constants/colors';
import ProgressBar from "@/components/Progressbar";
import { KeyboardAvoidingView, Platform } from 'react-native';

interface StepProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onNext: () => void;
    onBack?: () => void;
}

const One = ({ formData, setFormData, onNext }: StepProps) => {
    const { theme } = useTheme();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateAndNext = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstname?.trim() || formData.firstname.length < 2) {
            newErrors.firstname = 'First name must be at least 2 characters';
        }

        if (!formData.lastname?.trim() || formData.lastname.length < 2) {
            newErrors.lastname = 'Last name must be at least 2 characters';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onNext();
        }
    };

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardDismissMode="on-drag"
                contentInset={{ bottom: 20 }}>
                <ProgressBar step={1} />
                <View style={[styles.container, { backgroundColor: theme.modalContainer }]}>
                    <Text style={[styles.heading, { color: theme.welcomeBack }]}>Get Started!</Text>

                    {/* First Name Input */}
                    <TextInput
                        placeholder="First Name"
                        placeholderTextColor={theme.signupText}
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.inputField,
                                borderColor: errors.firstname ? '#ff4444' : theme.inputBorder,
                                color: theme.signupText,
                            },
                        ]}
                        value={formData.firstname}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, firstname: text }));
                            if (errors.firstname) {
                                setErrors(prev => ({ ...prev, firstname: '' }));
                            }
                        }}
                    />
                    {errors.firstname && (
                        <Text style={styles.errorText}>{errors.firstname}</Text>
                    )}

                    {/* Last Name Input */}
                    <TextInput
                        placeholder="Last Name"
                        placeholderTextColor={theme.signupText}
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.inputField,
                                borderColor: errors.lastname ? '#ff4444' : theme.inputBorder,
                                color: theme.signupText,
                            },
                        ]}
                        value={formData.lastname ?? ''}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, lastname: text }));
                            if (errors.lastname) {
                                setErrors(prev => ({ ...prev, lastname: '' }));
                            }
                        }}
                    />
                    {errors.lastname && (
                        <Text style={styles.errorText}>{errors.lastname}</Text>
                    )}

                    {/* Next Button - Fixed to use validateAndNext */}
                    <TouchableOpacity onPress={validateAndNext} style={styles.buttonWrapper}>
                        <LinearGradient
                            colors={theme.gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                     {/* Passive Consent Notice */}
                    <Text style={[styles.consentText, { color: theme.signupText }]}>
                        By creating an account, you agree to our{' '}
                        <Text
                            style={[styles.consentLink, { color: theme.signupText }]}
                            onPress={() => Linking.openURL('https://weekendwarriorgolf.golf/terms.html')}
                        >
                            Terms of Service
                        </Text>
                        {' '}and{' '}
                        <Text
                            style={[styles.consentLink, { color: theme.signupText }]}
                            onPress={() => Linking.openURL('https://weekendwarriorgolf.golf/privacy.html')}
                        >
                            Privacy Policy
                        </Text>
                        .
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView >


    );
};

export default One;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        justifyContent: 'flex-start',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        letterSpacing: 2,
        fontFamily: 'Open-Sans',
    },
    input: {
        borderWidth: 1,
        borderRadius: 9999,
        paddingHorizontal: 25,
        paddingVertical: 14,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonWrapper: {
        marginTop: 20,
        borderRadius: 9999,
        overflow: 'hidden',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 9999,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 1,
    },

    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: -15,
        marginBottom: 10,
        marginLeft: 25,
    },

     consentText: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        marginTop: 20,
        paddingHorizontal: 20,
        lineHeight: 18,
        opacity: 0.7,
    },
    consentLink: {
        // color : colors.white,
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
});