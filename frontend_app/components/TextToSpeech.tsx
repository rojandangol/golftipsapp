// Cite: Speech.getAvailableVoicesAsync() returns `Voice` objects with paramters: https://docs.expo.dev/versions/latest/sdk/speech/#speechgetavailablevoicesasync
// React Native Picker Item Docs: https://github.com/react-native-picker/picker
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../constants/colors';

export default function TextToSpeech() {
    const [name, setName] = useState<string>('');
    const [voices, setVoices] = useState<Speech.Voice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');

    const listAllVoiceOptions = async () => {
        try {
            const availableVoices = await Speech.getAvailableVoicesAsync();
            setVoices(availableVoices);
            if (availableVoices.length > 0) {
                setSelectedVoice(availableVoices[0].identifier); // Use 'identifier' instead of 'id'
            }
            ('Available voices:', availableVoices); // list of available voices based on native bundle of native device
        } catch (error) {
            ('Failed to fetch voices:', error);
        }
    };

    React.useEffect(() => {
        listAllVoiceOptions();
    }, []);

    const speakGreeting = () => {
        const greeting = `Hi ${name || 'there'}`;
        const options: Speech.SpeechOptions = {
            voice: selectedVoice,
            pitch: 1.2,
            rate: 1.0,
        };
        Speech.speak(greeting, options);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter text to say"
                onChangeText={setName}
                value={name}
            />

            <Picker
                selectedValue={selectedVoice}
                onValueChange={(itemValue) => setSelectedVoice(itemValue)}
                style={styles.picker}
            >
                {voices.map((voice, index) => (
                    <Picker.Item
                        key={voice.identifier}
                        label={`${voice.name} (${voice.language})`}
                        value={voice.identifier}
                    />
                ))}
            </Picker>
            <View style={styles.spacing} />

            <Button title="Speak" onPress={speakGreeting} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary200,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        height: 400
    },
    input: {
        alignSelf: 'stretch',
        height: 40,
        borderBottomWidth: 5,
        borderBottomColor: colors.secondary300,
        borderRadius: 15,
        marginBottom: 16,
        paddingHorizontal: 30,
        fontSize: 16,
        // tintColor:colors.shadow
        backgroundColor: colors.white
    },
    picker: {
        height: 50,
        width: '100%',
        padding: 10,
        // overflow:'hidden'
    },
    spacing: {
        flex: 1,
        height: 20
    },
});
