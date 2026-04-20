import React from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity, Image, Text } from "react-native";

const sideMenu = (props: any) => {
    const router = useRouter();
    return(
        <TouchableOpacity onPress={() => router.push('/(sidebar)/screen')}>
            <Text style={{ fontSize: 50, paddingLeft: 10, color: "#00695B"}}>≡</Text>
        </TouchableOpacity>
    )
}

export default sideMenu;