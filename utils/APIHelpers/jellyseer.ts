"use client";
import axios from 'axios';
import { APIresponse } from '@/utils/types';

/**
 * Creates a Jellyseer instance to interact with Jellyseer API.
 * @param {string} baseURL - The base URL for the API.
 * @param {string} apiKey - The API key for authentication.
 * @returns {object} - An object with methods to interact with the Jellyseer API.
 */
export default function createJellyseer(baseURL: string, apiKey: string) {
  const TESTING_ENDPOINT = "settings/about";

  const sendInternalApiRequest = async (method: string, endpoint: string, data: any = null): Promise<any> => {

    const requestData = data ? { ...data, baseurl: baseURL } : { baseurl: baseURL };
    const url = `api/jellyseer/${endpoint}`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey
        },
        params: requestData
      });

      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error making internal API request' };
    }
  };

  const testEndpoint = async (baseURL: string, apiKey: string): Promise<APIresponse> => {
    try {
      const response = await axios({
        method: 'GET',
        url: `api/jellyseer/${TESTING_ENDPOINT}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey
        },
        params: { baseurl: baseURL }
      });

      return response.data;
    } catch (error) {
      throw new Error('Error making internal API request');
    }
  };

  const getMedia = async (): Promise<any> => {
    return await sendInternalApiRequest("GET", "media");
  };

  const validate = async (): Promise<APIresponse> => {
    try {
      const res = await sendInternalApiRequest("GET", TESTING_ENDPOINT);
      if (res.success) {
        return { success: true };
      } else {
        return { success: false, error: res.error || 'Failed to authenticate with Jellyseer. An unknown error occurred.' };
      }
    } catch (error) {
      return { success: false, error: 'An unknown error occurred.' };
    }
  };

  const deleteItems = async (jellyfinItemIds: string[]): Promise<void> => {
    let skip = 0;
    const take = 100;
    let allMedia: { jellyfinMediaId: string | null; id: string; }[] = [];
    let res;

    do {
      res = await sendInternalApiRequest("GET", "media", { take: take.toString(), skip: skip.toString() });
      allMedia = allMedia.concat(res.results as { jellyfinMediaId: string | null; id: string; }[]);
      skip += take;
    } while (res.results.length === take);

    const filteredMedia = allMedia.filter(
      (item) => item.jellyfinMediaId !== null && jellyfinItemIds.includes(item.jellyfinMediaId)
    );

    if (filteredMedia.length === 0) {
      return;
    }

    const mediaIds = filteredMedia.map((item: { id: string; }) => item.id);

    skip = 0;
    let allRequests: any[] = [];

    do {
      res = await sendInternalApiRequest("GET", `request`, { take: take.toString(), skip: skip.toString() });
      allRequests = allRequests.concat(res.results);
      skip += take;
    } while (res.results.length === take);

    const filteredRequests = allRequests.filter(
      (item: { id: string | null; }) => item.id !== null && mediaIds.includes(item.id)
    );

    for (const request of filteredRequests) {
      await sendInternalApiRequest("DELETE", `/request/${request.id}`);
    }

    for (const id of mediaIds) {
      try {
        await sendInternalApiRequest("DELETE", `/media/${id}/file`);
      } catch (error) {
        // File might not exist, no need to throw error
      }
      await sendInternalApiRequest("DELETE", `/media/${id}`);
    }
  };

  return {
    testEndpoint,
    getMedia,
    validate,
    deleteItems,
  };
}