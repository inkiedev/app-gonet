import React, { createContext, useContext, useState } from 'react';

interface CardExpansionContextType {
  isExpanded: boolean;
  toggleExpansion: () => void;
}

const CardExpansionContext = createContext<CardExpansionContextType | undefined>(undefined);

export const CardExpansionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFooter, setShowFooter] = useState(true);

  const toggleExpansion = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    setShowFooter(!newExpandedState);
  };

  return (
    <CardExpansionContext.Provider
      value={{
        isExpanded,
        toggleExpansion,
      }}
    >
      {children}
    </CardExpansionContext.Provider>
  );
};

export const useCardExpansion = () => {
  const context = useContext(CardExpansionContext);
  if (context === undefined) {
    throw new Error('useCardExpansion must be used within a CardExpansionProvider');
  }
  return context;
};