import axios from 'axios';
import { APIresponse } from '@/utils/types';

/**
 * Makes an Axios request to the given endpoint.
 * @param {URL} url - The complete URL for the request.
 * @param {string} method - The HTTP method (GET, DELETE, etc.).
 * @param {Record<string, string>} headers - The headers for the request.
 * @returns {Promise<APIresponse>} - A promise that resolves to the response data.
 */
export async function sendAxiosJellyRequest(url: URL, method: 'get' | 'delete', headers: Record<string, string>): Promise<APIresponse> {
  try {
    const response = await axios({
      method: method,
      url: url.toString(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 10000,
      validateStatus: function (status: number) {
        return status >= 200 && status < 300;
      },
      maxRedirects: 5,
    });

    // Case statement to handle different response status codes
    switch (response.status) {
      case 200:
        return { success: true, data: response.data };
      case 204:
        return { success: true, data: null };
      default:
        return { success: false, error: 'Did not return a recognised status code' };
    }
  }
  catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      switch (error.response.status) {
        case 400:
          return { success: false, error: 'Bad request' };
        case 401:
          return { success: false, error: 'Unauthorized, check your API key' };
        case 403:
          return { success: false, error: 'Unauthorized, check your API key' };
        case 404:
          return { success: false, error: 'Could not find the requested resource, please check the URL' };
        case 500:
          return { success: false, error: 'Media server returned internal server error' };
        default:
          return { success: false, error: 'Unknown error' };
      }
    } else {
      if (axios.isAxiosError(error) && error.code) {
        if (error.code === 'ECONNABORTED') {
          return { success: false, error: 'Request timed out' };
        }
        else if (error.code === 'ENOTFOUND') {
          return { success: false, error: 'Could not find the requested resource, please check the URL' };
        }
      }
      return { success: false, error: "An error occurred while fetching data" };
    }
  }
}
