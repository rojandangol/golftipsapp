import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

const Search = () => {
  const [isFocused, setIsFocused] = useState(false);
  const searchBarWidth = useRef(new Animated.Value(40)).current; // Start with small width for logo
  const logoOpacity = useRef(new Animated.Value(1)).current; // For animating the logo opacity

  const handleFocus = () => {
    setIsFocused(true);
    // Animate the search bar width and logo opacity
    Animated.parallel([
      Animated.timing(searchBarWidth, {
        toValue: 200, // Expand to 200 when focused
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(logoOpacity, {
        toValue: 0, // Fade out logo opacity when search is focused
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Animate back to initial state
    Animated.parallel([
      Animated.timing(searchBarWidth, {
        toValue: 40, // Shrink to the small size
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1, // Bring logo back
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Adjust behavior for iOS and Android
      style={styles.keyboardContainer}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={isFocused ? handleBlur : handleFocus}>
          <Animated.View
            style={[
              styles.searchBar,
              { width: searchBarWidth },
              isFocused && styles.searchBarFocused,
            ]}
          >
            {isFocused && (
              <TextInput
                style={styles.input}
                placeholder="Search"
                onBlur={handleBlur}
                autoFocus={true}
              />
            )}
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* Search icon */}
        <Animated.View style={[{ opacity: logoOpacity }, isFocused && { zIndex: -1 }]}>
          <TouchableOpacity onPress={handleFocus}>
            <Ionicons
              name="search"
              size={30}
              color={colors.secondary}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1, // Ensure the whole container takes available space
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1, // Allow the container to stretch
  },
  searchBar: {
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarFocused: {
    backgroundColor: colors.secondary,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

export default Search;
