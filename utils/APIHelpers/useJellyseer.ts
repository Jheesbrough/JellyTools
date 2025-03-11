"use client";
import { useState, useEffect } from 'react';
import createJellyseer from '@/utils/APIHelpers/jellyseer';

type jellyConfigs = {
  baseURL: string;
  apiKey: string;
};

type authorized = 'true' | 'false' | 'checking' | 'error';

export const useJellyseer = () => {
  const [jellyseerConfig, setJellyseerConfig] = useState<jellyConfigs>({ baseURL: '', apiKey: '' });
  const [jellyseerInstance, setJellyseerInstance] = useState<ReturnType<typeof createJellyseer> | null>(null);
  const [jellyseerAuthorised, setJellyseerAuthorised] = useState<authorized>('false');

  useEffect(() => {
    setJellyseerConfig({
      baseURL: document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
      apiKey: document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
    });
  }, []);

  useEffect(() => {
    document.cookie = `jellyseerEndpoint=${jellyseerConfig.baseURL}; path=/;`;
    document.cookie = `jellyseerApiKey=${jellyseerConfig.apiKey}; path=/;`;

    const jellyseer = createJellyseer(jellyseerConfig.baseURL, jellyseerConfig.apiKey);
    setJellyseerInstance(jellyseer);

    if (jellyseerConfig.baseURL !== '' || jellyseerConfig.apiKey !== '') {
      setJellyseerAuthorised('checking');
      jellyseer.validate().then((response) => {
        if (response.success) {
          setJellyseerAuthorised('true');
        } else {
          setJellyseerAuthorised('error');
        }
      });
    }
  }, [jellyseerConfig]);

  return {
    jellyseerInstance,
    jellyseerConfig,
    setJellyseerConfig,
    jellyseerAuthorised,
    setJellyseerAuthorised
  };
};
