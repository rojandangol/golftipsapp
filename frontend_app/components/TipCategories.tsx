import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';


const TipCategories = (props: any) => {
    const router = useRouter();

    // Conditional style for imgContainer
    const dynamicImgContainerStyle = props.dynamicWidth
        ? { width: props.dynamicWidth } // This will override the width if passed as a prop
        : {};
    const dynamicPaddingStyle = props.dynamicPadding
        ? { padding: props.dynamicPadding }
        : {};

    return (
        <TouchableOpacity onPress={() => router.push({ pathname: '/tips/[id]', params: { id: props.title } })}>
            <View style={[styles.view, dynamicPaddingStyle]}>
                <Text style={styles.text}>{props.title}</Text>
                <View style={[styles.imgContainer, dynamicImgContainerStyle]}>
                    <Image source={props.club} style={styles.image} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default TipCategories;

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        margin: '5%',
        padding: '12%',
        borderRadius: 20,
        boxShadow: '8px 8px 0px 1px #918566',
        backgroundColor: '#e6dcc2',
    },
    text: {
        fontSize: 30,
    },
    imgContainer: {
        width: '138%', // Default width
        height: 130,
        paddingRight: -10,
        paddingVertical: 10,
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
});
