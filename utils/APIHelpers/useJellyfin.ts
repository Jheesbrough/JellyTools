"use client";
import createJellyfin, { Jellyfin } from '@/utils/APIHelpers/jellyfin';
import { useJellyAPI } from '@/utils/APIHelpers/useJellyAPI';

export const useJellyfin = (): { instance: Jellyfin, config: any, setConfig: any, authenticationStatus: any } => {
  const { config, setConfig, instance, authenticationStatus } = useJellyAPI(createJellyfin, 'jellyfinEndpoint', 'jellyfinApiKey');

  return {
    instance,
    config,
    setConfig,
    authenticationStatus,
  };
};
