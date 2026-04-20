import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    PanResponder,
    View,
} from 'react-native';
import { logos } from '@/constants/logos';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';
import ToggleButton from './ToggleButton';

const Header = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const translateY = useRef(new Animated.Value(0)).current;

    // Optional animated entrance:
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const isDark = theme.mode === 'dark';

    return (
        <Animated.View
            style={[
                styles.header,
                {
                    backgroundColor: theme.header,
                    transform: [{ translateY }],
                },
            ]}
        >
            {/* Left: Menu Icon */}
            <TouchableOpacity onPress={() => router.push('/(sidebar)/screen')}>
                <Text style={[styles.menu, { color: theme.sidebar }]}>≡</Text>
            </TouchableOpacity>

            {/* Center: Logo + Title */}
            <View style={styles.centerWrapper}>
                <Image
                    source={isDark ? logos.goldLogo : logos.greenLogo}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Right: Theme Toggle */}
            <ToggleButton />
        </Animated.View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        position: 'absolute', // makes it stick
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 20,
        height: 100,
        elevation: 4,

        
    },
    menu: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    centerWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 80,
        height: 35,
        marginBottom: 2,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Open-Sans',
        fontWeight: '600',
        letterSpacing: 1,
    },
});
