"use client";
import SwaggerAgent from '@/utils/swaggerAgent';
import { APIresponse } from '@/utils/types';

/**
 * Jellyfin class extends SwaggerAgent to interact with Jellyfin API.
 */
export default class Jellyfin extends SwaggerAgent {
  /**
   * Constructor for Jellyfin class.
   * @param {string} baseURL - The base URL of the Jellyfin server.
   * @param {string} apiKey - The API key for authentication.
   */
  constructor(baseURL: string, apiKey: string) {
    super(baseURL, apiKey);
  }

  /**
   * Sets the API key for authentication.
   * @param {string} apiKey - The API key.
   */
  setApiKey(apiKey: string) {
    this.apiKey = `Mediabrowser Token="${apiKey}"`;
  }

  /**
   * Setup method to initialize the API key.
   */
  setup() {
    this.setApiKey(this.apiKey);
  }

  /**
   * Fetches the list of users.
   * @returns {Promise<any>} - A promise that resolves to the list of users.
   */
  async getUsers() {
    return await this.fetchData('/users');
  }

  /**
   * Fetches the list of watched movies for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<any>} - A promise that resolves to the list of watched movies.
   */
  async getWatchedMovies(userId: string) {
    return await this.fetchData(`/users/${userId}/items?IncludeItemTypes=Movie&Recursive=true&Filters=IsPlayed`);
  }

  /**
   * Fetches the list of watched series and episodes for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<any>} - A promise that resolves to the list of watched series and episodes.
   */
  async getWatchedSeriesAndEpisodes(userId: string) {
    return await this.fetchData(`/users/${userId}/items?IncludeItemTypes=Series,Episode&Recursive=true&Fields=UserData,SeriesId&Filters=IsPlayed&SortBy=SortName&SortOrder=Ascending`);
  }

  /**
   * Fetches the list of all series and episodes.
   * @returns {Promise<any>} - A promise that resolves to the list of series and episodes.
   */
  async getSeriesAndEpisodes() {
    return await this.fetchData('/Items?IncludeItemTypes=Series,Episode&Recursive=true&Fields=MediaSources,SeriesId');
  }

  /**
   * Fetches the list of all movies.
   * @returns {Promise<any>} - A promise that resolves to the list of movies.
   */
  async getMovies() {
    return await this.fetchData('/Items?IncludeItemTypes=Movie&Recursive=true&Fields=MediaSources');
  }

  async deleteItem(jellyfinItemId: string): Promise<void> {
    await this.deleteData(`/items/${jellyfinItemId}`);
  }

  async deleteItems(jellyfinItemIds: string[]): Promise<void> {
    for (const jellyfinItemId of jellyfinItemIds) {
      await this.deleteItem(jellyfinItemId);
    }
  }

  /**
   * Fetches the list of all items.
   * @returns {Promise<any>} - A promise that resolves to the list of all items.
   */
  async getAllItems() {
    return await this.fetchData('/Items?IncludeItemTypes=Movie,Series,Episode&Recursive=true&Fields=MediaSources,SeriesId,SeriesName,DateCreated');
  }

  /**
   * Fetches the list of all watched items for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<any>} - A promise that resolves to the list of watched items.
   */
  async getAllWatchedItems(userId: string) {
    return await this.fetchData(`/users/${userId}/items?IncludeItemTypes=Movie,Episode&Recursive=true&Fields=UserData,SeriesId,LastPlayedDate&Filters=IsPlayed`);
  }

  /**
   * Validates the API key by fetching system info.
   * @returns {Promise<FetchResult>} - A promise that resolves to the fetched validation result.
   */
  async validate(): Promise<APIresponse> {
    const response = await this.fetchData('/system/info');
    this.authorised = response.success;
    return response;
  }

  /**
   * Fetches data from a given endpoint.
   * @param {string} endpoint - The API endpoint to fetch data from.
   * @returns {Promise<FetchResult>} - A promise that resolves to the fetched data.
   */
  private async fetchData(endpoint: string): Promise<APIresponse> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data, error: null };
      } else if (response.status === 404) {
        return { success: false, data: null, error: 'Could not find the requested resource' };
      } else if (response.status === 401) {
        return { success: false, data: null, error: 'Invalid API key' };
      } else if (response.status === 500) {
        return { success: false, data: null, error: 'Internal server error' };
      } else {
        const error = await response.text();
        return { success: false, data: null, error };
      }
    } catch (error) {
      console.log(`Error fetching data from ${endpoint}:`, error);
      return { success: false, data: null, error: (error as Error).message };
    }
  }

  private async deleteData(endpoint: string) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey,
        },
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log(`Error deleting data from ${endpoint}:`, error);
    }
    return false;
  }
}