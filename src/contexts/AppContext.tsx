import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SurgeonPreference, UserRole, surgeonPreferences as initialSurgeonPreferences } from '@/lib/mock-data';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userName: string;
  surgeonPreferences: SurgeonPreference[];
  setSurgeonPreferences: (prefs: SurgeonPreference[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('nurse');
  const [surgeonPreferences, setSurgeonPreferences] = useState<SurgeonPreference[]>(initialSurgeonPreferences);

  // Demo identities per role – switching to "surgeon" makes you Dr James Wilson
  const roleToUserName: Record<UserRole, string> = {
    nurse: 'Alex Morgan',
    surgeon: 'Dr. James Wilson',
    manager: 'Jonathan Porcupine',
  };

  const userName = roleToUserName[currentRole];

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        userName,
        surgeonPreferences,
        setSurgeonPreferences,
      }}
    >
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
