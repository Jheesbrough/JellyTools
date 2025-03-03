"use client";
import SwaggerAgent from './swaggerAgent';
import axios from 'axios';

/**
 * Jellyseer class extends SwaggerAgent to interact with Jellyfin API.
 */
export default class Jellyseer extends SwaggerAgent {
  /**
   * Constructs a new Jellyseer instance.
   * @param baseURL - The base URL for the API.
   * @param apiKey - The API key for authentication.
   */
  constructor(baseURL: string, apiKey: string) {
    super(baseURL, apiKey);
  }

  async getMedia(): Promise<any> {
    return await this.sendRequest("GET", "media");
  }

  async validate(): Promise<any> {
    const res = await this.sendRequest("GET", "validate");
    if (res.message === "API is valid") {
      this.authorised = true;
    }
    return res;
  }

  /**
   * Deletes a media item and its associated requests from Jellyfin.
   * @param jellyfinItemId - The ID of the Jellyfin item to delete.
   * @returns A promise that resolves when the item is deleted.
   */
  async deleteItem(jellyfinItemId: string): Promise<void> {
    let res = await this.getMedia();
    const filteredMedia = res.results.filter(
      (item: { jellyfinMediaId: string | null; }) => item.jellyfinMediaId === jellyfinItemId
    );
    if (filteredMedia.length === 0) {
      return;
    }

    const id = filteredMedia[0].id;

    res = await this.sendRequest("GET", `requests`);
    const filteredRequests = res.results.filter(
      (item: { id: string | null; }) => item.id === id
    );

    if (filteredRequests.length !== 0) {
      await this.sendRequest("DELETE", `requests/${filteredRequests[0].id}`);
    }

    await this.sendRequest("DELETE", `media/${id}/file`);
    await this.sendRequest("DELETE", `media/${id}`);
  }

  /**
   * Deletes multiple media items and their associated requests from Jellyfin.
   * @param jellyfinItemIds - An array of Jellyfin item IDs to delete.
   * @returns A promise that resolves when all items are deleted.
   */
  async deleteItems(jellyfinItemIds: string[]): Promise<void> {
    let skip = 0;
    const take = 100;
    let allMedia: any[] = [];
    let res;

    // Fetch all media items with pagination using take and skip
    do {
      res = await this.sendRequest("GET", "media", { filter: "available", take: take.toString(), skip: skip.toString() });
      console.log(res);
      allMedia = allMedia.concat(res.results);
      skip += take;
    } while (res.results.length === take);

    const filteredMedia = allMedia.filter(
      (item: { jellyfinMediaId: string | null; }) => item.jellyfinMediaId !== null && jellyfinItemIds.includes(item.jellyfinMediaId)
    );

    if (filteredMedia.length === 0) {
      return;
    }

    const mediaIds = filteredMedia.map((item: { id: string; }) => item.id);

    skip = 0;
    let allRequests: any[] = [];

    // Fetch all requests with pagination using take and skip
    do {
      res = await this.sendRequest("GET", `request`, { take: take.toString(), skip: skip.toString() });
      allRequests = allRequests.concat(res.results);
      skip += take;
    } while (res.results.length === take);

    const filteredRequests = allRequests.filter(
      (item: { id: string | null; }) => item.id !== null && mediaIds.includes(item.id)
    );

    for (const request of filteredRequests) {
      await this.sendRequest("DELETE", `/request/${request.id}`);
    }

    for (const id of mediaIds) {
      await this.sendRequest("DELETE", `/media/${id}/file`);
      await this.sendRequest("DELETE", `/media/${id}`);
    }
  }

  private async sendRequest(method: string, endpoint: string, data: any = null): Promise<any> {
    console.log(`Sending ${method} request to ${endpoint}`);
    // Add the baseURL to data
    if (data) {
      data.baseurl = this.baseURL;
    } else {
      data = { baseurl: this.baseURL };
    }
    const url = `api/jellyseer/${endpoint}`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey
        },
        params: data
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error sending ${method} request to ${endpoint}`, error.message);
      } else {
        console.error(`Error sending ${method} request to ${endpoint}`, error);
      }
      throw new Error('Error making request');
    }
  }
}