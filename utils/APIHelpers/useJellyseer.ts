"use client";
import createJellyseer from '@/utils/APIHelpers/jellyseer';
import { useJellyAPI } from '@/utils/APIHelpers/useJellyAPI';

export const useJellyseer = () => {
  const { config, setConfig, instance, authenticationStatus } = useJellyAPI(createJellyseer, 'jellyseerEndpoint', 'jellyseerApiKey');

  return {
    instance,
    config,
    setConfig,
    authenticationStatus,
  };
};
