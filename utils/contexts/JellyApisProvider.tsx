'use client';
import { ReactNode } from 'react';
import { useJellyfin } from '@/utils/APIHelpers/useJellyfin';
import { useJellyseer } from '@/utils/APIHelpers/useJellyseer';
import { JellyfinContext, JellyseerContext } from './contexts';

export const JellyApisProvider = ({ children }: { children: ReactNode }) => {
  const jellyfin = useJellyfin();
  const jellyseer = useJellyseer();
  return (
    <JellyfinContext.Provider value={jellyfin}>
      <JellyseerContext.Provider value={jellyseer}>
        {children}
      </JellyseerContext.Provider>
    </JellyfinContext.Provider>
  );
};
