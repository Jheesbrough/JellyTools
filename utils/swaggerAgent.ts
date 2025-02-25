"use client";

export default class SwaggerAgent {
  protected apiKey: string;
  protected baseURL: string;
  public authorised: boolean;
  protected headerType: string;
  protected authEndpoint: string;

  constructor(baseURL: string, apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.authorised = false;
    this.headerType = "Authorization";
    this.authEndpoint = "system/info";

    this.setup();

    console.log("SwaggerAgent created with:", this.baseURL, this.apiKey);
    if (this.apiKey && this.baseURL && this.baseURL.length > 0 && this.apiKey.length > 0) {
      this.validate();
    }
  }

  // This is a hook for subclasses to do any setup they need
  setup() {
    return;
  }

  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Makes an HTTP request to the specified path with the given query parameters.
   * Sends a request to the '/api/proxy' endpoint with the necessary details
   * including baseURL, path, query, apiKey, headerType, and method in the request body.
   *
   * @param {string} method - The HTTP method to use for the request (e.g., 'GET', 'POST').
   * @param {string} path - The path to which the request is made.
   * @param {Record<string, string>} [query={}] - An optional object containing query parameters.
   * @returns {Promise<any | null>} - A promise that resolves to the response data in JSON format if the request is successful, or null if an error occurs.
   */
  async makeRequest(method: string, path: string, query: Record<string, string> = {}) {
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseURL: this.baseURL,
          path: path,
          query: query,
          apiKey: this.apiKey,
          headerType: this.headerType,
          method: method,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
      }
    } catch (error) {
      console.log("Error making request:", error);
    }
    return null;
  }

  async validate() {
    try {
      console.log("Validating with:", this.baseURL, this.apiKey);
      const response = await this.makeRequest('GET', this.authEndpoint);
      if (response) {
        this.authorised = true;
        return true;
      }
    } catch (error) {
      console.log("Error validating " + this.baseURL + ":", error);
    }
    this.authorised = false;
    return false;
  }
}
