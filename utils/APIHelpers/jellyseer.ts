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
  const sendRequest = async (method: string, endpoint: string, data: any = null): Promise<any> => {
    if (data) {
      data.baseurl = baseURL;
    } else {
      data = { baseurl: baseURL };
    }
    const url = `api/jellyseer/${endpoint}`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey
        },
        params: data
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
      } else {
        // Handle non-Axios error
      }
      throw new Error('Error making request');
    }
  };

  const getMedia = async (): Promise<any> => {
    return await sendRequest("GET", "media");
  };

  const validate = async (): Promise<APIresponse> => {
    try {
      const res = await sendRequest("GET", "settings/about");
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
      res = await sendRequest("GET", "media", { take: take.toString(), skip: skip.toString() });
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
      res = await sendRequest("GET", `request`, { take: take.toString(), skip: skip.toString() });
      allRequests = allRequests.concat(res.results);
      skip += take;
    } while (res.results.length === take);

    const filteredRequests = allRequests.filter(
      (item: { id: string | null; }) => item.id !== null && mediaIds.includes(item.id)
    );

    for (const request of filteredRequests) {
      await sendRequest("DELETE", `/request/${request.id}`);
    }

    for (const id of mediaIds) {
      try {
        await sendRequest("DELETE", `/media/${id}/file`);
      } catch (error) {
        // Handle error
      }
      await sendRequest("DELETE", `/media/${id}`);
    }
  };

  return {
    getMedia,
    validate,
    deleteItems,
  };
}