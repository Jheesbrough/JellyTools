"use client";
import SwaggerAgent from './swaggerAgent';

export default class Jellyseer extends SwaggerAgent {
  constructor(baseURL: string, apiKey: string) {
    super(baseURL, apiKey);
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL + "/api/v1";
  }

  setup() {
    this.headerType = "X-Api-Key";
    this.authEndpoint = "settings/about";
    this.setBaseURL(this.baseURL);
  }
}