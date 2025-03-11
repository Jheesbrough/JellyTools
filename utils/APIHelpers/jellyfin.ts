"use client";
import { APIresponse } from '@/utils/types';
import { sendAxiosJellyRequest } from '@/utils/axiosUtil';

/**
 * Creates a Jellyfin instance to interact with Jellyfin API.
 * @param {string} baseURL - The base URL of the Jellyfin server.
 * @param {string} apiKey - The API key for authentication.
 * @returns {object} - An object with methods to interact with the Jellyfin API.
 */
export default function createJellyfin(baseURL: string, apiKey: string) {
  const TESTING_ENDPOINT = '/system/info';

  const testEndpoint = async (baseURL: string, apiKey: string): Promise<APIresponse> => {
    return sendAxiosJellyRequest(new URL(TESTING_ENDPOINT, baseURL), 'get', { Authorization: `Mediabrowser Token="${apiKey}"` });
  };

  const makeAxiosRequestWithHeader = async (endpoint: string, method: 'get' | 'delete'): Promise<APIresponse> => {
    return sendAxiosJellyRequest(new URL(endpoint, baseURL), method, { Authorization: `Mediabrowser Token="${apiKey}"` });
  };
  const fetchData = async (endpoint: string): Promise<APIresponse> => {
    return makeAxiosRequestWithHeader(endpoint, 'get');
  };

  const validate = async (): Promise<APIresponse> => {
    const response = await fetchData(TESTING_ENDPOINT);
    return response;
  };

  const deleteData = async (endpoint: string): Promise<APIresponse> => {
    return makeAxiosRequestWithHeader(endpoint, 'delete');
  };

  const getUsers = async () => {
    return await fetchData('/users');
  };

  const getWatchedMovies = async (userId: string) => {
    return await fetchData(`/users/${userId}/items?IncludeItemTypes=Movie&Recursive=true&Filters=IsPlayed`);
  };

  const getWatchedSeriesAndEpisodes = async (userId: string) => {
    return await fetchData(`/users/${userId}/items?IncludeItemTypes=Series,Episode&Recursive=true&Fields=UserData,SeriesId&Filters=IsPlayed&SortBy=SortName&SortOrder=Ascending`);
  };

  const getSeriesAndEpisodes = async () => {
    return await fetchData('/Items?IncludeItemTypes=Series,Episode&Recursive=true&Fields=MediaSources,SeriesId');
  };

  const getMovies = async () => {
    return await fetchData('/Items?IncludeItemTypes=Movie&Recursive=true&Fields=MediaSources');
  };

  const getAllItems = async () => {
    return await fetchData('/Items?IncludeItemTypes=Movie,Series,Episode&Recursive=true&Fields=MediaSources,SeriesId,SeriesName,DateCreated');
  };

  const getAllWatchedItems = async (userId: string) => {
    return await fetchData(`/users/${userId}/items?IncludeItemTypes=Movie,Episode&Recursive=true&Fields=UserData,SeriesId,LastPlayedDate&Filters=IsPlayed`);
  };

  const deleteItem = async (jellyfinItemId: string): Promise<void> => {
    await deleteData(`/items/${jellyfinItemId}`);
  };

  const deleteItems = async (jellyfinItemIds: string[]): Promise<void> => {
    for (const jellyfinItemId of jellyfinItemIds) {
      await deleteItem(jellyfinItemId);
    }
  };

  return {
    getUsers,
    getWatchedMovies,
    getWatchedSeriesAndEpisodes,
    getSeriesAndEpisodes,
    getMovies,
    deleteItem,
    deleteItems,
    getAllItems,
    getAllWatchedItems,
    validate,
    testEndpoint
  };
}