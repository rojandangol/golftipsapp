import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const BookmarkSaveIcon = ({ size = 64, backgroundColor = '#f0f0f0', iconColor = '#000', strokeColor = '#000' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
  >
    {/* Circle Background */}
    {/* <Circle cx="20" cy="20" r="18" fill={backgroundColor} stroke={strokeColor} strokeWidth="2" /> */}

    {/* Bookmark Icon */}
    <Path
      d="M14 12C14 11.4477 14.4477 11 15 11H25C25.5523 11 26 11.4477 26 12V28L20 24L14 28V12Z"
      fill={iconColor}
    />
  </Svg>
);

export default BookmarkSaveIcon;
