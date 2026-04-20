import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme } from './Theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // used as fallback
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? DarkTheme : LightTheme);

  const setAndStoreTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('APP_THEME', newTheme.mode);
    } catch (e) {
      ('Failed to save theme:', e);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme.mode === 'dark' ? LightTheme : DarkTheme;
    setAndStoreTheme(newTheme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('APP_THEME');
        if (storedTheme === 'dark') {
          setTheme(DarkTheme);
        } else if (storedTheme === 'light') {
          setTheme(LightTheme);
        } else {
          // Default to system theme
          setTheme(systemColorScheme === 'dark' ? DarkTheme : LightTheme);
        }
      } catch (e) {
        ('Failed to load theme:', e);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);