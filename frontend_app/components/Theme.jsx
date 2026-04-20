// // Theme.js

// export const LightTheme = {
//   mode: 'light',
//   background: '#FFFFFF',        // background color for screens
//   text: '#000000',              // main text color
//   header: '#c7c080',            // soft gold/beige
//   sidebar: '#00695b',           // teal/green
//   goldHighlight: '#FFD700',     // bright gold/yellow for switch track ON
//   landToggle: '#D9D9D9',        // toggle/slider background

//   // login
//   buttonBackground: '#FFFFFF',  // white button background
//   buttonText: '#00695B',        // dark text on white button

//   // modal
//   modalContainer: '#00695b',    // modal background container color
//   welcomeBack: '#FFFFFF',       // "Welcome back!" text color
//   placeholder: '#FFFFFF',       // placeholder text color for inputs
//   icon: '#000000',              // icon color for eye toggle etc.
//   inputText: '#000000',
//   signupText: '#000000',

//   // about
//   container: '#FFFFFF',
//   accordion: '#c7c080',
//   aboutText: '#FFFFFF',
//   input: '#FFFFFF',
//   button: '#FFFEF1',

//   // extra for inputs and gradients
//   inputField: '#FFFFFF',        // input field background
//   inputBorder: '#CCCCCC',       // input border color
//   gradientColors: ['#CFC88D', '#1F5C4D'], // sage-beige to deep green gradient colors
// };

// export const DarkTheme = {
//   mode: 'dark',
//   background: '#005146',        // dark teal background
//   text: '#FFFFFF',              // main text color
//   header: '#00695b',            // teal header background
//   sidebar: '#c7c080',           // soft gold/beige sidebar
//   goldHighlight: '#FFD700',     // gold/yellow for consistency
//   landToggle: '#7EA9A3',        // toggle/slider background

//   // login
//   buttonBackground: '#D9D4A3',  // muted gold button background
//   buttonText: '#000000',        // black text on button

//   // modal
//   modalContainer: '#FFFEF1',    // modal background container color
//   welcomeBack: '#000000',       // "Welcome back!" text color
//   placeholder: '#000000',       // placeholder text color for inputs
//   icon: '#000000',              // icon color for eye toggle etc.
//   inputText: '#000000',
//   signupText: '#000000',

//   // extra for inputs and gradients
//   inputField: '#FFFEF1',        // input field background (dark)
//   inputBorder: '#000000',       // input border color (dark)
//   gradientColors: ['#7EA9A3', '#00332E'], // soft teal to deep forest green gradient colors

//   // about
//   container: '#00695b',
//   accordion: '#FFFEF1',
//   aboutText: '#000000',
//   input: '#FFFEF1',
//   button: '#000000'


// };


// Theme.jsx - PREMIUM COLOR SYSTEM

export const LightTheme = {
  mode: 'light',
  
  // Base colors (60-30-10 rule)
  background: '#FFFEF1',        // Base (60%) - Warm white
  surface: '#F5F0E0',           // Elevated cards - Slightly darker
  surfaceHover: '#EBE6D5',      // Hover state
  
  // Brand colors
  primary: '#00695B',           // Brand (30%) - Teal
  primaryHover: '#00503F',      // Darker on press
  accent: '#D6BA65',            // Accent (10%) - Gold
  accentLight: '#E5D08F',
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF5350',
  info: '#2196F3',
  
  // Text colors
  text: '#000000',
  textSecondary: '#5E5E5E',
  textTertiary: '#9E9E9E',
  
  // UI Elements
  header: '#c7c080',
  sidebar: '#00695b',
  goldHighlight: '#FFD700',
  landToggle: '#D9D9D9',
  
  // Shadows & borders
  shadowColor: '#00695B',       // Colored shadow
  borderColor: '#E0DBC8',
  borderColorLight: '#F0EBD8',
  
  // Login
  buttonBackground: '#FFFFFF',
  buttonText: '#00695B',
  
  // Modal
  modalContainer: '#00695b',
  modalOverlay: 'rgba(0, 0, 0, 0.4)',  // 40% opacity overlay
  welcomeBack: '#FFFFFF',
  placeholder: '#FFFFFF',
  icon: '#000000',
  inputText: '#000000',
  signupText: '#000000',
  
  // About
  container: '#FFFFFF',
  accordion: '#c7c080',
  aboutText: '#FFFFFF',
  input: '#FFFFFF',
  button: '#FFFEF1',
  
  // Inputs
  inputField: '#FFFFFF',
  inputBorder: '#CCCCCC',
  inputFocus: '#00695B',        // Border color when focused
  gradientColors: ['#CFC88D', '#1F5C4D'],
};

export const DarkTheme = {
  mode: 'dark',
  
  // Base colors
  background: '#005146',
  surface: '#00695B',           // Lighter surface for dark mode
  surfaceHover: '#007A6B',
  
  // Brand colors
  primary: '#4CAF50',           // Slightly brighter for dark mode
  primaryHover: '#66BB6A',
  accent: '#D6BA65',
  accentLight: '#E5D08F',
  
  // Semantic colors (adjusted for dark backgrounds)
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#42A5F5',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  
  // UI Elements
  header: '#00695b',
  sidebar: '#c7c080',
  goldHighlight: '#FFD700',
  landToggle: '#7EA9A3',
  
  // Shadows & borders
  shadowColor: '#000000',
  borderColor: '#2D2D2D',
  borderColorLight: '#3D3D3D',
  
  // Login
  buttonBackground: '#D9D4A3',
  buttonText: '#000000',
  
  // Modal
  modalContainer: '#FFFEF1',
  modalOverlay: 'rgba(0, 0, 0, 0.6)',  // Darker overlay for dark mode
  welcomeBack: '#000000',
  placeholder: '#000000',
  icon: '#000000',
  inputText: '#000000',
  signupText: '#000000',
  
  // About
  container: '#00695b',
  accordion: '#FFFEF1',
  aboutText: '#000000',
  input: '#FFFEF1',
  button: '#000000',
  
  // Inputs
  inputField: '#FFFEF1',
  inputBorder: '#000000',
  inputFocus: '#4CAF50',
  gradientColors: ['#7EA9A3', '#00332E'],
};