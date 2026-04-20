import React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

interface Props {
  step: number;          // current step (1–3)
  totalSteps?: number;
}

export default function ProgressBar({ step, totalSteps = 3 }: Props) {
  const progress = step / totalSteps;

  //  Keep track of previous progress
  const animatedWidth = React.useRef(new Animated.Value(progress)).current; // Start at current progress
  const previousProgress = React.useRef(progress); // Track previous value

  // animate whenever "progress" changes
  React.useEffect(() => {
    // Only animate if progress actually changed
    if (previousProgress.current !== progress) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 400,
        easing: Easing.out(Easing.ease), // Decelerates smoothly
        useNativeDriver: false,
      }).start();

      // Update previous progress
      previousProgress.current = progress;
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"]
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
});