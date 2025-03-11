'use client';
import { createContext } from 'react';
import { useJellyfin } from '@/utils/APIHelpers/useJellyfin';
import { useJellyseer } from '@/utils/APIHelpers/useJellyseer';

export const JellyfinContext = createContext<ReturnType<typeof useJellyfin> | null>(null);
export const JellyseerContext = createContext<ReturnType<typeof useJellyseer> | null>(null);