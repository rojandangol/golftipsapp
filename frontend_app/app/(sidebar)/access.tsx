import { useState } from "react";
import { View, Text, Image } from "react-native";
import { Switch } from "react-native";
import { ScrollView } from "react-native";
const user = () => {
  const [textSpeech, setTextSpeech] = useState(false);
  const [Hearing, setHearing] = useState(false);
  const [voiceControl, setVoiceControl] = useState(false);

  return (
    <View className="bg-zinc-950 text-slate-950 h-full">
      <ScrollView>
        <View className="flex-col justify-between items-start w-full px-4 mt-2">
          <View className="flex-row items-center px-4 py-2">
            <Image
              className="w-12 h-12 ml-3 mt-3"
              source={require("@/assets/icons/accesibility.png")}
            />
            <View className="flex-1 ml-10">
              <Text className="text-white text-2xl font-semibold">
                Accesibility Features
              </Text>
            </View>
          </View>
          <View className="h-px bg-white w-full mb-4 mt-8" />
          <View className="flex-row items-center justify-between w-full px-4 py-3 rounded-lg mb-2">
            <Text className="text-white text-xl font-semibold text-center mt-4 ml-5">
              Text-Speech
            </Text>
            <Switch
              value={textSpeech}
              onValueChange={setTextSpeech}
              trackColor={{ false: "#767577", true: "#f5dd4b" }}
              thumbColor={textSpeech ? "#22c55e" : "#f4f3f4"}
            />
          </View>
          <View className="h-px bg-white w-full mb-4 mt-8" />
          <View className="flex-row items-center justify-between w-full px-4 py-3 rounded-lg mb-2">
            <Text className="text-white text-xl font-semibold text-center mt-4 ml-5">
              Hearing
            </Text>
            <Switch
              value={Hearing}
              onValueChange={setHearing}
              trackColor={{ false: "#767577", true: "#f5dd4b" }}
              thumbColor={Hearing ? "#22c55e" : "#f4f3f4"}
            />
          </View>
          <View className="h-px bg-white w-full mb-4 mt-8" />
          <View className="flex-row items-center justify-between w-full px-4 py-3 rounded-lg mb-2">
            <Text className="text-white text-xl font-semibold text-center mt-4 ml-5">
              Voice Control
            </Text>
            <Switch
              value={voiceControl}
              onValueChange={setVoiceControl}
              trackColor={{ false: "#767577", true: "#f5dd4b" }}
              thumbColor={voiceControl ? "#22c55e" : "#f4f3f4"}
            />
          </View>
          <View className="h-px bg-white w-full mb-4 mt-8" />
        </View>
      </ScrollView>
    </View>
  );
};
export default user;
