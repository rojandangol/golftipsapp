import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

// ("alexdebug layout called")
const styles = StyleSheet.create({
  header: {

    backgroundColor: 'black',
    borderBottomColor: 'green',
    borderColor: 'white',
    borderBottomWidth: 6
  },
});


export default function SidebarLayout() {
  const backText = 'Back';
  const router = useRouter();

  return (
    <Stack screenOptions={{
      headerStyle: styles.header, 
      gestureEnabled: false,
      animation: 'none',
    }}>
      < Stack.Screen
        name="screen"
        options={{
          title: "Settings and Privacy",
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTintColor: "white",
          contentStyle: { backgroundColor: "black" },

          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.push('..')} style={{}}>
                <Text style={{ color: 'white', fontSize: 18}}> {backText} </Text>
              

              </TouchableOpacity>
            );
          },
        }}
      />
      {
        ["access", "costume", "setting", "user"].map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            options={{
              title: "Settings and Privacy",
              headerTintColor: "white",
              headerTitleStyle: { fontSize: 18 },
              headerLeft: () => {
                return (
                  <TouchableOpacity onPress={() => router.push('..')} style={{}}>
                    <Text style={{ color: 'white', fontSize: 18 }}> {backText} </Text>
                  </TouchableOpacity>
                );
              },
            }}

          />
        ))
      }
    </Stack >
  );
}
