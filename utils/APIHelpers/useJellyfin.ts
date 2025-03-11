"use client";
import createJellyfin from '@/utils/APIHelpers/jellyfin';
import { useJellyAPI } from '@/utils/APIHelpers/useJellyAPI';

export const useJellyfin = () => {
  const { config, setConfig, instance, authenticationStatus } = useJellyAPI(createJellyfin, 'jellyfinEndpoint', 'jellyfinApiKey');

  return {
    instance,
    config,
    setConfig,
    authenticationStatus,
  };
};
