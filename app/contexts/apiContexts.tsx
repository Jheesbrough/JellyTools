"use client";
import React, { createContext, useContext } from 'react';
import Jellyfin from '../utils/jellyfin';
import Jellyseer from '../utils/jellyseer';

let jellyfinBaseURL = '';
let jellyfinApiKey = '';

let jellyseerBaseURL = '';
let jellyseerApiKey = '';

if (typeof document !== 'undefined') {
  jellyfinBaseURL = document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '';
  jellyfinApiKey = document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '';

  jellyseerBaseURL = document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '';
  jellyseerApiKey = document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '';
}
const jellyfinInstance = new Jellyfin(jellyfinBaseURL, jellyfinApiKey);
const jellyseerInstance = new Jellyseer(jellyseerBaseURL, jellyseerApiKey);

const JellyfinContext = createContext(jellyfinInstance);
const JellyseerContext = createContext(jellyseerInstance);

export const useJellyfin = () => useContext(JellyfinContext);
export const useJellyseer = () => useContext(JellyseerContext);

export const APIProvider: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  return (
    <JellyfinContext.Provider value={jellyfinInstance}>
      <JellyseerContext.Provider value={jellyseerInstance}>
        {children}
      </JellyseerContext.Provider>
    </JellyfinContext.Provider>
  );
};