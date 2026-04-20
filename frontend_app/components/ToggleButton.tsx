// components/GolfSwingToggle.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from './ThemeContext';
import { logos } from '@/constants/logos';

const ToggleButton = () => {
    const { theme, toggleTheme } = useTheme();
    const [isDark, setIsDark] = useState(theme.mode === 'dark');
    const animValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

    useEffect(() => {
        setIsDark(theme.mode === 'dark');
        Animated.timing(animValue, {
            toValue: theme.mode === 'dark' ? 1 : 0,
            duration: 300,
            easing: Easing.out(Easing.circle),
            useNativeDriver: false,
        }).start();
    }, [theme]);

    const onToggle = () => {
        toggleTheme();
    };

    const translateX = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 26],
    });

    return (
        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.8}
            style={[styles.track, { backgroundColor: theme.landToggle }]}
        >
            <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]}>
                <Image
                    source={isDark ? logos.darkMode : logos.dayMode}
                    style={styles.icon}
                    resizeMode="contain"
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

export default ToggleButton;

const styles = StyleSheet.create({
    track: {
        width: 50,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
    },
    thumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 18,
        height: 18,
    },
});
