// contexts/AppContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
  // Adicione outros estados globais aqui
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [headerTitle, setHeaderTitle] = useState('Wizebot');

  return (
    <AppContext.Provider value={{
      headerTitle,
      setHeaderTitle,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}