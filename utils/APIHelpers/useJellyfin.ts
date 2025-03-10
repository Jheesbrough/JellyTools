"use client";
import { useState, useEffect } from 'react';
import createJellyfin from '@/utils/APIHelpers/jellyfin';

type jellyConfigs = {
  baseURL: string;
  apiKey: string;
};

export const useJellyfin = () => {
  const [jellyfinConfig, setJellyfinConfig] = useState<jellyConfigs>({ baseURL: '', apiKey: '' });
  const [jellyfinInstance, setJellyfinInstance] = useState<ReturnType<typeof createJellyfin> | null>(null);
  const [jellyfinAuthorised, setJellyfinAuthorised] = useState<boolean>(false);

  useEffect(() => {
    setJellyfinConfig({
      baseURL: document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
      apiKey: document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
    });
  }, []);

  useEffect(() => {
    const jellyfin = createJellyfin(jellyfinConfig.baseURL, jellyfinConfig.apiKey);
    setJellyfinInstance(jellyfin);
  }, [jellyfinConfig]);

  return {
    jellyfinInstance,
    setJellyfinConfig,
    jellyfinAuthorised,
    setJellyfinAuthorised
  };
};
