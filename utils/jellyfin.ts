"use client";
import SwaggerAgent from '@/utils/swaggerAgent';
import { APIresponse } from '@/utils/types';
import { makeAxiosRequest } from '@/utils/axiosUtil';

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
   * Makes an Axios request to the given endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {string} method - The HTTP method (GET, DELETE, etc.).
   * @returns {Promise<APIresponse>} - A promise that resolves to the response data.
   */
  private async makeAxiosRequest(endpoint: string, method: 'get' | 'delete'): Promise<APIresponse> {
    return makeAxiosRequest(new URL(endpoint, this.baseURL), method, { 'Authorization': this.apiKey });
  }

  // Update fetchData and deleteData to use makeAxiosRequest
  private async fetchData(endpoint: string): Promise<APIresponse> {
    return this.makeAxiosRequest(endpoint, 'get');
  }

  private async deleteData(endpoint: string): Promise<APIresponse> {
    return this.makeAxiosRequest(endpoint, 'delete');
  }
}