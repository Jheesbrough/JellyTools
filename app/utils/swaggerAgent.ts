"use client";
const axios = require('axios');

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
    return
  }

  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async makeRequest(path: string, query: Record<string, string> = {}) {
    const url = new URL(`${this.baseURL}/${path}`);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

    try {
      const headers = {
        "Content-Type": "application/json",
        [this.headerType]: this.apiKey,
      };
      console.log("Headers:", headers);

      const response = await axios({
        method: 'get',
        url: url.toString(),
        headers: headers,
        timeout: 10000,
        validateStatus: function (status: number) {
          return status >= 200 && status < 300; // default
        },
        maxRedirects: 5,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error making request:", error);
    }
    return null;
  }

  async validate() {
    try {
      console.log("Validating with:", this.baseURL, this.apiKey);
      const response = await this.makeRequest(this.authEndpoint);
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
