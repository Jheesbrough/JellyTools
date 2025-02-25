"use client";
import SwaggerAgent from './swaggerAgent';

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

  /**
   * Sets the base URL for the API with the appropriate endpoint.
   * @param baseURL - The base URL to set.
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL + "/api/v1";
  }

  /**
   * Sets up the necessary headers and endpoints for the API.
   */
  setup() {
    this.headerType = "X-Api-Key";
    this.authEndpoint = "settings/about";
    this.setBaseURL(this.baseURL);
  }

  /**
   * Deletes a media item and its associated requests from Jellyfin.
   * @param jellyfinItemId - The ID of the Jellyfin item to delete.
   * @returns A promise that resolves when the item is deleted.
   */
  async deleteItem(jellyfinItemId: string): Promise<void> {
    let res = await this.makeRequest("GET", "media");
    const filteredMedia = res.data.results.filter(
      (item: { jellyfinMediaId: string | null; }) => item.jellyfinMediaId === jellyfinItemId
    );
    if (filteredMedia.length === 0) {
      return;
    }

    const id = filteredMedia[0].id;

    res = await this.makeRequest("GET", `requests`);
    const filteredRequests = res.data.results.filter(
      (item: { id: string | null; }) => item.id === id
    );

    if (filteredRequests.length !== 0) {
      await this.makeRequest("DELETE", `requests/${filteredRequests[0].id}`);
    }

    await this.makeRequest("DELETE", `media/${id}`);
    await this.makeRequest("DELETE", `media/${id}/file`);
  }

  /**
   * Deletes multiple media items and their associated requests from Jellyfin.
   * @param jellyfinItemIds - An array of Jellyfin item IDs to delete.
   * @returns A promise that resolves when all items are deleted.
   */
  async deleteItems(jellyfinItemIds: string[]): Promise<void> {
    let skip = 0;
    const take = 100; // Adjust the number of items to take per request as needed
    let allMedia: any[] = [];
    let res;

    // Fetch all media items with pagination using take and skip
    do {
      res = await this.makeRequest("GET", "media", { filter: "available", take: take.toString(), skip: skip.toString() });
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
      res = await this.makeRequest("GET", `request`, { take: take.toString(), skip: skip.toString() });
      allRequests = allRequests.concat(res.results);
      skip += take;
    } while (res.results.length === take);

    const filteredRequests = allRequests.filter(
      (item: { id: string | null; }) => item.id !== null && mediaIds.includes(item.id)
    );

    for (const request of filteredRequests) {
      await this.makeRequest("DELETE", `request/${request.id}`);
    }

    for (const id of mediaIds) {
      await this.makeRequest("DELETE", `media/${id}/file`);
      await this.makeRequest("DELETE", `media/${id}`);
    }
  }
}