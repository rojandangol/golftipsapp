// components/AuthModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

// Constants
import { useTheme } from './ThemeContext';
const screenHeight = Dimensions.get('window').height;

type AuthModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const AuthModal = ({ onClose, children }: AuthModalProps) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setIsClosing(false);
    });
  };

  return (
    <View style={styles.wrapper}>
      {/* Modal */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: theme.modalContainer,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Feather name="chevron-down" size={32} color={theme.icon} />
        </TouchableOpacity>

        <View style={styles.content}>{children}</View>
      </Animated.View>

    </View>
  );
};

export default AuthModal;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    width: '100%',
  },
  modalContainer: {
    position: 'relative',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: screenHeight * 0.8, // height of the modal in relation to index
    width: '100%',
  },
  closeButton: {
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },

});
