"use client";
import { useState, useEffect } from 'react';

type jellyConfigs = {
  baseURL: string;
  apiKey: string;
};

type authenticationStatus = 'true' | 'false' | 'checking' | 'error';

export const useJellyAPI = (createInstance: (baseURL: string, apiKey: string) => any, endpointCookie: string, apiKeyCookie: string) => {
  const [config, setConfig] = useState<jellyConfigs>({ baseURL: '', apiKey: '' });
  const [instance, setInstance] = useState<ReturnType<typeof createInstance>>(createInstance(config.baseURL, config.apiKey));
  const [authenticationStatus, setAuthenticationStatus] = useState<authenticationStatus>('false');

  useEffect(() => {
    setConfig({
      baseURL: document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${endpointCookie}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1") || '',
      apiKey: document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${apiKeyCookie}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1") || '',
    });
  }, []);

  useEffect(() => {
    document.cookie = `${endpointCookie}=${config.baseURL}; path=/;`;
    document.cookie = `${apiKeyCookie}=${config.apiKey}; path=/;`;

    const instance = createInstance(config.baseURL, config.apiKey);
    setInstance(instance);

    if (config.baseURL !== '' || config.apiKey !== '') {
      setAuthenticationStatus('checking');
      instance.validate().then((response: any) => {
        if (response.success) {
          setAuthenticationStatus('true');
        } else {
          setAuthenticationStatus('error');
        }
      });
    }
  }, [config]);

  return {
    config,
    setConfig,
    instance,
    authenticationStatus,
  };
};
