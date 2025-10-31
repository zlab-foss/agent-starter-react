'use client';

import { createContext, useContext, useMemo } from 'react';
import { RoomContext } from '@livekit/components-react';
import { APP_CONFIG_DEFAULTS, type AppConfig } from '@/app-config';
import { useRoom } from '@/hooks/useRoom';

const SessionContext = createContext<{
  appConfig: AppConfig;
  isSessionActive: boolean;
  hasSessionId: boolean;
  startSession: () => void;
  endSession: () => void;
}>({
  appConfig: APP_CONFIG_DEFAULTS,
  isSessionActive: false,
  hasSessionId: false,
  startSession: () => {},
  endSession: () => {},
});

interface SessionProviderProps {
  appConfig: AppConfig;
  children: React.ReactNode;
}

export const SessionProvider = ({ appConfig, children }: SessionProviderProps) => {
  const { room, isSessionActive, startSession, endSession, hasSessionId } = useRoom(appConfig);
  const contextValue = useMemo(
    () => ({ appConfig, isSessionActive, hasSessionId, startSession, endSession }),
    [appConfig, isSessionActive, hasSessionId, startSession, endSession]
  );

  return (
    <RoomContext.Provider value={room}>
      <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>
    </RoomContext.Provider>
  );
};

export function useSession() {
  return useContext(SessionContext);
}
