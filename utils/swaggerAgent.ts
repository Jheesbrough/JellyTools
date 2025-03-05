"use client";
import{ APIresponse } from '@/utils/types';

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

    if (this.apiKey && this.baseURL && this.baseURL.length > 0 && this.apiKey.length > 0) {
      this.validate();
    }
  }

  // This is a hook for subclasses to do any setup they need
  protected setup() {
    return;
  }

  async validate(): Promise<APIresponse> {
    return { success: false, data: null, error: "Not implemented" };
  }


  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}
