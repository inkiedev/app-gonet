import React, { createContext, useContext } from 'react';

interface FontContextType {
  defaultFontFamily: string;
}

const FontContext = createContext<FontContextType>({
  defaultFontFamily: 'Montserrat_400Regular'
});

export const useFontContext = () => useContext(FontContext);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FontContext.Provider value={{ defaultFontFamily: 'Montserrat_400Regular' }}>
      {children}
    </FontContext.Provider>
  );
};