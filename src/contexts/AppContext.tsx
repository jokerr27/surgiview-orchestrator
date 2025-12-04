import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/lib/mock-data';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userName: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('nurse');
  const userName = 'Alex Morgan';

  return (
    <AppContext.Provider value={{ currentRole, setCurrentRole, userName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
