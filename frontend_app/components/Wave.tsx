import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/components/ThemeContext';

type WaveProps = {
  color?: string;
  style?: StyleProp<ViewStyle>;
};
const Wave: React.FC<WaveProps> = ({ style }) => {
  const { theme } = useTheme();
  return (
    <View style={style}>
      <Svg
        height="100"
        width="100%"
        viewBox="0 0 650 70"
      >
    <Path
    fill={theme.background}
    d="M0,60 
        C100,0 200,0 300,60 
        C400,120 500,120 600,60 
        C700,0 800,0 900,60 
        C1000,120 1100,120 1200,60 
        L1200,120 
        L0,120 
        Z"
    />
      </Svg>
    </View>
  );
};

export default Wave;
