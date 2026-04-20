import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useGlobalInteger } from "@/components/FontSize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/context/useridcontext';
import { useEffect } from "react";
import axiosInstance from '@/utils/axiosInstance';
import { APP_VERSION } from "@/constants/appversion";

const data = [
  {
    key: "User Profile",
    icon: require("@/assets/icons/user.png"),
    page: "/(sidebar)/user",
  },
  {
    key: "Privacy Policy",
    icon: require("@/assets/icons/settings.png"),
    page: "/(sidebar)/setting",
  },
  // {
  //   key: "Help & Support",
  //   icon: require("@/assets/icons/customize.png"),
  //   page: "/(sidebar)/costume",
  // },
  // {
  //   key: "Accessibility Features",
  //   icon: require("@/assets/icons/accesibility.png"),
  //   page: "/(sidebar)/access",
  // },
];

const Layout2 = () => {
  const { user_id, setUserId } = useUser();
  const router = useRouter();
  const { value: fontSize } = useGlobalInteger();

  useEffect(() => {
    if (!user_id) {
      router.replace("/");
    }
  }, [user_id]);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await axiosInstance.post('/logout');
            } catch (error) {
              console.error('Logout API error:', error);
            } finally {
              await AsyncStorage.multiRemove([
                'userId',
                'authToken',
                'tokenExpiry',
              ]);
              
              setUserId(null);
              router.replace("/");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => router.push(item.page as any)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={[styles.itemText, { fontSize }]}>{item.key}</Text>
          </TouchableOpacity>
        )}
      />

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionLabel}>App Version</Text>
        <Text style={styles.versionText}>{APP_VERSION}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Image
          source={require("@/assets/icons/logout.png")}
          style={styles.icon}
        />
        <Text style={[styles.itemText, { fontSize }]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Layout2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 40,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#1e293b",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 16,
  },
  itemText: {
    color: "white",
    fontWeight: "600",
  },
  versionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 60,
    // borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  versionLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  versionText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#b91c1c",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#991b1b",
  },
});