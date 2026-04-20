import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";

const setting = () => {

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="bg-zinc-950 h-full">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-4 py-6">

          {/* Header */}
          {/* <Text className="text-white text-xl font-bold mb-1">Settings</Text>
          <Text className="text-gray-500 text-sm mb-8">Weekend Warrior Golf Tips</Text> */}

          {/* Support Section */}
          <Text className="text-white text-base font-semibold uppercase tracking-widest mb-3">Support</Text>

          <TouchableOpacity
            onPress={() => openURL('mailto:support@weekendwarriorgolf.golf')}
            className="bg-zinc-900 rounded-xl px-4 py-4 mb-3 flex-row justify-between items-center"
          >
            <Text className="text-white text-sm font-medium">Contact Support</Text>
            <Text className="text-gray-500 text-sm">support@weekendwarriorgolf.golf →</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => openURL('https://weekendwarriorgolf.golf')}
            className="bg-zinc-900 rounded-xl px-4 py-4 mb-8 flex-row justify-between items-center"
          >
            <Text className="text-white text-sm font-medium">Visit Our Website</Text>
            <Text className="text-gray-500 text-sm">weekendwarriorgolf.golf →</Text>
          </TouchableOpacity> */}

          {/* Legal Section */}
          <Text className="text-white text-base font-semibold uppercase tracking-widest mb-3">Legal</Text>

          <TouchableOpacity
            onPress={() => openURL('https://weekendwarriorgolf.golf/privacy.html')}
            className="bg-zinc-900 rounded-xl px-4 py-4 mb-3 flex-row justify-between items-center"
          >
            <Text className="text-white text-sm font-medium">Privacy Policy</Text>
            <Text className="text-gray-500 text-sm">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openURL('https://weekendwarriorgolf.golf/terms.html')}
            className="bg-zinc-900 rounded-xl px-4 py-4 mb-8 flex-row justify-between items-center"
          >
            <Text className="text-white text-sm font-medium">Terms of Service</Text>
            <Text className="text-gray-500 text-sm">→</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text className="text-gray-600 text-xs text-center mt-4">
            Weekend Warrior Golf Tips v1.0.0
          </Text>
          <Text className="text-gray-600 text-xs text-center mt-1">
            © 2026 Weekend Warrior Golf
          </Text>

        </View>
      </ScrollView>
    </View>
  );
};

export default setting;