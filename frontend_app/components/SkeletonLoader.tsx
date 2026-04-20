// components/SkeletonLoader.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

const SkeletonLoader = () => {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Video placeholder */}
      <Animated.View 
        style={[
          styles.videoBlock, 
          { backgroundColor: theme.borderColor, opacity }
        ]} 
      />
      
      {/* Title placeholder */}
      <Animated.View 
        style={[
          styles.titleBlock, 
          { backgroundColor: theme.borderColor, opacity }
        ]} 
      />
      
      {/* Body lines */}
      <Animated.View 
        style={[
          styles.lineBlock, 
          { backgroundColor: theme.borderColor, opacity }
        ]} 
      />
      <Animated.View 
        style={[
          styles.lineBlock, 
          { width: '80%', backgroundColor: theme.borderColor, opacity }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '10%',
    marginVertical: '5%',
    padding: 24,
    borderRadius: 20,
  },
  videoBlock: {
    height: 170,
    borderRadius: 12,
    marginBottom: 16,
  },
  titleBlock: {
    height: 28,
    borderRadius: 8,
    marginBottom: 12,
    width: '70%',
  },
  lineBlock: {
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
});

export default SkeletonLoader;