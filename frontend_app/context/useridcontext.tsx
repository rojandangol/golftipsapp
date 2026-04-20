//Context API: https://www.freecodecamp.org/news/context-api-in-react/

// Context to pass data between file heirarchies: https://react.dev/learn/passing-data-deeply-with-context

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
  user_id: string | null;
  setUserId: (id: string | null) => void;
};

const UserContext = createContext<UserContextType>({
  user_id: null,
  setUserId: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user_id, setUserId] = useState<string | null>(null);

  // Load user_id from storage on app load
  useEffect(() => {
    const loadUserId = async () => {
      const savedId = await AsyncStorage.getItem('user_id');
      if (savedId) setUserId(savedId);
    };
    loadUserId();
  }, []);

  // Save user_id to storage when it changes
  useEffect(() => {
    if (user_id) {
      AsyncStorage.setItem('user_id', user_id);
    }
  }, [user_id]);

  return (
    <UserContext.Provider value={{ user_id, setUserId}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);



