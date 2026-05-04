import React, { createContext, useState, useContext } from 'react';
import { translations, languages } from './translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  const t = (key) => translations[language]?.[key] || translations.english[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
