"use client";
import { useState, useEffect } from 'react';
import createJellyfin from '@/utils/APIHelpers/jellyfin';

type jellyConfigs = {
  baseURL: string;
  apiKey: string;
};

type authorized = 'true' | 'false' | 'checking' | 'error';

export const useJellyfin = () => {
  const [jellyfinConfig, setJellyfinConfig] = useState<jellyConfigs>({ baseURL: '', apiKey: '' });
  const [jellyfinInstance, setJellyfinInstance] = useState<ReturnType<typeof createJellyfin> | null>(null);
  const [jellyfinAuthorised, setJellyfinAuthorised] = useState<authorized>('false');

  useEffect(() => {
    setJellyfinConfig({
      baseURL: document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
      apiKey: document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
    });
  }, []);

  useEffect(() => {
    document.cookie = `jellyfinEndpoint=${jellyfinConfig.baseURL}; path=/;`;
    document.cookie = `jellyfinApiKey=${jellyfinConfig.apiKey}; path=/;`;

    const jellyfin = createJellyfin(jellyfinConfig.baseURL, jellyfinConfig.apiKey);
    setJellyfinInstance(jellyfin);

    if (jellyfinConfig.baseURL !== '' || jellyfinConfig.apiKey !== '') {
      setJellyfinAuthorised('checking');
      jellyfin.validate().then((response) => {
        if (response.success) {
          setJellyfinAuthorised('true');
        } else {
          setJellyfinAuthorised('error');
        }
      });
    }
  }, [jellyfinConfig]);

  return {
    jellyfinInstance,
    setJellyfinConfig,
    jellyfinAuthorised,
    setJellyfinAuthorised
  };
};
