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
    this.validate();
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
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(this.headerType, this.apiKey);
      console.log("Headers:", headers);

      const response = await fetch(url.toString(), {
        headers: headers,
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error making the request: ${error}`);
    }
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
