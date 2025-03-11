"use client";
import { useState, useEffect } from 'react';
import createJellyfin from '@/utils/APIHelpers/jellyfin';

type jellyConfigs = {
  baseURL: string;
  apiKey: string;
};

type authenticationStatus = 'true' | 'false' | 'checking' | 'error';

export const useJellyfin = () => {
  const [config, setConfig] = useState<jellyConfigs>({ baseURL: '', apiKey: '' });
  const [instance, setInstance] = useState<ReturnType<typeof createJellyfin>>(createJellyfin(config.baseURL, config.apiKey));
  const [authenticationStatus, setAuthenticationStatus] = useState<authenticationStatus>('false');

  useEffect(() => {
    setConfig({
      baseURL: document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
      apiKey: document.cookie.replace(/(?:(?:^|.*;\s*)jellyfinApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
    });
  }, []);

  useEffect(() => {
    document.cookie = `jellyfinEndpoint=${config.baseURL}; path=/;`;
    document.cookie = `jellyfinApiKey=${config.apiKey}; path=/;`;

    const jellyfin = createJellyfin(config.baseURL, config.apiKey);
    setInstance(jellyfin);

    if (config.baseURL !== '' || config.apiKey !== '') {
      setAuthenticationStatus('checking');
      jellyfin.validate().then((response) => {
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
