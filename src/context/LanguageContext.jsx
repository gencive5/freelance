// src/context/LanguageContext.js
import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

// This must be exported
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);