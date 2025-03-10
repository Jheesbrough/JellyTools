"use client";
import { useState, useEffect } from 'react';
import createJellyseer from '@/utils/APIHelpers/jellyseer';

type jellyConfigs = {
  baseURL: string;
  apiKey: string;
};

export const useJellyseer = () => {
  const [jellyseerConfig, setJellyseerConfig] = useState<jellyConfigs>({ baseURL: '', apiKey: '' });
  const [jellyseerInstance, setJellyseerInstance] = useState<ReturnType<typeof createJellyseer> | null>(null);
  const [jellyseerAuthorised, setJellyseerAuthorised] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setJellyseerConfig({
        baseURL: document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerEndpoint\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
        apiKey: document.cookie.replace(/(?:(?:^|.*;\s*)jellyseerApiKey\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '',
      });
    }
  }, []);

  useEffect(() => {
    const jellyseer = createJellyseer(jellyseerConfig.baseURL, jellyseerConfig.apiKey);
    setJellyseerInstance(jellyseer);
  }, [jellyseerConfig]);

  return {
    jellyseerInstance,
    setJellyseerConfig,
    jellyseerAuthorised,
    setJellyseerAuthorised
  };
};
