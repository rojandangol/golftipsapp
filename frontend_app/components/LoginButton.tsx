import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";
import { useTheme } from './ThemeContext';
import { colors } from '@/constants/colors';


type Props = {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
}

const LoginButton = ({ onPress, title }: Props) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { backgroundColor: theme.buttonBackground }]}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, { color: theme.buttonText }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        elevation: 8, // Android shadow
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: -2,
            height: 4,
        },
        shadowOpacity: 0.75,
        shadowRadius: 5,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 3,
        alignSelf: "center",
        textTransform: "uppercase",
        fontFamily: 'Roboto',
        color:colors.primary,
    },
});

export default LoginButton;
