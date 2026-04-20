// Global value for font size
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GlobalIntegerForFontSize = {
  value: number;
  setValue: (val: number) => void;
};

const GlobalIntegerContext = createContext<GlobalIntegerForFontSize | undefined>(undefined);

export const useGlobalInteger = () => {
  const context = useContext(GlobalIntegerContext);
  if (!context) {
    throw new Error('useGlobalInteger must be used within a GlobalIntegerProvider');
  }
  return context;
};

export const GlobalIntegerProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState(16);
  return (
    <GlobalIntegerContext.Provider value={{ value, setValue }}>
      {children}
    </GlobalIntegerContext.Provider>
  );
};