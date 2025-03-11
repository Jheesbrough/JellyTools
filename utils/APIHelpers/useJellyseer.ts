"use client";
import { useState, useEffect } from 'react';
import createJellyseer from '@/utils/APIHelpers/jellyseer';

type jellyConfigs = {
  baseURL: string;
  apiKey: string;
};

type authenticationStatus = 'true' | 'false' | 'checking' | 'error';

export const useJellyseer = () => {
  const [config, setConfig] = useState<jellyConfigs>({ baseURL: '', apiKey: '' });
  const [instance, setInstance] = useState<ReturnType<typeof createJellyseer>>(createJellyseer(config.baseURL, config.apiKey));
  const [authenticationStatus, setAuthenticationStatus] = useState<authenticationStatus>('false');

  useEffect(() => {
    setConfig({
      baseURL: document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
      apiKey: document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
    });
  }, []);

  useEffect(() => {
    document.cookie = `jellyseerEndpoint=${config.baseURL}; path=/;`;
    document.cookie = `jellyseerApiKey=${config.apiKey}; path=/;`;

    const jellyseer = createJellyseer(config.baseURL, config.apiKey);
    setInstance(jellyseer);

    if (config.baseURL !== '' || config.apiKey !== '') {
      setAuthenticationStatus('checking');
      jellyseer.validate().then((response) => {
        if (response.success) {
          setAuthenticationStatus('true');
        } else {
          setAuthenticationStatus('error');
        }
      });
    }
  }, [config]);

  return {
    instance,
    config,
    setConfig,
    authenticationStatus,
  };
};
